'use server'

import { prisma } from '@/lib/prisma'
import { getQueryTimeRangeUTC } from '@/lib/utils/time'
import { OrderStatus, PlanInterval } from '@prisma/client'

export interface OrderInfo {
  id: string
  amount: number
  currency: string
  status: string
  productType: string
  planType?: string | null
  planInterval?: string | null
  createdAt: Date
  completedAt?: Date | null
}

export async function getUserValidOrders(userId: string): Promise<OrderInfo[]> {
  if (!userId) return []

  const { monthlyRange, annuallyRange } = getQueryTimeRangeUTC()

  const orders = await prisma.order.findMany({
    where: {
      userId,
      status: OrderStatus.COMPLETED,
      OR: [
        // 月度一次性或订阅订单：最近2个月
        {
          planInterval: PlanInterval.MONTHLY,
          completedAt: { gt: monthlyRange }
        },
        // 年度一次性或订阅订单：最近13个月
        {
          planInterval: PlanInterval.ANNUALLY,
          completedAt: { gt: annuallyRange }
        },
        // 没有周期信息（备用）
        {
          planInterval: null
        }
      ]
    },
    orderBy: { createdAt: 'desc' },
  })

  return orders.map(o => ({
    id: o.id,
    amount: o.amount,
    currency: o.currency,
    status: o.status,
    productType: o.productType,
    planType: o.planType,
    planInterval: o.planInterval,
    createdAt: o.createdAt,
    completedAt: o.completedAt,
  }))
} 