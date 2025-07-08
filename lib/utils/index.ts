/**
 * Utility functions for the SaaS template
 * Provides convenient imports for all common utility functions
 */

// Core utilities
export { cn } from '../utils';

// Formatting utilities
export {
  formatNumber,
  formatDate,
  formatRelativeTime,
  formatTimestamp,
  formatFileSize,
  formatPrice,
  formatPercentage,
  formatUrl,
  formatUsername,
  truncateText
} from './formatters';

// Time utilities
export {
  nowUTC,
  stripeTimestampToUTC,
  toUTC,
  isAfterUTC,
  isBeforeUTC,
  timeDiffUTC,
  getQueryTimeRangeUTC,
  getOneTimePurchaseExpiryUTC,
  getTodayUTCString,
  isSameDayUTC,
  formatUTCString,
  parseUTCString,
  createUTCDate,
  debugTimeUTC
} from './time';

// Error handling utilities
export {
  AppError,
  ERROR_CODES,
  handleActionError,
  handleNetworkError,
  handleError,
  createErrorBoundaryHandler,
  withErrorHandling,
  createErrorResponse,
  createSuccessResponse
} from './error-handler';

// Error types
export type { 
  ErrorCode, 
  ErrorResponse, 
  SuccessResponse, 
  ApiResponse 
} from './error-handler';

// Legacy exports
export { ERROR_TYPES } from './error-handler';