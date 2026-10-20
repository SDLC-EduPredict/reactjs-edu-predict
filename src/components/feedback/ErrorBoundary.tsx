import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui';

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) console.error(error, info);
  }

  override render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-page p-6 text-center">
        <h1 className="text-xl font-extrabold text-slate-900">Something went wrong</h1>
        <p className="max-w-md text-sm text-slate-500">{this.state.error.message}</p>
        <Button onClick={() => window.location.assign('/')}>Back to home</Button>
      </div>
    );
  }
}
