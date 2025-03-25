/**
 * Logger utility for BLAH CLI
 * Controls logging based on environment and verbosity settings
 * Logs to file in user's home directory
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.BLAH_DEBUG === 'true';

// Set up log file path in user's home directory
const LOG_FILE_PATH = path.join(os.homedir(), 'blah.log');

/**
 * Write message to log file
 * @param message The formatted message to log
 */
function writeToLogFile(message: string): void {
  try {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} ${message}\n`;
    
    fs.appendFileSync(LOG_FILE_PATH, logMessage, { encoding: 'utf8' });
  } catch (error) {
    // If we can't write to the log file, at least try to show the error in the console
    // but don't throw further as logging should never break the application
    if (isDevelopment) {
      console.error(`Failed to write to log file at ${LOG_FILE_PATH}:`, error);
    }
  }
}

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
    const dataString = data ? `: ${JSON.stringify(data, null, 2)}` : '';
    const formattedMessage = `[${this.context}] ${message}${dataString}`;
    
    // Always log to file
    writeToLogFile(`INFO ${formattedMessage}`);
    
    // Only log to console in development
    if (isDevelopment) {
      console.log(formattedMessage);
    }
  }

  /**
   * Log debug message (only in development, more detailed than info)
   * @param message The message to log
   * @param data Optional data to include
   */
  debug(message: string, data?: any): void {
    const dataString = data ? `: ${JSON.stringify(data, null, 2)}` : '';
    const formattedMessage = `[${this.context}] DEBUG: ${message}${dataString}`;
    
    // Always log to file
    writeToLogFile(`DEBUG ${formattedMessage}`);
    
    // Only log to console in development
    if (isDevelopment) {
      console.log(formattedMessage);
    }
  }

  /**
   * Log warning message (always shown)
   * @param message The message to log
   * @param data Optional data to include
   */
  warn(message: string, data?: any): void {
    const dataString = data ? `: ${JSON.stringify(data, null, 2)}` : '';
    const formattedMessage = `[${this.context}] WARNING: ${message}${dataString}`;
    
    // Log to file
    writeToLogFile(`WARN ${formattedMessage}`);
    
    // Log to console
    console.warn(formattedMessage);
  }

  /**
   * Log error message (always shown)
   * @param message The message to log
   * @param error Optional error to include
   */
  error(message: string, error?: any): void {
    const errorString = error ? `: ${error instanceof Error ? error.message : JSON.stringify(error)}` : '';
    const formattedMessage = `[${this.context}] ERROR: ${message}${errorString}`;
    
    // Log to file
    writeToLogFile(`ERROR ${formattedMessage}`);
    
    // Log to console
    console.error(formattedMessage);
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
