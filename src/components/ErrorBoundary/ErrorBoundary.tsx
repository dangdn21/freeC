'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to external service
    this.logErrorToService(error, errorInfo);
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In production, send to error tracking service
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    
    console.log('Error logged:', errorData);
    // Example: Sentry.captureException(error, { extra: errorData });
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
          <div className="max-w-md w-full mx-auto p-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200/50 animate-slideUp">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>

              {/* Error Message */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Oops! Something went wrong
                </h2>
                <p className="text-gray-600 mb-4">
                  We encountered an unexpected error. Our team has been notified.
                </p>
                
                {/* Error Details (Development only) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-left bg-gray-50 rounded-lg p-4 mb-4">
                    <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                      Error Details (Development)
                    </summary>
                    <div className="text-sm text-red-600 font-mono">
                      <div className="mb-2">
                        <strong>Error:</strong> {this.state.error.message}
                      </div>
                      {this.state.error.stack && (
                        <div className="mb-2">
                          <strong>Stack:</strong>
                          <pre className="whitespace-pre-wrap text-xs mt-1 bg-white p-2 rounded border overflow-x-auto">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="whitespace-pre-wrap text-xs mt-1 bg-white p-2 rounded border overflow-x-auto">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleRetry}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
                >
                  Reload Page
                </button>
              </div>

              {/* Help Links */}
              <div className="mt-6 text-center">
                <a
                  href="/"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                >
                  ← Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}