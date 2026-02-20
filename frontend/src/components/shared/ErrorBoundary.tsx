import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6">
          <div className="max-w-lg w-full">
            {/* Error Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>
            </div>

            {/* Error Content */}
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-white">
                Terjadi Kesalahan
              </h1>
              <p className="text-zinc-400 leading-relaxed">
                Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu dan sedang memperbaikinya.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Muat Ulang
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-colors"
              >
                <Home className="w-4 h-4" />
                Ke Beranda
              </button>
            </div>

            {/* Technical Details (collapsed) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-8 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                <summary className="text-sm text-red-400 cursor-pointer font-medium">
                  Detail Error (Development Only)
                </summary>
                <pre className="mt-4 text-xs text-red-300/70 overflow-x-auto whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
