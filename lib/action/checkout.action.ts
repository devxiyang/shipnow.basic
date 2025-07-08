'use server'

import { createCheckoutSession } from '@/lib/stripe/checkout'
import { createClient } from '@/lib/supabase/server'

export interface CreateCheckoutSessionResponse {
  success: boolean
  sessionUrl?: string
  error?: string
}

interface Params {
  priceId: string
  successUrl?: string
  cancelUrl?: string
}

/**
 * Server Action: 创建 Stripe Checkout Session
 * 1. 必须在服务端验证用户身份
 * 2. 调用现有的 createCheckoutSession 封装
 */
export async function createCheckoutSessionAction({ priceId, successUrl, cancelUrl }: Params): Promise<CreateCheckoutSessionResponse> {
  // 获取当前用户（从 Cookie）
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized - Please login first'
    }
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const { sessionUrl } = await createCheckoutSession({
      priceId,
      userId: user.id,
      successUrl: successUrl || `${baseUrl}/settings?checkout=success`,
      cancelUrl: cancelUrl || `${baseUrl}/settings?checkout=cancelled`,
    })

    return {
      success: true,
      sessionUrl: sessionUrl || undefined,
    }
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return {
      success: false,
      error: error?.message || 'Internal server error',
    }
  }
} 