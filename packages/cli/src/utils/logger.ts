/**
 * Logger utility for BLAH CLI
 * Controls logging based on environment and verbosity settings
 */

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.BLAH_DEBUG === 'true';

/**
 * Logger class with environment-aware logging
 */
class Logger {
  private context: string;
  
  /**
   * Create a new logger instance
   * @param context The context/module name for this logger
   */
  constructor(context: string) {
    this.context = context;
  }

  /**
   * Log information message (only in development)
   * @param message The message to log
   * @param data Optional data to include
   */
  info(message: string, data?: any): void {
    if (isDevelopment) {
      const dataString = data ? `: ${JSON.stringify(data, null, 2)}` : '';
      console.log(`[${this.context}] ${message}${dataString}`);
    }
  }

  /**
   * Log debug message (only in development, more detailed than info)
   * @param message The message to log
   * @param data Optional data to include
   */
  debug(message: string, data?: any): void {
    if (isDevelopment) {
      const dataString = data ? `: ${JSON.stringify(data, null, 2)}` : '';
      console.log(`[${this.context}] DEBUG: ${message}${dataString}`);
    }
  }

  /**
   * Log warning message (always shown)
   * @param message The message to log
   * @param data Optional data to include
   */
  warn(message: string, data?: any): void {
    const dataString = data ? `: ${JSON.stringify(data, null, 2)}` : '';
    console.warn(`[${this.context}] WARNING: ${message}${dataString}`);
  }

  /**
   * Log error message (always shown)
   * @param message The message to log
   * @param error Optional error to include
   */
  error(message: string, error?: any): void {
    const errorString = error ? `: ${error instanceof Error ? error.message : JSON.stringify(error)}` : '';
    console.error(`[${this.context}] ERROR: ${message}${errorString}`);
  }
}

/**
 * Create a new logger for a specific context
 * @param context The context/module name
 * @returns A logger instance
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}

/**
 * Check if the application is running in development mode
 * @returns true if in development mode
 */
export function isDevMode(): boolean {
  return isDevelopment;
}
