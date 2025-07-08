// Plan types
export type PlanType = 'STANDARD' | 'PRO';
export type PlanInterval = 'MONTHLY' | 'ANNUALLY';

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';

// Testing environment configuration
const STRIPE_PRODUCTS_TESTING = {
  STANDARD: {
    MONTHLY: {
      USD: 'price_1RfHliCYLHQoHMZC18xUH9Vi',  // $4.90/month subscription
      USD_ONETIME: 'price_1RfHmBCYLHQoHMZCyz3LF9yG'  // $4.90 one-time
    },
    ANNUALLY: {
      USD: 'price_1RfHnsCYLHQoHMZC4ikW8txf',  // $49/year subscription
      USD_ONETIME: 'price_1RfHnsCYLHQoHMZCCAzC7BbN'  // $49 one-time
    }
  },
  PRO: {
    MONTHLY: {
      USD: 'price_1RfHonCYLHQoHMZCEv4XyaG1',  // $9.90/month subscription
      USD_ONETIME: 'price_1RfHonCYLHQoHMZCT0KvFH5L'  // $9.90 one-time
    },
    ANNUALLY: {
      USD: 'price_1RfHplCYLHQoHMZCAgVXPWde',  // $99/year subscription
      USD_ONETIME: 'price_1RfHplCYLHQoHMZCk1vPrefM'  // $99 one-time
    }
  }
} as const;

// Production environment configuration
const STRIPE_PRODUCTS_PRODUCTION = {
  STANDARD: {
    MONTHLY: {
      USD: 'price_1RiES9EJmqlJS80QKPP1w5GA',  // $4.90/month subscription
      USD_ONETIME: 'price_1RiES9EJmqlJS80QDH4al5Pu'  // $4.90 one-time
    },
    ANNUALLY: {
      USD: 'price_1RiESBEJmqlJS80QWssjHE3Q',  // $49/year subscription
      USD_ONETIME: 'price_1RiESCEJmqlJS80QhEirjfcr'  // $49 one-time
    }
  },
  PRO: {
    MONTHLY: {
      USD: 'price_1RiESEEJmqlJS80Q4o0NquIV',  // $9.90/month subscription
      USD_ONETIME: 'price_1RiESEEJmqlJS80QfQl4qv9I'  // $9.90 one-time
    },
    ANNUALLY: {
      USD: 'price_1RiESGEJmqlJS80QRqvV1fSW',  // $99/year subscription
      USD_ONETIME: 'price_1RiESFEJmqlJS80QtxwAjHUg'  // $99 one-time
    }
  }
} as const;

// Select configuration based on environment
export const STRIPE_PRODUCTS = isProduction ? STRIPE_PRODUCTS_PRODUCTION : STRIPE_PRODUCTS_TESTING;

// Testing environment product IDs
const STRIPE_PRODUCTS_IDS_TESTING = {
  STANDARD: {
    MONTHLY: 'prod_SaShLBvy85zVn5',  // Standard Monthly
    ANNUALLY: 'prod_SaSjTLX8wvgSsz'    // Standard Annually
  },
  PRO: {
    MONTHLY: 'prod_SaSkJRitfotMS9',  // Pro Monthly
    ANNUALLY: 'prod_SaSldmzQt9ftz3'    // Pro Annually
  }
} as const;

// Production environment product IDs
const STRIPE_PRODUCTS_IDS_PRODUCTION = {
  STANDARD: {
    MONTHLY: 'prod_SdVT6OGgedd19K',  // Standard Monthly
    ANNUALLY: 'prod_SdVTsMeIfr534P'    // Standard Annually
  },
  PRO: {
    MONTHLY: 'prod_SdVToqD1r3x25s',  // Pro Monthly
    ANNUALLY: 'prod_SdVT7hQOwOZ25A'    // Pro Annually
  }
} as const;

// Select product ID configuration based on environment
export const STRIPE_PRODUCTS_IDS = isProduction ? STRIPE_PRODUCTS_IDS_PRODUCTION : STRIPE_PRODUCTS_IDS_TESTING;

// Helper function: get plan type from priceId
export function getPlanType(priceId: string): PlanType {
  const products = STRIPE_PRODUCTS as any;
  for (const [planType, intervals] of Object.entries(products)) {
    for (const prices of Object.values(intervals as any)) {
      if (Object.values(prices as any).includes(priceId)) {
        return planType as PlanType;
      }
    }
  }
  throw new Error(`Invalid priceId: ${priceId}`);
}

// Helper function: get subscription interval from priceId
export function getPlanInterval(priceId: string): PlanInterval {
  const products = STRIPE_PRODUCTS as any;
  for (const intervals of Object.values(products)) {
    for (const [interval, prices] of Object.entries(intervals as any)) {
      if (Object.values(prices as any).includes(priceId)) {
        return interval as PlanInterval;
      }
    }
  }
  throw new Error(`Invalid priceId: ${priceId}`);
}

// Helper function: check if priceId is subscription type
export function isSubscriptionPrice(priceId: string): boolean {
  const products = STRIPE_PRODUCTS as any;
  for (const intervals of Object.values(products)) {
    for (const prices of Object.values(intervals as any)) {
      if ((prices as any).USD === priceId) {
        return true;
      }
    }
  }
  return false;
}

// Helper function: get price amount (USD)
function createPriceAmounts(): Record<string, number> {
  const products = STRIPE_PRODUCTS as any;
  return {
    [products.STANDARD.MONTHLY.USD]: 4.90,
    [products.STANDARD.MONTHLY.USD_ONETIME]: 4.90,
    [products.STANDARD.ANNUALLY.USD]: 49.00,
    [products.STANDARD.ANNUALLY.USD_ONETIME]: 49.00,
    [products.PRO.MONTHLY.USD]: 9.90,
    [products.PRO.MONTHLY.USD_ONETIME]: 9.90,
    [products.PRO.ANNUALLY.USD]: 99.00,
    [products.PRO.ANNUALLY.USD_ONETIME]: 99.00,
  };
}

export const PRICE_AMOUNTS: Record<string, number> = createPriceAmounts(); 