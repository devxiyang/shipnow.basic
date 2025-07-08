import {
  debugTimeUTC,
  formatUTCString,
  nowUTC,
  stripeTimestampToUTC
} from '@/lib/utils/time';
import { EventStatus, OrderStatus, PaymentPlatform, SubscriptionStatus } from '@prisma/client';
import { Stripe } from 'stripe';
import { prisma } from '../prisma';
import { stripe } from './client';
import { getPlanInterval, getPlanType } from '../../config/stripe.config';
import { Metadata } from './index';

// 订阅变化类型
interface SubscriptionChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  type: 'status_change' | 'plan_change' | 'cancel_change' | 'period_change' | 'other';
}

// Webhook事件类型
export const WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  CHARGE_REFUNDED: 'charge.refunded',
} as const;

// 主要的webhook事件处理函数
export async function handleWebhookEvent(event: Stripe.Event) {
  // 幂等性控制：根据硬地骇客建议，检查事件是否已处理
  const existingEvent = await prisma.paymentEvent.findUnique({
    where: { id: event.id },
  });
  
  if (existingEvent && existingEvent.status === EventStatus.SUCCESS) {
    console.debug(`Event ${event.id} already processed successfully, skipping`);
    return;
  }
  
  // 提取业务ID
  const { orderId, subscriptionId, userId } = await extractEventIds(event);
  
  // 1. 创建或更新事件记录（使用UTC时间）
  const currentTime = nowUTC();
  await prisma.paymentEvent.upsert({
    where: { id: event.id },
    create: {
      id: event.id,
      platform: PaymentPlatform.STRIPE,
      type: event.type,
      data: event.data.object as any,
      status: EventStatus.PENDING,
      orderId,
      subscriptionId,
      userId,
      createdAt: currentTime,
    },
    update: {
      status: EventStatus.PENDING,
      error: null,
      processedAt: null,
      orderId,
      subscriptionId,
      userId,
    },
  });

  try {
    // 2. 根据事件类型处理
    switch (event.type) {
      case WEBHOOK_EVENTS.CHECKOUT_COMPLETED:
        await handleCheckoutCompleted(event);
        break;
      case WEBHOOK_EVENTS.SUBSCRIPTION_CREATED:
        await handleSubscriptionCreated(event);
        break;
      case WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED:
        await handleSubscriptionUpdated(event);
        break;
      case WEBHOOK_EVENTS.SUBSCRIPTION_DELETED:
        await handleSubscriptionDeleted(event);
        break;
      case WEBHOOK_EVENTS.CHARGE_REFUNDED:
        await handleChargeRefunded(event);
        break;
      default:
        // 对于未处理的事件类型，只记录但不处理
        console.debug(`Unhandled event type: ${event.type}`);
    }

    // 3. 更新事件状态为成功（使用UTC时间）
    await prisma.paymentEvent.update({
      where: { id: event.id },
      data: {
        status: EventStatus.SUCCESS,
        processedAt: nowUTC(),
      },
    });
  } catch (error) {
    // 4. 如果处理失败，更新事件状态（使用UTC时间）
    await prisma.paymentEvent.update({
      where: { id: event.id },
      data: {
        status: EventStatus.FAILED,
        error: error instanceof Error ? error.message : 'Unknown error',
        processedAt: nowUTC(),
      },
    });
    throw error;
  }
}

// 处理Checkout完成事件
async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  // 场景简单，直接使用订单ID作为client_reference_id
  const orderId = session.client_reference_id;

  if (!orderId) {
    throw new Error('Missing client_reference_id in session');
  }

  // 1. 更新订单状态（使用UTC时间）
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.COMPLETED,
      platformCustomerId: session.customer as string,
      completedAt: nowUTC(), // 使用当前UTC时间
      updatedAt: nowUTC(),
    },
  });
}

