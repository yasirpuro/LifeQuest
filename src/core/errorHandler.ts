/**
 * ERROR HANDLER
 * 
 * Centralized error handling and user-friendly error messages
 */

export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type ErrorSeverity = typeof ErrorSeverity[keyof typeof ErrorSeverity];

export interface ErrorContext {
  severity: ErrorSeverity;
  userMessage: string;
  technicalMessage?: string;
  action?: string;
}

const ERROR_MESSAGES: Record<string, ErrorContext> = {
  NETWORK_ERROR: {
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'İnternet bağlantısı yok. Lütfen bağlantınızı kontrol edin.',
    technicalMessage: 'Network request failed',
    action: 'Bağlantınızı kontrol edin ve tekrar deneyin.',
  },
  VALIDATION_ERROR: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Lütfen tüm alanları doğru doldurun.',
    technicalMessage: 'Validation failed',
    action: 'Form alanlarını kontrol edin.',
  },
  NOT_FOUND: {
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Kayıt bulunamadı.',
    technicalMessage: 'Resource not found',
    action: 'Sayfayı yenileyin veya başka bir işlem deneyin.',
  },
  CONFLICT: {
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Bu işlem zaten yapılmış.',
    technicalMessage: 'Resource conflict',
    action: 'Lütfen başka bir işlem deneyin.',
  },
  PERMISSION_DENIED: {
    severity: ErrorSeverity.HIGH,
    userMessage: 'Bu işlem için yetkiniz yok.',
    technicalMessage: 'Permission denied',
    action: 'Premium özellik için yükseltin veya destek ile iletişime geçin.',
  },
  UNKNOWN: {
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Bir hata oluştu. Lütfen tekrar deneyin.',
    technicalMessage: 'Unknown error',
    action: 'Sayfayı yenileyin ve tekrar deneyin.',
  },
};

const ERROR_SEVERITY: Record<string, ErrorSeverity> = {
  NETWORK_ERROR: ErrorSeverity.MEDIUM,
  VALIDATION_ERROR: ErrorSeverity.LOW,
  NOT_FOUND: ErrorSeverity.MEDIUM,
  CONFLICT: ErrorSeverity.MEDIUM,
  PERMISSION_DENIED: ErrorSeverity.HIGH,
  UNKNOWN: ErrorSeverity.MEDIUM,
};

/**
 * Format error for user display
 */
export function formatError(error: string | Error | { message?: string; error?: string; code?: string } | null | undefined, code?: string | Record<string, any>): string {
  const errorMessage = error instanceof Error
    ? error.message
    : typeof error === 'string'
      ? error
      : error?.message || error?.error || '';
  const errorCode = typeof code === 'string'
    ? code
    : (code as any)?.code || (error as any)?.code || 'UNKNOWN';

  const context = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.UNKNOWN;
  return context.userMessage || errorMessage || ERROR_MESSAGES.UNKNOWN.userMessage;
}

/**
 * Get error severity
 */
export function getErrorSeverity(code?: string): ErrorSeverity {
  if (!code) return ErrorSeverity.MEDIUM;
  return ERROR_SEVERITY[code] || ErrorSeverity.MEDIUM;
}

/**
 * Log error (in production, send to analytics)
 */
export function logError(error: Error | string, context?: Record<string, any>): void {
  const errorMessage = error instanceof Error ? error.message : error;
  console.error('[ErrorHandler]', errorMessage, context);
  
  // In production, send to analytics service
  if (import.meta.env.PROD) {
    // Send to analytics
    console.warn('Production error logging not implemented');
  }
}

/**
 * ErrorHandler class
 */
export class ErrorHandler {
  private errors: Map<string, ErrorContext> = new Map();

  constructor() {
    this.errors = new Map(Object.entries(ERROR_MESSAGES));
  }

  /**
   * Get error context
   */
  getContext(code: string): ErrorContext {
    return this.errors.get(code) || ERROR_MESSAGES.UNKNOWN;
  }

  /**
   * Format error for user
   */
  format(error: string | Error, code?: string): string {
    return formatError(error, code);
  }

  /**
   * Log error
   */
  log(error: Error | string, context?: Record<string, any>): void {
    logError(error, context);
  }
}

// Singleton instance
export const errorHandler = new ErrorHandler();
