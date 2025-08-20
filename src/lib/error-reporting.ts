interface ErrorReport {
  message: string
  stack?: string
  url: string
  userAgent: string
  timestamp: string
  userId?: string
  additionalInfo?: Record<string, any>
}

class ErrorReportingService {
  private isEnabled: boolean

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production'
  }

  captureException(error: Error, additionalInfo?: Record<string, any>) {
    if (!this.isEnabled) {
      console.error('Error captured:', error, additionalInfo)
      return
    }

    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      timestamp: new Date().toISOString(),
      additionalInfo,
    }

    // In a real application, you would send this to your error reporting service
    // For example: Sentry, LogRocket, Bugsnag, etc.
    this.sendToErrorService(report)
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    if (!this.isEnabled) {
      console.log(`[${level.toUpperCase()}] ${message}`)
      return
    }

    const report = {
      message,
      level,
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString(),
    }

    this.sendToErrorService(report)
  }

  private async sendToErrorService(report: any) {
    try {
      // Replace with your actual error reporting service endpoint
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      })
    } catch (error) {
      console.error('Failed to send error report:', error)
    }
  }

  setUser(userId: string) {
    // Set user context for error reporting
    if (this.isEnabled) {
      // Implementation depends on your error reporting service
    }
  }

  addBreadcrumb(message: string, category?: string) {
    if (this.isEnabled) {
      // Add breadcrumb for debugging context
      // Implementation depends on your error reporting service
    }
  }
}

export const errorReportingService = new ErrorReportingService()