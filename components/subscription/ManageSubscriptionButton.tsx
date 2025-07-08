'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createCustomerPortalSessionAction } from '@/lib/action/customerPortal.action'
import { toast } from 'sonner'

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)

  const handleOpenPortal = async () => {
    try {
      setLoading(true)
      const res = await createCustomerPortalSessionAction({ returnUrl: window.location.href })
      if (res.success && res.url) {
        window.open(res.url, '_blank')
      } else {
        toast.error(res.error || 'Failed to open portal')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to open portal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleOpenPortal} disabled={loading} variant="outline">
      {loading ? 'Opening...' : '🔧 Manage Subscription'}
    </Button>
  )
} 