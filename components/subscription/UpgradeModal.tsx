'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSubscription } from '@/lib/subscription'
import { Crown, Zap, Check, X, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { STRIPE_PRODUCTS, PRICE_AMOUNTS } from '@/config/stripe.config'
import { createCheckoutSessionAction } from '@/lib/action/checkout.action'
import { toast } from 'sonner'
import { useAuthModal } from '@/lib/hooks/useModals'

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature?: string
  title?: string
  description?: string
}

type BillingInterval = 'monthly' | 'annually'

// 从 config 中获取价格
const getPricing = () => {
  return {
    STANDARD: {
      monthly: PRICE_AMOUNTS[STRIPE_PRODUCTS.STANDARD.MONTHLY.USD] || 4.90,
      annually: PRICE_AMOUNTS[STRIPE_PRODUCTS.STANDARD.ANNUALLY.USD] || 49.00,
      monthlyEquivalent: Math.round((PRICE_AMOUNTS[STRIPE_PRODUCTS.STANDARD.ANNUALLY.USD] || 49.00) / 12 * 100) / 100
    },
    PRO: {
      monthly: PRICE_AMOUNTS[STRIPE_PRODUCTS.PRO.MONTHLY.USD] || 9.90,
      annually: PRICE_AMOUNTS[STRIPE_PRODUCTS.PRO.ANNUALLY.USD] || 99.00,
      monthlyEquivalent: Math.round((PRICE_AMOUNTS[STRIPE_PRODUCTS.PRO.ANNUALLY.USD] || 99.00) / 12 * 100) / 100
    }
  }
}

export function UpgradeModal({ 
  open,
  onOpenChange,
  feature,
  title,
  description
}: UpgradeModalProps) {
  const { isAnonymous } = useSubscription()
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly')
  const [loadingPlan, setLoadingPlan] = useState<'STANDARD' | 'PRO' | null>(null)
  const { showAuthModal } = useAuthModal()
  
  const defaultTitle = feature 
    ? `Unlock ${feature}` 
    : 'Choose Your Plan'
  
  const defaultDescription = isAnonymous 
    ? 'Sign in and upgrade to access premium features'
    : 'Upgrade your plan to access this feature'

  const handleUpgrade = async (plan: 'STANDARD' | 'PRO') => {
    // 检查是否已登录
    if (isAnonymous) {
      // 未登录用户引导登录
      onOpenChange(false) // 关闭升级模态框
      
      // 使用 requestAnimationFrame 确保升级模态框完全关闭后再打开登录模态框
      requestAnimationFrame(() => {
        showAuthModal(() => {
          // 登录成功后重新打开升级模态框
          setTimeout(() => {
            onOpenChange(true)
          }, 100) // 短暂延迟确保模态框正确切换
        })
      })
      
      toast.info('Please sign in first to continue with your subscription')
      return
    }

    try {
      setLoadingPlan(plan)
      
      // 根据计划和计费周期获取正确的 price ID
      const priceId = billingInterval === 'monthly' 
        ? STRIPE_PRODUCTS[plan].MONTHLY.USD
        : STRIPE_PRODUCTS[plan].ANNUALLY.USD

      // 构造带参数的URL
      const successUrl = new URL(window.location.href)
      successUrl.searchParams.set('checkout', 'success')
      
      const cancelUrl = new URL(window.location.href)
      cancelUrl.searchParams.set('checkout', 'cancelled')

      // 创建 checkout session
      const result = await createCheckoutSessionAction({
        priceId,
        successUrl: successUrl.toString(),
        cancelUrl: cancelUrl.toString()
      })

      if (result.success && result.sessionUrl) {
        // 原地跳转到 Stripe Checkout
        window.location.href = result.sessionUrl
      } else {
        throw new Error(result.error || 'Failed to create checkout session')
      }
    } catch {
      toast.error('Failed to start checkout. Please try again.')
      setLoadingPlan(null)
    }
  }

  const pricing = getPricing()

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center space-y-3 pb-4">
            <DialogTitle className="text-2xl font-semibold">{title || defaultTitle}</DialogTitle>
            <DialogDescription className="text-base">{description || defaultDescription}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
              {/* Billing Toggle */}
              <div className="flex justify-center">
                <div className="inline-flex items-center rounded-lg border bg-muted p-1">
                  <button
                    onClick={() => setBillingInterval('monthly')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      billingInterval === 'monthly'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingInterval('annually')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      billingInterval === 'annually'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Annually <span className="text-primary ml-1">2 months free</span>
                  </button>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Standard Plan */}
                <div className="relative rounded-lg border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Zap className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Standard Plan</h3>
                      <p className="text-sm text-muted-foreground">Perfect for regular users</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        ${billingInterval === 'monthly' 
                          ? pricing.STANDARD.monthly 
                          : pricing.STANDARD.monthlyEquivalent
                        }
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    {billingInterval === 'annually' && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Billed annually at ${pricing.STANDARD.annually}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Unlimited API calls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">All premium features</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Data export</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-destructive" />
                      <span className="text-sm text-muted-foreground">Advanced analytics</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleUpgrade('STANDARD')}
                    variant="outline"
                    className="w-full"
                    size="lg"
                    disabled={loadingPlan !== null}
                  >
                    {loadingPlan === 'STANDARD' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Checkout...
                      </>
                    ) : (
                      'Get Started'
                    )}
                  </Button>
                </div>
                
                {/* Pro Plan */}
                <div className="relative rounded-lg border-2 border-primary p-6">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Recommended
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Crown className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Pro Plan</h3>
                      <p className="text-sm text-muted-foreground">For power users</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        ${billingInterval === 'monthly' 
                          ? pricing.PRO.monthly 
                          : pricing.PRO.monthlyEquivalent
                        }
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    {billingInterval === 'annually' && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Billed annually at ${pricing.PRO.annually}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Unlimited API calls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">All premium features</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Data export</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">Advanced analytics</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleUpgrade('PRO')}
                    className="w-full"
                    size="lg"
                    disabled={loadingPlan !== null}
                  >
                    {loadingPlan === 'PRO' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Checkout...
                      </>
                    ) : (
                      'Get Pro'
                    )}
                  </Button>
                </div>
              </div>
          </div>
          
          <div className="text-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}