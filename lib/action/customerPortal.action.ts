'use server'

import { createCustomerPortalSession } from '@/lib/stripe/customer.portal'
import { createClient } from '@/lib/supabase/server'

export interface CreateCustomerPortalSessionResponse {
  success: boolean
  url?: string
  error?: string
}

interface Params {
  returnUrl: string
}

/**
 * Server Action: 创建 Stripe Customer Portal Session
 */
export async function createCustomerPortalSessionAction({ returnUrl }: Params): Promise<CreateCustomerPortalSessionResponse> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized - Please login first'
    }
  }

  try {
    const { url } = await createCustomerPortalSession({
      userId: user.id,
      returnUrl,
    })

    return {
      success: true,
      url,
    }
  } catch (error: any) {
    console.error('Error creating customer portal session:', error)

    if (error instanceof Error && error.message === 'No Stripe customer found for this user') {
      return {
        success: false,
        error: 'No subscription found. Please subscribe first.'
      }
    }

    return {
      success: false,
      error: 'Failed to create customer portal session'
    }
  }
} 