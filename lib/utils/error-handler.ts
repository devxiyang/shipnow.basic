import { toast } from 'sonner';

// Error codes - using descriptive strings instead of numbers
export const ERROR_CODES = {
  // Authentication errors
  USER_NOT_AUTHENTICATED: 'USER_NOT_AUTHENTICATED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  
  // Authorization errors
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
  USAGE_LIMIT_EXCEEDED: 'USAGE_LIMIT_EXCEEDED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  
  // Validation errors
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // System errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// Default user-friendly messages for each error code
const DEFAULT_ERROR_MESSAGES: Record<ErrorCode, string> = {
  // Authentication errors
  [ERROR_CODES.USER_NOT_AUTHENTICATED]: "Please sign in to continue.",
  [ERROR_CODES.INVALID_CREDENTIALS]: "Invalid email or password.",
  [ERROR_CODES.SESSION_EXPIRED]: "Your session has expired. Please sign in again.",
  
  // Authorization errors
  [ERROR_CODES.SUBSCRIPTION_REQUIRED]: "This feature requires a subscription.",
  [ERROR_CODES.USAGE_LIMIT_EXCEEDED]: "You've reached your usage limit. Please upgrade your plan.",
  [ERROR_CODES.INSUFFICIENT_PERMISSIONS]: "You don't have permission to perform this action.",
  
  // Resource errors
  [ERROR_CODES.RESOURCE_NOT_FOUND]: "The requested resource was not found.",
  [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: "This resource already exists.",
  
  // Validation errors
  [ERROR_CODES.INVALID_INPUT]: "Please check your input and try again.",
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: "Please fill in all required fields.",
  
  // System errors
  [ERROR_CODES.NETWORK_ERROR]: "Network error. Please check your connection.",
  [ERROR_CODES.SERVER_ERROR]: "Something went wrong. Please try again later.",
  [ERROR_CODES.DATABASE_ERROR]: "Database error. Please try again later.",
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: "External service error. Please try again later.",
};

// Application error class
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message?: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message || DEFAULT_ERROR_MESSAGES[code]);
    this.name = 'AppError';
  }
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: any;
  };
}

/**
 * Success response structure
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

/**
 * Create an error response
 */
export function createErrorResponse(
  code: ErrorCode,
  message?: string,
  details?: any
): ErrorResponse {
  return {
    success: false,
    error: {
      code,
      message: message || DEFAULT_ERROR_MESSAGES[code],
      details
    }
  };
}

/**
 * Create a success response
 */
export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data
  };
}

/**
 * Handle and display errors
 */
export function handleError(error: unknown, context?: string): void {
  if (error instanceof AppError) {
    console.error(`[${context || 'Error'}] ${error.code}:`, error.message, error.details);
    toast.error(error.message);
  } else if (error instanceof Error) {
    console.error(`[${context || 'Error'}]`, error);
    toast.error(DEFAULT_ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR]);
  } else if (typeof error === 'string') {
    console.error(`[${context || 'Error'}]`, error);
    toast.error(error);
  } else {
    console.error(`[${context || 'Error'}]`, error);
    toast.error(DEFAULT_ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR]);
  }
}

/**
 * Handle server action errors with proper error codes
 */
export function handleActionError(error: unknown, context?: string): ErrorResponse {
  if (error instanceof AppError) {
    console.error(`[${context || 'Action'}] ${error.code}:`, error.message);
    return createErrorResponse(error.code, error.message, error.details);
  }
  
  // Map common error messages to error codes
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('not authenticated') || message.includes('unauthorized')) {
      return createErrorResponse(ERROR_CODES.USER_NOT_AUTHENTICATED);
    }
    if (message.includes('subscription')) {
      return createErrorResponse(ERROR_CODES.SUBSCRIPTION_REQUIRED);
    }
    if (message.includes('limit')) {
      return createErrorResponse(ERROR_CODES.USAGE_LIMIT_EXCEEDED);
    }
    if (message.includes('not found')) {
      return createErrorResponse(ERROR_CODES.RESOURCE_NOT_FOUND);
    }
    if (message.includes('already exists')) {
      return createErrorResponse(ERROR_CODES.RESOURCE_ALREADY_EXISTS);
    }
    if (message.includes('invalid') || message.includes('validation')) {
      return createErrorResponse(ERROR_CODES.INVALID_INPUT);
    }
    if (message.includes('network')) {
      return createErrorResponse(ERROR_CODES.NETWORK_ERROR);
    }
    
    console.error(`[${context || 'Action'}]`, error);
    return createErrorResponse(ERROR_CODES.SERVER_ERROR, error.message);
  }
  
  console.error(`[${context || 'Action'}]`, error);
  return createErrorResponse(ERROR_CODES.SERVER_ERROR);
}

/**
 * Handle network errors
 */
export function handleNetworkError(error: unknown, context?: string): void {
  console.error(`[Network Error${context ? ` - ${context}` : ''}]`, error);
  toast.error(DEFAULT_ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR]);
}

/**
 * Handle permission errors
 */
export function handlePermissionError(featureName?: string): void {
  const message = featureName 
    ? `Access denied for ${featureName}. Please upgrade your plan.`
    : DEFAULT_ERROR_MESSAGES[ERROR_CODES.INSUFFICIENT_PERMISSIONS];
  
  toast.error(message);
}

/**
 * Create error boundary handler
 */
export function createErrorBoundaryHandler(component: string) {
  return function handleComponentError(error: Error, errorInfo: any) {
    console.error(`[Error Boundary - ${component}]`, error, errorInfo);
    toast.error(`Something went wrong in ${component}. Please refresh the page.`);
  };
}

/**
 * Async operation error handling wrapper
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: string
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      return null;
    }
  };
}

// Legacy exports for backward compatibility
export const ERROR_TYPES = ERROR_CODES;