import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      const Fallback = this.props.fallback;
      if (Fallback) {
        return Fallback(this.state.error, this.reset);
      }
      return (
        <div className="min-h-screen flex items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4 text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Application Error</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-6">{this.state.error.message}</p>
          <button
            onClick={this.reset}
            className="text-brand-400 hover:text-brand-300 text-sm font-medium underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
