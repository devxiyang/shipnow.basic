'use client'

import { GoogleIcon } from '@/components/icon/google-icon'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface AuthModalProps {
  onClose?: () => void
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle, refreshSession, user } = useAuth()
  const t = useTranslations('auth')

  // Handle authentication completion
  useEffect(() => {
    // Handle popup message
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'auth-ok') {
        setLoading(false)
        toast.success(t('loginSuccessful'))
        onClose?.()
        refreshSession()
      }
    }

    // Handle URL callback
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    
    if (code && loading) {
      refreshSession()
      
      // Clean up URL parameters
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('code')
      newUrl.searchParams.delete('state')
      window.history.replaceState({}, '', newUrl.toString())
      
      setTimeout(() => {
        setLoading(false)
        toast.success(t('loginSuccessful'))
        onClose?.()
      }, 1000)
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [loading, onClose, refreshSession, t])

  // Fallback: detect successful login through user state
  useEffect(() => {
    if (loading && user) {
      setLoading(false)
      toast.success(t('loginSuccessful'))
      onClose?.()
    }
  }, [loading, user, onClose, t])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const { error } = await signInWithGoogle()
      
      if (error) {
        toast.error(error.message || t('loginFailed'))
        setLoading(false)
      }
      // Don't set loading to false here as the user will be redirected
      // If there's no error, the user will be redirected to Google's OAuth page
    } catch {
      toast.error(t('loginFailed'))
      setLoading(false)
    }
  }

  return (
    <div className="w-full p-6 relative bg-background rounded-lg">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 rounded-full"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Logo 
            showText={false}
            iconSize="md"
            href=""
          />
        </div>
        <h2 className="text-lg font-semibold mb-1">{t('signInTitle')}</h2>
        <p className="text-sm text-muted-foreground">{t('signInSubtitle')}</p>
      </div>
      <div className="space-y-4">
        <Button 
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full h-11"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="mr-2" size={18} />
          )}
          {loading ? t('signingIn') : t('continueWithGoogle')}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          {t('termsPrivacy')}
        </p>

      </div>
    </div>
  )
} 