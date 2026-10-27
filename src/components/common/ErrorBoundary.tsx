import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

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
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Satmix React ErrorBoundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetSession = () => {
    try {
      localStorage.removeItem('satmix-prototype-v6');
      localStorage.removeItem('satmix_prototype_state_v4');
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  private handleReturnHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#090A0E] text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0E1017]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative z-10 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mx-auto mb-4 text-purple-400">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white mb-2">
              Application Session Recovered
            </h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Satmix encountered an unexpected client render state. Your funds, streak, and account credentials remain 100% secure.
            </p>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 mb-6 text-left max-h-24 overflow-y-auto">
                <p className="font-mono text-[11px] text-purple-300 break-words">
                  {this.state.error.message || 'Unknown render exception'}
                </p>
              </div>
            )}

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 active:scale-[0.98] transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Satmix</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetSession}
                className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reset Local Cache & Open Website</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
