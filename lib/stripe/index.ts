export interface Metadata {
  // 核心关联信息
  userId: string;
  orderId: string;
  
  // 产品信息 - priceId 包含了所有必要信息
  priceId: string;
  
  // 支付模式 - 用于区分一次性付款和订阅
  mode: string;
}

// 扩展 metadata 接口 - 用于 checkout session 的额外信息
export interface ExtendedMetadata extends Metadata {
  // 支付平台信息 - 仅用于 checkout
  platform: string;
  currency: string;
  expectedAmount: string;
  
  // 应用信息 - 仅用于 checkout  
  createdAt: string;
  version: string;
  source: string;
}