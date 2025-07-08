'use client'

import { useState, useCallback, createContext, useContext, ReactNode } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { UpgradeModal } from '@/components/subscription/UpgradeModal'
import { UsageLimitModal } from '@/components/subscription/UsageLimitModal'
import { AuthModal } from '@/components/auth/AuthModal'

/**
 * 统一的Modal Hooks文件
 * 整合了UpgradeModal、UsageLimitModal和AuthModal的hooks
 */

// ========== Upgrade Modal Hook ==========
export function useUpgradeModal() {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<{
    feature?: string
    title?: string
    description?: string
  }>({})

  const showUpgradeModal = (params?: {
    feature?: string
    title?: string
    description?: string
  }) => {
    setOptions(params || {})
    setOpen(true)
  }

  const hideUpgradeModal = () => {
    setOpen(false)
  }

  const UpgradeModalComponent = () => (
    <UpgradeModal
      open={open}
      onOpenChange={setOpen}
      feature={options.feature}
      title={options.title}
      description={options.description}
    />
  )

  return {
    showUpgradeModal,
    hideUpgradeModal,
    UpgradeModalComponent
  }
}

// ========== Usage Limit Modal Hook ==========
export function useUsageLimitModal() {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<{
    feature: string
    title?: string
    description?: string
  }>({
    feature: ''
  })

  const showUsageLimitModal = (params: {
    feature: string
    title?: string
    description?: string
  }) => {
    setOptions(params)
    setOpen(true)
  }

  const hideUsageLimitModal = () => {
    setOpen(false)
  }

  const UsageLimitModalComponent = () => (
    <UsageLimitModal
      open={open}
      onOpenChange={setOpen}
      feature={options.feature}
      title={options.title}
      description={options.description}
    />
  )

  return {
    showUsageLimitModal,
    hideUsageLimitModal,
    UsageLimitModalComponent
  }
}

// ========== Auth Modal Hook with Context ==========
interface AuthModalContextType {
  showAuthModal: (onSuccess?: () => void) => void
  hideAuthModal: () => void
  isOpen: boolean
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null)

  const showAuthModal = useCallback((onSuccess?: () => void) => {
    setIsOpen(true)
    if (onSuccess) {
      setOnSuccessCallback(() => onSuccess)
    }
  }, [])

  const hideAuthModal = useCallback(() => {
    setIsOpen(false)
    setOnSuccessCallback(null)
  }, [])

  const handleAuthSuccess = useCallback(() => {
    hideAuthModal()
    if (onSuccessCallback) {
      onSuccessCallback()
    }
  }, [hideAuthModal, onSuccessCallback])

  return (
    <AuthModalContext.Provider value={{ showAuthModal, hideAuthModal, isOpen }}>
      {children}
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          hideAuthModal()
        }
      }}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <DialogTitle className="sr-only">Sign in to continue</DialogTitle>
          <DialogDescription className="sr-only">
            Please sign in with your Google account to continue with your subscription.
          </DialogDescription>
          <AuthModal onClose={handleAuthSuccess} />
        </DialogContent>
      </Dialog>
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider')
  }
  return context
}