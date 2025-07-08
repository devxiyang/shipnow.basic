'use client'

import { createCustomerPortalSessionAction } from '@/lib/action/customerPortal.action'
import { getSubscriptionStatus } from '@/lib/action/subscription.action'
import { getFeatureConfig } from '@/config/subscription.config'
import { UsageTracker } from '@/lib/subscription/usage-tracker'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/lib/auth'

interface SubscriptionInfo {
  id: string
  status: string
  planType: 'STANDARD' | 'PRO'
  interval: string
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
  customerId: string | null
}

interface UseSubscriptionReturn {
  // 简单状态判断
  isAnonymous: boolean
  isLoggedIn: boolean
  isStandard: boolean
  isPro: boolean
  isLoading: boolean
  
  // 通用使用次数检查
  canUse: (featureKey: string) => boolean
  getRemainingUsage: (featureKey: string) => number
  consumeUsage: (featureKey: string) => Promise<boolean>
  
  // 工具函数
  refreshSubscription: () => Promise<void>
  redirectToCheckout: (plan: 'STANDARD' | 'PRO') => void
  openCustomerPortal: () => void
  
  // 基础信息（需要时使用）
  planType: 'STANDARD' | 'PRO' | null
  renewalDate: Date | null
  subscription: SubscriptionInfo | null
}

const SubscriptionContext = createContext<UseSubscriptionReturn | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastFetch, setLastFetch] = useState(0)
  
  const usageTracker = useMemo(() => new UsageTracker(), [])
  
  const REFRESH_INTERVAL = 10 * 60 * 1000
  
  const fetchSubscription = useCallback(async (force = false) => {
    if (!user) {
      setSubscription(null)
      setLoading(false)
      return
    }
    
    const now = Date.now()
    if (!force && now - lastFetch < REFRESH_INTERVAL) {
      return
    }
    
    try {
      setLoading(true)
      
      const result = await getSubscriptionStatus(user.id)
      
      if (result.subscription) {
        const subscriptionData = {
          id: result.subscription.id,
          status: result.subscription.status,
          planType: result.subscription.planType,
          interval: result.subscription.interval,
          currentPeriodEnd: result.subscription.currentPeriodEnd,
          cancelAtPeriodEnd: result.subscription.cancelAtPeriodEnd,
          customerId: result.subscription.customerId
        }
        setSubscription(subscriptionData)
      } else {
        setSubscription(null)
      }
      
      setLastFetch(now)
    } catch {
      setSubscription(null)
    } finally {
      setLoading(false)
    }
  }, [user, lastFetch, REFRESH_INTERVAL])
  
  useEffect(() => {
    if (!authLoading) {
      fetchSubscription()
    }
  }, [user, authLoading, fetchSubscription])
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('checkout') === 'success' && user) {
      
      const refreshWithRetry = async () => {
        await fetchSubscription(true)
        
        let retryCount = 0
        const maxRetries = 10
        const retryInterval = 3000
        
        const pollSubscription = async () => {
          if (retryCount >= maxRetries) {
            return
          }
          
          setTimeout(async () => {
            retryCount++
            await fetchSubscription(true)
            
            const currentStatus = await getSubscriptionStatus(user.id)
            if (!currentStatus.hasValidSubscription && retryCount < maxRetries) {
              pollSubscription()
            }
          }, retryInterval)
        }
        
        const initialStatus = await getSubscriptionStatus(user.id)
        if (!initialStatus.hasValidSubscription) {
          pollSubscription()
        }
      }
      
      refreshWithRetry()
      
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('checkout')
      window.history.replaceState({}, '', newUrl.toString())
    }
  }, [user, fetchSubscription])
  
  useEffect(() => {
    const handleFocus = () => {
      const now = Date.now()
      if (now - lastFetch > 2 * 60 * 1000) {
        fetchSubscription()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchSubscription, lastFetch])
  
  const isAnonymous = !user
  const isLoggedIn = !!user
  const isStandard = subscription?.planType === 'STANDARD'
  const isPro = subscription?.planType === 'PRO'
  const planType = subscription?.planType || null
  const renewalDate = subscription?.currentPeriodEnd || null
  
  const canUse = useCallback((featureKey: string): boolean => {
    const config = getFeatureConfig(featureKey)
    if (!config) {
      return false
    }
    
    if (config.requiresPlan) {
      if (config.requiresPlan === 'PRO' && !isPro) {
        return false
      }
      if (config.requiresPlan === 'STANDARD' && !isStandard && !isPro) {
        return false
      }
      
      if (config.requiresPlan === 'PRO' && isPro) {
        return true
      }
      if (config.requiresPlan === 'STANDARD' && (isStandard || isPro)) {
        return true
      }
    }
    
    const limit = isLoggedIn ? config.loggedLimit : config.freeLimit
    
    if (limit === -1) {
      return isPro || isStandard
    }
    
    if (isPro || isStandard) {
      return limit > 0 || limit === -1
    }
    
    return usageTracker.canUse(featureKey, limit)
  }, [isPro, isStandard, isLoggedIn, usageTracker])
  
  const getRemainingUsage = useCallback((featureKey: string): number => {
    const config = getFeatureConfig(featureKey)
    if (!config) return 0
    
    const limit = isLoggedIn ? config.loggedLimit : config.freeLimit
    
    if (limit === -1) {
      return (isPro || isStandard) ? Infinity : 0
    }
    
    if (isPro || isStandard) {
      return limit > 0 ? Infinity : 0
    }
    
    return usageTracker.getRemainingUsage(featureKey, limit)
  }, [isPro, isStandard, isLoggedIn, usageTracker])
  
  const consumeUsage = useCallback(async (featureKey: string): Promise<boolean> => {
    if (!canUse(featureKey)) return false
    
    const config = getFeatureConfig(featureKey)
    if (!config) return false
    
    const limit = isLoggedIn ? config.loggedLimit : config.freeLimit
    
    if (limit === -1 || isPro || isStandard) return true
    
    usageTracker.consumeUsage(featureKey)
    return true
  }, [canUse, isPro, isStandard, isLoggedIn, usageTracker])
  
  const refreshSubscription = useCallback(async () => {
    await fetchSubscription(true)
  }, [fetchSubscription])
  
  const redirectToCheckout = useCallback((plan: 'STANDARD' | 'PRO') => {
    window.location.href = `/checkout?plan=${plan}`
  }, [])
  
  const openCustomerPortal = useCallback(async () => {
    if (!user || !subscription) return
    
    try {
      const result = await createCustomerPortalSessionAction({ returnUrl: window.location.href })
      if (result.success && result.url) {
        window.location.href = result.url
      }
    } catch {
    }
  }, [user, subscription])
  
  const value: UseSubscriptionReturn = {
    isAnonymous,
    isLoggedIn,
    isStandard,
    isPro,
    isLoading: authLoading || loading,
    
    canUse,
    getRemainingUsage,
    consumeUsage,
    
    refreshSubscription,
    redirectToCheckout,
    openCustomerPortal,
    
    planType,
    renewalDate,
    subscription
  }
  
  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}