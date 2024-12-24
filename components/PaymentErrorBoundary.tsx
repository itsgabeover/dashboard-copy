'use client'
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class PaymentErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Payment error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Payment Processing Error</h3>
            <p>We encountered an error processing your payment. Please try again later.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 