// 处理订阅创建事件
async function handleSubscriptionCreated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const metadata = subscription.metadata as unknown as Metadata;
  
  // 获取订阅信息，使用UTC时间工具转换Stripe时间戳
  const firstItem = subscription.items.data[0];
  const priceId = firstItem?.price?.id || '';
  
  // 使用UTC时间工具转换Stripe时间戳
  const currentPeriodStart = firstItem?.current_period_start ? stripeTimestampToUTC(firstItem.current_period_start) : null;
  const currentPeriodEnd = firstItem?.current_period_end ? stripeTimestampToUTC(firstItem.current_period_end) : null;
  const trialStart = subscription.trial_start ? stripeTimestampToUTC(subscription.trial_start) : null;
  const trialEnd = subscription.trial_end ? stripeTimestampToUTC(subscription.trial_end) : null;
  const canceledAt = subscription.canceled_at ? stripeTimestampToUTC(subscription.canceled_at) : null;
  
  // 从 priceId 动态获取计划信息
  const planType = getPlanType(priceId);
  const planInterval = getPlanInterval(priceId);
  
  // 调试信息（生产环境可移除）
  if (process.env.NODE_ENV === 'development') {
    console.debug(`Creating subscription ${subscription.id}:`);
    if (currentPeriodStart) debugTimeUTC(currentPeriodStart, 'Period start');
    if (currentPeriodEnd) debugTimeUTC(currentPeriodEnd, 'Period end');
    if (trialStart) debugTimeUTC(trialStart, 'Trial start');
    if (trialEnd) debugTimeUTC(trialEnd, 'Trial end');
  }
  
  // 使用 upsert 防止重复处理导致的插入错误
  await prisma.subscription.upsert({
    where: {
      platform_platformSubscriptionId: {
        platform: PaymentPlatform.STRIPE,
        platformSubscriptionId: subscription.id,
      },
    },
    create: {
      // 核心关联字段
      userId: metadata.userId,
      orderId: metadata.orderId,
      priceId,
      platform: PaymentPlatform.STRIPE,
      platformSubscriptionId: subscription.id,
      platformCustomerId: subscription.customer as string,
      
      // 订阅状态和计划
      status: subscription.status.toUpperCase() as SubscriptionStatus,
      planType,
      planInterval,
      
      // 订阅周期信息（UTC时间）
      currentPeriodStart,
      currentPeriodEnd,
      
      // 试用期信息（UTC时间）
      trialStart,
      trialEnd,
      
      // 取消相关信息（UTC时间）
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      canceledAt,
      cancelReason: subscription.cancellation_details as any,
      
      // 激活时间：如果创建时就是 active 状态，设置激活时间（UTC）
      activatedAt: subscription.status === 'active' ? nowUTC() : null,
      createdAt: nowUTC(),
    },
    update: {
      // 如果已存在，更新所有字段（处理事件乱序情况）
      status: subscription.status.toUpperCase() as SubscriptionStatus,
      priceId,
      planType,
      planInterval,
      platformCustomerId: subscription.customer as string,
      currentPeriodStart,
      currentPeriodEnd,
      trialStart,
      trialEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      canceledAt,
      cancelReason: subscription.cancellation_details as any,
      updatedAt: nowUTC(),
    },
  });
  
  console.debug(`Subscription ${subscription.id} created with status: ${subscription.status}`);
}

// 处理订阅更新事件
async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const previousAttributes = (event.data.previous_attributes || {}) as Partial<Stripe.Subscription>;
  
  // 获取第一个订阅项目的当前周期信息，使用UTC时间工具转换
  const firstItem = subscription.items.data[0];
  const currentPeriodStart = firstItem?.current_period_start ? stripeTimestampToUTC(firstItem.current_period_start) : null;
  const currentPeriodEnd = firstItem?.current_period_end ? stripeTimestampToUTC(firstItem.current_period_end) : null;
  const priceId = firstItem?.price?.id || '';
  
  // 转换其他时间字段
  const trialStart = subscription.trial_start ? stripeTimestampToUTC(subscription.trial_start) : null;
  const trialEnd = subscription.trial_end ? stripeTimestampToUTC(subscription.trial_end) : null;
  const canceledAt = subscription.canceled_at ? stripeTimestampToUTC(subscription.canceled_at) : null;
  
  // 获取当前订阅记录以便比较变化
  const existingSubscription = await prisma.subscription.findUnique({
    where: {
      platform_platformSubscriptionId: {
        platform: PaymentPlatform.STRIPE,
        platformSubscriptionId: subscription.id,
      },
    },
  });
  
  if (!existingSubscription) {
    console.warn(`Subscription ${subscription.id} not found in database`);
    return;
  }
  
  // 分析订阅变化
  const changes = analyzeSubscriptionChanges(subscription, previousAttributes);
  
  // 记录变化日志
  if (changes.length > 0) {
    console.debug(`Subscription ${subscription.id} changes:`, changes);
  }
  
  // 调试信息（生产环境可移除）
  if (process.env.NODE_ENV === 'development') {
    console.debug(`Updating subscription ${subscription.id}:`);
    if (currentPeriodStart) debugTimeUTC(currentPeriodStart, 'New period start');
    if (currentPeriodEnd) debugTimeUTC(currentPeriodEnd, 'New period end');
  }
  
  // 更新订阅数据库表（使用UTC时间）
  await prisma.subscription.update({
    where: {
      platform_platformSubscriptionId: {
        platform: PaymentPlatform.STRIPE,
        platformSubscriptionId: subscription.id,
      },
    },
    data: {
      status: subscription.status.toUpperCase() as SubscriptionStatus,
      // 更新价格ID（可能会发生计划变更）
      priceId,
      planType: getPlanType(priceId),
      planInterval: getPlanInterval(priceId),
      platformCustomerId: subscription.customer as string,
      // 订阅周期 - 从订阅项目获取（UTC时间）
      currentPeriodStart,
      currentPeriodEnd,
      // 试用期信息（UTC时间）
      trialStart,
      trialEnd,
      // 订阅取消时间（UTC时间）
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      canceledAt,
      cancelReason: subscription.cancellation_details as any,
      // 激活时间：当状态变为 ACTIVE 时设置（UTC时间）
      activatedAt: subscription.status === 'active' && previousAttributes.status !== 'active' ? nowUTC() : existingSubscription.activatedAt,
      // 存储变更前的属性
      previous_attributes: previousAttributes as any,
      updatedAt: nowUTC(),
    },
  });
  
  // 根据变化执行业务逻辑
  await executeSubscriptionBusinessLogic(subscription, changes);
}

