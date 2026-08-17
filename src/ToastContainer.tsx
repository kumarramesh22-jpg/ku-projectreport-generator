import { useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  useEffect(() => {
    const timers = toasts.map((t) =>
      window.setTimeout(() => onDismiss(t.id), 3500)
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' ? CheckCircle2 : XCircle;
        return (
          <div
            key={toast.id}
            className="card animate-slide-up flex items-center gap-3 px-4 py-3 shadow-lift"
          >
            <Icon
              className={`h-5 w-5 ${toast.type === 'success' ? 'text-success-500' : 'text-danger-500'}`}
            />
            <p className="text-sm font-medium text-ink-800">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
}
