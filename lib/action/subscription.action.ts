'use server'

import { prisma } from '@/lib/prisma'
import {
  debugTimeUTC,
  getOneTimePurchaseExpiryUTC,
  getQueryTimeRangeUTC,
  isBeforeUTC
} from '@/lib/utils/time'
import { OrderStatus, PaymentPlatform, ProductType } from '@prisma/client'

export interface SubscriptionStatusResult {
  subscription: {
    id: string
    status: string
    planType: 'STANDARD' | 'PRO'
    interval: string
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean
    customerId: string | null
    source: 'subscription' | 'order' // 标记权限来源
  } | null
  hasValidSubscription: boolean
}

/**
 * Server Action: 获取用户订阅状态
 * 时区安全的查询逻辑：统一使用UTC时间，根据周期动态计算时间范围
 */
export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatusResult> {
  if (!userId) {
    return { subscription: null, hasValidSubscription: false }
  }

  try {
    // 使用UTC时间工具
    const { now, monthlyRange, annuallyRange } = getQueryTimeRangeUTC()
    
    // 调试信息（生产环境可移除）
    if (process.env.NODE_ENV === 'development') {
      debugTimeUTC(now, 'Query time (UTC)')
      debugTimeUTC(monthlyRange, 'Monthly range (UTC)')
      debugTimeUTC(annuallyRange, 'Annual range (UTC)')
    }

    // 1. 查询有效的订阅（时区安全的查询）
    const validSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        platform: PaymentPlatform.STRIPE,
        status: { in: ['ACTIVE', 'TRIALING'] },
        AND: [
          // 状态和过期时间检查（UTC时间比较）
          {
            OR: [
              // TRIALING 状态：试用期未过期
              {
                status: 'TRIALING',
                trialEnd: { gt: now }
              },
              // ACTIVE 状态：付费期未过期
              {
                status: 'ACTIVE',
                currentPeriodEnd: { gt: now }
              }
            ]
          },
          // 根据周期优化查询范围（UTC时间范围）
          {
            OR: [
              // 月度订阅：查询最近2个月
              {
                planInterval: 'MONTHLY',
                createdAt: { gt: monthlyRange }
              },
              // 年度订阅：查询最近13个月
              {
                planInterval: 'ANNUALLY', 
                createdAt: { gt: annuallyRange }
              }
            ]
          }
        ]
      },
      orderBy: { createdAt: 'desc' },
    })

    // 2. 如果找到有效订阅，直接返回
    if (validSubscription) {
      return {
        subscription: {
          id: validSubscription.id,
          status: validSubscription.status,
          planType: validSubscription.planType as 'STANDARD' | 'PRO',
          interval: validSubscription.planInterval,
          currentPeriodEnd: validSubscription.currentPeriodEnd,
          cancelAtPeriodEnd: validSubscription.cancelAtPeriodEnd,
          customerId: validSubscription.platformCustomerId,
          source: 'subscription'
        },
        hasValidSubscription: true
      }
    }

    // 3. 查询有效的一次性购买（时区安全的查询）
    const validOrder = await prisma.order.findFirst({
      where: {
        userId,
        platform: PaymentPlatform.STRIPE,
        status: OrderStatus.COMPLETED,
        productType: ProductType.ONE_TIME,
        planType: { in: ['STANDARD', 'PRO'] },
        completedAt: { not: null },
        OR: [
          // 月度一次性购买：查询过去2个月内完成的订单
          {
            planInterval: 'MONTHLY',
            completedAt: { gt: monthlyRange }
          },
          // 年度一次性购买：查询过去13个月内完成的订单
          {
            planInterval: 'ANNUALLY',
            completedAt: { gt: annuallyRange }
          }
        ]
      },
      orderBy: { completedAt: 'desc' },
    })

    // 4. 如果找到一次性购买，检查是否仍在有效期内（时区安全）
    if (validOrder && validOrder.completedAt) {
      const expiryDate = getOneTimePurchaseExpiryUTC(
        validOrder.completedAt, 
        validOrder.planInterval || 'MONTHLY'
      )
      
      if (process.env.NODE_ENV === 'development') {
        debugTimeUTC(validOrder.completedAt, 'Order completed (UTC)')
        debugTimeUTC(expiryDate, 'Order expiry (UTC)')
      }
      
      // 使用UTC时间比较检查是否还在有效期内
      if (isBeforeUTC(now, expiryDate)) {
        return {
          subscription: {
            id: validOrder.id,
            status: 'ACTIVE',
            planType: validOrder.planType as 'STANDARD' | 'PRO',
            interval: validOrder.planInterval || 'MONTHLY',
            currentPeriodEnd: expiryDate,
            cancelAtPeriodEnd: false,
            customerId: validOrder.platformCustomerId,
            source: 'order'
          },
          hasValidSubscription: true
        }
      }
    }

    // 5. 既没有有效订阅也没有有效订单
    return {
      subscription: null,
      hasValidSubscription: false
    }

  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return {
      subscription: null,
      hasValidSubscription: false
    }
  }
} 