// 处理订阅删除事件
async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  
  await prisma.subscription.update({
    where: {
      platform_platformSubscriptionId: {
        platform: PaymentPlatform.STRIPE,
        platformSubscriptionId: subscription.id,
      },
    },
    data: {
      status: SubscriptionStatus.CANCELED,
      canceledAt: nowUTC(), // 使用当前UTC时间
      updatedAt: nowUTC(),
    },
  });
}

// 处理费用退款事件
async function handleChargeRefunded(event: Stripe.Event) {
  const charge = event.data.object as Stripe.Charge;
  const paymentIntentId = charge.payment_intent as string;
  
  if (!paymentIntentId) {
    console.warn(`No payment_intent found in charge ${charge.id}`);
    return;
  }
  
  try {
    // 通过 payment_intent_id 反查 checkout session
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntentId,
      limit: 1, // 通常一个 payment_intent 只对应一个 session
    });
    
    if (sessions.data.length === 0) {
      console.warn(`No checkout session found for payment_intent ${paymentIntentId}`);
      return;
    }

    // 从session中获取orderId
    const session = sessions.data[0];
    const metadata = session.metadata as unknown as Metadata;
    const orderId = session.client_reference_id || metadata.orderId;
    
    if (!orderId) {
      console.warn(`No client_reference_id found in session ${session.id}`);
      return;
    }
    
    // 更新订单状态为退款（使用UTC时间）
    const refundTime = nowUTC();
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.REFUNDED,
        refundedAt: refundTime,
        updatedAt: refundTime,
      },
    });
    
    console.debug(`✅ Order ${orderId} marked as refunded for charge ${charge.id} at ${formatUTCString(refundTime)}`);
    
    // 如果是订阅相关的退款，可以在这里添加额外的业务逻辑
    // 例如：暂停服务、发送通知邮件等
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    
    if (order) {
      // 通过orderId查找关联的订阅（逻辑关联，无外键约束）
      const subscription = await prisma.subscription.findUnique({
        where: { orderId: orderId },
      });
      
      if (subscription) {
        console.debug(`📋 Refund affects subscription ${subscription.platformSubscriptionId}`);
        // TODO: 根据业务需求处理订阅相关的退款逻辑
        // 例如：立即取消订阅、或者只是记录但保持订阅继续
      }
    }
    
  } catch (error) {
    console.error(`Error processing refund for charge ${charge.id}:`, error);
    throw error;
  }
}

// 从事件中提取业务ID的辅助函数
async function extractEventIds(event: Stripe.Event): Promise<{
  orderId?: string;
  subscriptionId?: string;
  userId?: string;
}> {
  const result: { orderId?: string; subscriptionId?: string; userId?: string } = {};
  
  switch (event.type) {
    case WEBHOOK_EVENTS.CHECKOUT_COMPLETED: {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata as unknown as Metadata;
      result.orderId = session.client_reference_id || metadata?.orderId;
      result.userId = metadata?.userId;
      break;
    }
    
    case WEBHOOK_EVENTS.SUBSCRIPTION_CREATED:
    case WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED:
    case WEBHOOK_EVENTS.SUBSCRIPTION_DELETED: {
      const subscription = event.data.object as Stripe.Subscription;
      const metadata = subscription.metadata as unknown as Metadata;
      result.subscriptionId = subscription.id;
      result.orderId = metadata?.orderId;
      result.userId = metadata?.userId;
      break;
    }
    
    case WEBHOOK_EVENTS.CHARGE_REFUNDED: {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId = charge.payment_intent as string;
      
      if (paymentIntentId) {
        try {
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: paymentIntentId,
            limit: 1,
          });
          
          if (sessions.data.length > 0) {
            const session = sessions.data[0];
            const metadata = session.metadata as unknown as Metadata;
            result.orderId = session.client_reference_id || metadata?.orderId;
            result.userId = metadata?.userId;
          }
        } catch (error) {
          console.warn(`Failed to extract IDs from charge refund event: ${error}`);
        }
      }
      break;
    }
  }
  
  return result;
}

