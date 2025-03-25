/**
 * Logger utility for BLAH CLI
 * Controls logging based on environment and verbosity settings
 * Logs to file in user's home directory using Pino
 */

import * as path from 'path';
import * as os from 'os';
import pino from 'pino';

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.BLAH_DEBUG === 'true';

// Set up log file path in user's home directory
const LOG_FILE_PATH = path.join(os.homedir(), 'blah.log');

// Configure Pino logger
const pinoOptions: pino.LoggerOptions = {
  level: isDevelopment ? 'debug' : 'info',
  transport: {
    targets: [
      // File transport - always active
      {
        target: 'pino/file',
        level: 'debug', // Log everything to file
        options: { 
          destination: LOG_FILE_PATH,
          mkdir: true,
          sync: false,
        }
      },
      // Console transport - with pretty colors
      {
        target: 'pino-pretty',
        level: isDevelopment ? 'debug' : 'info',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          messageFormat: '[{context}] {msg}',
        }
      }
    ]
  },
  timestamp: pino.stdTimeFunctions.isoTime
};

// Create base logger
const baseLogger = pino(pinoOptions);

/**
 * Logger class with environment-aware logging
 */
class Logger {
  private logger: pino.Logger;
  
  /**
   * Create a new logger instance
   * @param context The context/module name for this logger
   */
  constructor(context: string) {
    this.logger = baseLogger.child({ context });
  }

  /**
   * Log information message (only in development)
   * @param message The message to log
   * @param data Optional data to include
   */
  info(message: string, data?: any): void {
    // Always log to file via Pino
    if (data) {
      this.logger.info(data, message);
    } else {
      this.logger.info(message);
    }
  }

  /**
   * Log debug message (only in development, more detailed than info)
   * @param message The message to log
   * @param data Optional data to include
   */
  debug(message: string, data?: any): void {
    // Always log to file via Pino
    if (data) {
      this.logger.debug(data, `DEBUG: ${message}`);
    } else {
      this.logger.debug(`DEBUG: ${message}`);
    }
  }

  /**
   * Log warning message (always shown)
   * @param message The message to log
   * @param data Optional data to include
   */
  warn(message: string, data?: any): void {
    // Log via Pino
    if (data) {
      this.logger.warn(data, `WARNING: ${message}`);
    } else {
      this.logger.warn(`WARNING: ${message}`);
    }
  }

  /**
   * Log error message (always shown)
   * @param message The message to log
   * @param error Optional error to include
   */
  error(message: string, error?: any): void {
    // Log via Pino
    if (error instanceof Error) {
      this.logger.error({ err: error }, `ERROR: ${message}`);
    } else if (error) {
      this.logger.error({ data: error }, `ERROR: ${message}`);
    } else {
      this.logger.error(`ERROR: ${message}`);
    }
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

/**
 * Get the path to the log file
 * @returns The absolute path to the log file
 */
export function getLogFilePath(): string {
  return LOG_FILE_PATH;
}
