import React from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected error occurred.',
    };
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F6FBF8] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 text-red-700 mb-4">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h1 className="text-xl font-bold text-slate-900">
                Application Security or Runtime Notice
              </h1>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              MediKart encountered a protected operation boundary or runtime exception.
              No customer health data or orders were processed.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-700 break-words mb-6">
              {this.state.message}
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reload Showcase
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
