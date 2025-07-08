// Feature configuration system for SaaS template
export interface FeatureConfig {
  freeLimit: number      // Anonymous user daily limit
  loggedLimit: number    // Logged-in user daily limit  
  requiresPlan?: 'STANDARD' | 'PRO'  // Required minimum plan
}

// Example feature configurations - customize these for your SaaS
export const FEATURE_CONFIG: Record<string, FeatureConfig> = {
  'api_calls': { 
    freeLimit: 10, 
    loggedLimit: 100,
    requiresPlan: 'STANDARD'
  },
  'advanced_analytics': { 
    freeLimit: 0, 
    loggedLimit: 0,
    requiresPlan: 'PRO'
  },
  'export_data': { 
    freeLimit: 1, 
    loggedLimit: 10 
  },
  'custom_reports': { 
    freeLimit: 0, 
    loggedLimit: 5,
    requiresPlan: 'STANDARD'
  },
  'priority_support': {
    freeLimit: 0,
    loggedLimit: 0,
    requiresPlan: 'PRO'
  },
}

// Helper functions for feature management
export function updateFeatureConfig(featureKey: string, config: Partial<FeatureConfig>) {
  FEATURE_CONFIG[featureKey] = { ...FEATURE_CONFIG[featureKey], ...config }
}

export function addFeature(featureKey: string, config: FeatureConfig) {
  FEATURE_CONFIG[featureKey] = config
}

export function getFeatureConfig(featureKey: string): FeatureConfig | null {
  return FEATURE_CONFIG[featureKey] || null
}