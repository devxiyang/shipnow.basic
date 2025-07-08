import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getSubscriptionStatus } from '@/lib/action/subscription.action'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/Header'
import { ManageSubscriptionButton } from '@/components/subscription/ManageSubscriptionButton'

export const dynamic = 'force-dynamic'

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export default async function UserProfilePage() {
  // 1. 获取当前用户
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // 未登录，跳转首页或登录页
    redirect('/auth/login')
  }

  // 2. 获取订阅状态
  const subStatusResult = await getSubscriptionStatus(user.id)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <Header />

        <h1 className="text-2xl font-semibold my-6">User Profile</h1>

        {/* 基本信息 */}
        <Card className="p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Account</h2>
            <p className="text-sm text-muted-foreground">Basic user information</p>
          </div>
          <Separator />
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Email</span>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>User ID</span>
              <span className="font-mono truncate max-w-[180px]">{user.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Joined</span>
              <span>{user.created_at ? formatDate(new Date(user.created_at)) : ''}</span>
            </div>
          </div>
        </Card>

        {/* 订阅信息 */}
        <Card className="p-6 space-y-4 mt-8">
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Subscription</h2>
            <p className="text-sm text-muted-foreground">Current subscription status</p>
          </div>
          <Separator />
          {subStatusResult.hasValidSubscription && subStatusResult.subscription ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge>{subStatusResult.subscription.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Plan</span>
                <span>{subStatusResult.subscription.planType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Interval</span>
                <span>{subStatusResult.subscription.interval}</span>
              </div>
              {subStatusResult.subscription.currentPeriodEnd && (
                <div className="flex items-center justify-between">
                  <span>Renewal Date</span>
                  <span>{formatDate(new Date(subStatusResult.subscription.currentPeriodEnd))}</span>
                </div>
              )}
              <div className="pt-2">
                <ManageSubscriptionButton />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No active subscription</p>
          )}
        </Card>
      </div>
    </div>
  )
} 