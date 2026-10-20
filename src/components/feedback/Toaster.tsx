import { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { toastDismissed, type Toast } from '@/app/store/slices/uiSlice';
import { cn } from '@/lib/utils/cn';

const ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-rose-500" />,
  info: <Info className="h-5 w-5 text-brand-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
};

const ToastItem = ({ toast }: { toast: Toast }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const timer = window.setTimeout(() => dispatch(toastDismissed(toast.id)), toast.type === 'error' ? 6000 : 4000);
    return () => window.clearTimeout(timer);
  }, [dispatch, toast.id, toast.type]);
  return (
    <div className={cn('pointer-events-auto flex w-full animate-toast-in items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl', toast.type === 'error' ? 'border-rose-100' : 'border-slate-100')} role="status">
      {ICONS[toast.type]}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
        {toast.message && <p className="mt-0.5 break-words text-xs text-slate-500">{toast.message}</p>}
      </div>
      <button type="button" onClick={() => dispatch(toastDismissed(toast.id))} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Dismiss">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const Toaster = () => {
  const toasts = useAppSelector((state) => state.ui.toasts);
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
