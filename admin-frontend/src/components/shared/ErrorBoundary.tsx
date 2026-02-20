import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

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

  handleGoToDashboard = () => {
    window.location.href = '/admin/dashboard';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-6">
          <div className="max-w-lg w-full">
            {/* Error Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>
            </div>

            {/* Error Content */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                System Error
              </div>
              <h1 className="text-2xl font-bold text-white">
                Terjadi Kesalahan Sistem
              </h1>
              <p className="text-slate-400 leading-relaxed">
                Terjadi kesalahan pada panel admin. Silakan muat ulang halaman atau kembali ke dashboard.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg transition-colors shadow-[0_0_20px_rgba(234,88,12,0.3)]"
              >
                <RefreshCw className="w-4 h-4" />
                Muat Ulang
              </button>
              <button
                onClick={this.handleGoToDashboard}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg border border-slate-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Ke Dashboard
              </button>
            </div>

            {/* Technical Details (collapsed) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-8 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                <summary className="text-sm text-red-400 cursor-pointer font-medium">
                  Detail Error (Development Only)
                </summary>
                <pre className="mt-4 text-xs text-red-300/70 overflow-x-auto whitespace-pre-wrap font-mono">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Error Code */}
            <div className="mt-8 text-center text-xs font-mono text-slate-600">
              ERROR_CODE: 0x500_RENDER_FAILURE
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
