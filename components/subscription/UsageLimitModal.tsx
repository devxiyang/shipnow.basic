'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSubscription } from '@/lib/subscription'
import { Clock, TrendingUp, AlertCircle } from 'lucide-react'

interface UsageLimitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature: string
  title?: string
  description?: string
}

export function UsageLimitModal({ 
  open,
  onOpenChange,
  title,
  description
}: UsageLimitModalProps) {
  const { redirectToCheckout, isAnonymous } = useSubscription()
  
  const defaultTitle = title || `Daily limit reached`
  const defaultDescription = description || (
    isAnonymous 
      ? 'Sign up to get more daily usage, or upgrade for unlimited access'
      : 'You\'ve used all your free attempts today. Upgrade for unlimited access'
  )

  const handleUpgrade = (plan: 'STANDARD' | 'PRO') => {
    redirectToCheckout(plan)
    onOpenChange(false)
  }

  const handleTryTomorrow = () => {
    onOpenChange(false)
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-orange-600" />
          </div>
          <DialogTitle>{defaultTitle}</DialogTitle>
          <DialogDescription>{defaultDescription}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 text-sm text-muted-foreground">
              <div className="font-medium">Usage resets daily</div>
              <div className="text-xs">New attempts available at midnight</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={() => handleUpgrade('STANDARD')}
              className="flex items-center justify-between h-auto py-4 px-6"
              size="lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Get Unlimited Access</div>
                  <div className="text-sm opacity-90">No more daily limits</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">$4.90</div>
                <div className="text-xs opacity-90">/month</div>
              </div>
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleTryTomorrow}
              className="flex-1"
            >
              Try Tomorrow
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}