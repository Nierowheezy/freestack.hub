import React, { ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-screen" className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
          <div id="error-boundary-card" className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-lg text-center">
            <div id="error-boundary-icon-wrapper" className="w-14 h-14 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mx-auto mb-5 text-rose-500">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 id="error-boundary-title" className="font-sans font-bold text-lg text-zinc-900 dark:text-zinc-50 mb-2">
              Something went wrong
            </h1>
            <p id="error-boundary-msg" className="font-sans text-zinc-600 dark:text-zinc-400 text-sm mb-6 max-h-[100px] overflow-y-auto font-mono text-left bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-150 dark:border-zinc-800">
              {this.state.error ? this.state.error.message : "An unexpected application error occurred."}
            </p>
            <button
              id="error-boundary-reset-btn"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 text-white font-medium text-sm px-5 py-2.5 rounded-2xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm focus:outline-none"
            >
              <RotateCcw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
