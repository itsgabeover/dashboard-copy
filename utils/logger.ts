const isDevelopment = process.env.NODE_ENV === 'development'

class Logger {
  private static instance: Logger
  
  private constructor() {
    // Initialize logger
  }
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private log(level: 'error' | 'info', message: string, ...args: unknown[]): void {
    if (!isDevelopment) return

    // eslint-disable-next-line no-console
    const logFn = level === 'error' ? console.error : console.log
    logFn(message, ...args)
  }

  error(message: string, ...args: unknown[]): void {
    this.log('error', message, args)
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, args)
  }
}

// Create singleton instance
const logger = Logger.getInstance()

// Export singleton
export { logger } 