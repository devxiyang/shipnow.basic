import { stripe } from './client';
import { STRIPE_PRODUCTS, getPlanInterval, getPlanType, isSubscriptionPrice, PRICE_AMOUNTS } from '../../config/stripe.config';
import { prisma } from '../prisma';
import { OrderStatus, ProductType, PaymentPlatform, Currency } from '@prisma/client';
import { Metadata, ExtendedMetadata } from './index';
import { formatUTCString, nowUTC } from '@/lib/utils/time';

export interface CreateCheckoutParams {
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}

// 获取或创建 Stripe Customer（在事务中安全执行）
async function getOrCreateStripeCustomer(userId: string, tx: any): Promise<string> {
  // 1. 在事务中查找用户是否已经有 Stripe Customer
  const existingOrder = await tx.order.findFirst({
    where: {
      userId,
      platform: PaymentPlatform.STRIPE,
      platformCustomerId: { not: null },
    },
  });

  if (existingOrder?.platformCustomerId) {
    console.debug(`Found existing Stripe customer ${existingOrder.platformCustomerId} for user ${userId}`);
    return existingOrder.platformCustomerId;
  }

  // 2. 如果没有创建过订单，通过userId从stripe获取customer
  const existingCustomer = await stripe.customers.search({
    query: `metadata['userId']:'${userId}'`,
  });
  if (existingCustomer.data.length > 0) {
    console.debug(`Found existing Stripe customer ${existingCustomer.data[0].id} for user ${userId}`);
    return existingCustomer.data[0].id;
  }

  // 3. 如果还没在stripe创建过customer，创建新的 Stripe Customer
  console.debug(`Creating new Stripe customer for user ${userId}`);
  const customer = await stripe.customers.create({
    metadata: {
      userId,
      source: 'shipnow_checkout',
    },
  });

  console.debug(`Created Stripe customer ${customer.id} for user ${userId}`);
  return customer.id;
}

export async function createCheckoutSession({
  priceId,
  userId,
  successUrl,
  cancelUrl,
}: CreateCheckoutParams) {
  // 1. 验证价格ID
  const products = STRIPE_PRODUCTS as any;
  if (!Object.values(products).some(intervals =>
    Object.values(intervals as any).some(prices =>
      Object.values(prices as any).includes(priceId)
    )
  )) {
    throw new Error(`Invalid priceId: ${priceId}`);
  }

  // 2. 确定支付模式和产品信息
  const mode = isSubscriptionPrice(priceId) ? ProductType.SUBSCRIPTION : ProductType.ONE_TIME;
  const planType = getPlanType(priceId);
  const planInterval = getPlanInterval(priceId);
  
  // 3. 获取价格金额
  const priceAmount = PRICE_AMOUNTS[priceId as keyof typeof PRICE_AMOUNTS] || 0;
  
  // 4. 在事务中安全地创建客户和订单
  const { customerId, order } = await prisma.$transaction(async (tx) => {
    // 4.1. 获取或创建 Stripe Customer
    const customerId = await getOrCreateStripeCustomer(userId, tx);
    
    // 4.2. 创建订单
    const order = await tx.order.create({
      data: {
        userId,
        // 交易信息
        amount: priceAmount,
        currency: Currency.USD,
        status: OrderStatus.PENDING,

        // 商品信息
        productType: mode,
        planType,
        planInterval,

        // 平台信息
        platform: PaymentPlatform.STRIPE,
        platformCustomerId: customerId, // 保存 Stripe Customer ID
        priceId,

        // 元数据 - 使用简化的核心字段
        metadata: {
          priceId,
          userId,
          mode,
        },
      },
    });
    
    return { customerId, order };
  });

  // 5. 准备 metadata
  // 核心 metadata - 会传递给订阅
  const coreMetadata: Metadata = {
    userId,
    orderId: order.id,
    priceId,
    mode,
  };
  
  // 扩展 metadata - 仅用于 checkout session（使用UTC时间）
  const extendedMetadata: ExtendedMetadata = {
    ...coreMetadata,
    platform: PaymentPlatform.STRIPE,
    currency: Currency.USD,
    expectedAmount: priceAmount.toString(),
    createdAt: formatUTCString(nowUTC()),
    version: 'v1',
    source: 'checkout_api',
  };

  // 6. 创建Checkout Session
  const session = await stripe.checkout.sessions.create({
    // 转为stripe的mode
    mode: mode === ProductType.SUBSCRIPTION ? 'subscription' : 'payment',
    // 关联到现有客户，避免重复创建
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    // 场景简单，直接使用订单ID作为client_reference_id
    client_reference_id: order.id,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      ...extendedMetadata,
    },
    
    // 如果是订阅，添加订阅相关元数据（只传递核心字段）
    ...(mode === ProductType.SUBSCRIPTION && {
      subscription_data: {
        metadata: {
          ...coreMetadata,
        },
      },
    }),
    
    // 启用税务计算（如果需要）
    automatic_tax: {
      enabled: false,
    },
    
    // 添加发票数据（仅限一次性支付模式）
    ...(mode === ProductType.ONE_TIME && {
      invoice_creation: {
        enabled: true,
        invoice_data: {
          metadata: {
            orderId: order.id,
            userId,
            planType,
          },
        },
      },
    }),
  });

  // 7. 更新订单的sessionId
  await prisma.order.update({
    where: { id: order.id },
    data: {
      sessionId: session.id,
    },
  });

  return {
    sessionId: session.id,
    sessionUrl: session.url,
  };
}

// 根据sessionId查找订单
export async function getOrderBySessionId(sessionId: string) {
  return prisma.order.findUnique({
    where: {
      platform_sessionId: {
        platform: PaymentPlatform.STRIPE,
        sessionId,
      },
    },
  });
}

// 更新订单状态
export async function updateOrderStatus(orderId: string, status: Extract<OrderStatus, 'COMPLETED' | 'FAILED'>) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
} 