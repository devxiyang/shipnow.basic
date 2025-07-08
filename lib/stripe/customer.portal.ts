import { stripe } from './client';
import { prisma } from '../prisma';
import { PaymentPlatform } from '@prisma/client';
import { nowUTC, isAfterUTC } from '@/lib/utils/time';

export interface CreatePortalSessionParams {
  userId: string;
  returnUrl: string;
}

/**
 * 为用户创建Customer Portal会话
 * 根据硬地骇客建议：用户可以在这里管理订阅、查看账单、修改付款方式等
 */
export async function createCustomerPortalSession({
  userId,
  returnUrl,
}: CreatePortalSessionParams) {
  // 1. 查找用户的customerId
  const order = await prisma.order.findFirst({
    where: {
      userId,
      platform: PaymentPlatform.STRIPE,
      platformCustomerId: { not: null },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!order?.platformCustomerId) {
    throw new Error('No Stripe customer found for this user');
  }

  // 2. 创建Customer Portal会话
  const session = await stripe.billingPortal.sessions.create({
    customer: order.platformCustomerId,
    return_url: returnUrl,
  });

  return {
    url: session.url,
  };
}

/**
 * 获取用户的订阅状态
 * 方便前端判断是否显示"管理订阅"按钮
 */
export async function getUserSubscriptionStatus(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      platform: PaymentPlatform.STRIPE,
      status: { in: ['ACTIVE', 'TRIALING', 'PAST_DUE'] },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!subscription) {
    return null;
  }

  return {
    id: subscription.id,
    status: subscription.status,
    planType: subscription.planType,
    interval: subscription.planInterval,
    currentPeriodEnd: subscription.currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    customerId: subscription.platformCustomerId,
  };
}

/**
 * 检查用户是否有有效订阅（使用UTC时间）
 */
export async function hasValidSubscription(userId: string): Promise<boolean> {
  const subscription = await getUserSubscriptionStatus(userId);
  
  if (!subscription) {
    return false;
  }

  // 使用UTC时间检查订阅是否还在有效期内
  const now = nowUTC();
  const isActive = subscription.status === 'ACTIVE' || subscription.status === 'TRIALING';
  const notExpired = subscription.currentPeriodEnd ? isAfterUTC(subscription.currentPeriodEnd, now) : true;
  
  return isActive && notExpired;
} 