// 分析订阅变化
function analyzeSubscriptionChanges(
  subscription: Stripe.Subscription,
  previousAttributes: Partial<Stripe.Subscription>
): SubscriptionChange[] {
  const changes: SubscriptionChange[] = [];
  
  // 检查状态变化
  if (previousAttributes.status && previousAttributes.status !== subscription.status) {
    changes.push({
      field: 'status',
      oldValue: previousAttributes.status,
      newValue: subscription.status,
      type: 'status_change',
    });
  }
  
  // 检查取消状态变化
  if (previousAttributes.cancel_at_period_end !== undefined && 
      previousAttributes.cancel_at_period_end !== subscription.cancel_at_period_end) {
    changes.push({
      field: 'cancel_at_period_end',
      oldValue: previousAttributes.cancel_at_period_end,
      newValue: subscription.cancel_at_period_end,
      type: 'cancel_change',
    });
  }
  
  // 检查计划变更（价格变化）
  const currentPriceId = subscription.items.data[0]?.price?.id;
  const previousItems = previousAttributes.items as any;
  const previousPriceId = previousItems?.data?.[0]?.price?.id;
  
  if (previousPriceId && previousPriceId !== currentPriceId) {
    changes.push({
      field: 'price_id',
      oldValue: previousPriceId,
      newValue: currentPriceId,
      type: 'plan_change',
    });
  }
  
  return changes;
}

// 根据订阅变化执行业务逻辑
async function executeSubscriptionBusinessLogic(
  subscription: Stripe.Subscription,
  changes: SubscriptionChange[]
): Promise<void> {
  for (const change of changes) {
    switch (change.type) {
      case 'status_change':
        await handleStatusChange(subscription, change.oldValue as string, change.newValue as string);
        break;
        
      case 'plan_change':
        await handlePlanChange(subscription, change.oldValue as string, change.newValue as string);
        break;
        
      case 'cancel_change':
        await handleCancelChange(subscription, change.oldValue as boolean, change.newValue as boolean);
        break;
        
      default:
        console.debug(`Unhandled change type: ${change.type}`, change);
    }
  }
}

// 处理状态变化
async function handleStatusChange(subscription: Stripe.Subscription, oldStatus: string, newStatus: string): Promise<void> {
  console.debug(`Subscription ${subscription.id} status changed: ${oldStatus} -> ${newStatus}`);
  
  // 从 incomplete 变为 active：用户成功付款，开通服务
  if (oldStatus === 'incomplete' && newStatus === 'active') {
    console.debug(`🎉 Subscription ${subscription.id} activated! User should now have access to services.`);
    // TODO: 在这里添加开通服务的逻辑
    // 例如：更新用户权限、发送欢迎邮件等
  }
  
  // 变为 past_due：提醒用户更新付款方式
  if (newStatus === 'past_due') {
    console.debug(`⚠️ Subscription ${subscription.id} is past due. User should update payment method.`);
    // TODO: 发送付款提醒邮件
  }
  
  // 变为 unpaid：暂停服务
  if (newStatus === 'unpaid') {
    console.debug(`🚫 Subscription ${subscription.id} is unpaid. Suspending services.`);
    // TODO: 暂停用户服务
  }
}

// 处理计划变更
async function handlePlanChange(subscription: Stripe.Subscription, oldPriceId: string, newPriceId: string): Promise<void> {
  console.debug(`Subscription ${subscription.id} plan changed: ${oldPriceId} -> ${newPriceId}`);
  
  const oldPlanType = getPlanType(oldPriceId);
  const newPlanType = getPlanType(newPriceId);
  
  if (oldPlanType !== newPlanType) {
    console.debug(`Plan type changed: ${oldPlanType} -> ${newPlanType}`);
    // TODO: 更新用户权限和配额
  }
  
  const oldInterval = getPlanInterval(oldPriceId);
  const newInterval = getPlanInterval(newPriceId);
  
  if (oldInterval !== newInterval) {
    console.debug(`Billing interval changed: ${oldInterval} -> ${newInterval}`);
    // TODO: 如果需要，处理计费周期变更逻辑
  }
}

// 处理取消状态变更
async function handleCancelChange(subscription: Stripe.Subscription, oldCancelAtPeriodEnd: boolean, newCancelAtPeriodEnd: boolean): Promise<void> {
  if (!oldCancelAtPeriodEnd && newCancelAtPeriodEnd) {
    console.debug(`📅 Subscription ${subscription.id} will be canceled at period end`);
    // TODO: 发送取消确认邮件，提醒服务将在周期结束时停止
  } else if (oldCancelAtPeriodEnd && !newCancelAtPeriodEnd) {
    console.debug(`🔄 Subscription ${subscription.id} reactivated! Cancellation removed.`);
    // TODO: 发送重新激活确认邮件
  }
} 