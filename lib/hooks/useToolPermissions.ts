'use client'

import { useSubscription } from '@/lib/subscription'
import { useUpgradeModal, useUsageLimitModal, useAuthModal } from '@/lib/hooks/useModals'
import { toast } from 'sonner'

interface UseToolPermissionsReturn {
  canUse: boolean
  remainingUsage: number
  isLoading: boolean
  checkPermissionAndConsume: () => Promise<boolean>
  showUpgradeModal: () => void
  showUsageLimitModal: (params: { feature: string; title?: string; description?: string }) => void
  showAuthModal: () => void
}

export function useToolPermissions(featureId: string): UseToolPermissionsReturn {
  const { 
    isAnonymous, 
    canUse, 
    getRemainingUsage, 
    consumeUsage,
    isLoading: subLoading
  } = useSubscription()
  
  const { showUpgradeModal } = useUpgradeModal()
  const { showUsageLimitModal } = useUsageLimitModal()
  const { showAuthModal } = useAuthModal()

  const canUseFeature = subLoading ? true : canUse(featureId)
  const remainingUsage = subLoading ? 0 : getRemainingUsage(featureId)

  const checkPermissionAndConsume = async (): Promise<boolean> => {
    if (isAnonymous) {
      showAuthModal()
      return false
    }

    if (!canUseFeature) {
      if (remainingUsage <= 0) {
        showUsageLimitModal({ feature: featureId })
      } else {
        showUpgradeModal()
      }
      return false
    }

    try {
      const success = await consumeUsage(featureId)
      if (!success) {
        toast.error('Failed to consume usage')
        return false
      }
      return true
    } catch (error) {
      console.error('Error consuming usage:', error)
      toast.error('Failed to consume usage')
      return false
    }
  }

  return {
    canUse: canUseFeature,
    remainingUsage,
    isLoading: subLoading,
    checkPermissionAndConsume,
    showUpgradeModal,
    showUsageLimitModal,
    showAuthModal
  }
}