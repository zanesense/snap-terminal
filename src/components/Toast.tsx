'use client';

import { useEffect, useState } from 'react';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastProps {
  message: string;
  action?: ToastAction;
  duration?: number;
  onDone: () => void;
}

export default function Toast({ message, action, duration = 4000, onDone }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 200);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDone]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 h-10 rounded-lg shadow-modal text-sm transition-all duration-200 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
      style={{
        background: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        color: 'var(--color-ink)',
      }}
    >
      <span className="text-sm">{message}</span>
      {action && (
        <button
          type="button"
          onClick={() => {
            action.onClick();
            setVisible(false);
            setTimeout(onDone, 200);
          }}
          className="text-sm font-medium whitespace-nowrap text-ink hover:opacity-70 transition-opacity"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; action?: ToastAction; id: number } | null>(null);

  const show = (message: string, action?: ToastAction) => {
    setToast({ message, action, id: Date.now() });
  };

  const hide = () => setToast(null);

  const ToastContainer = () =>
    toast ? (
      <Toast key={toast.id} message={toast.message} action={toast.action} onDone={hide} />
    ) : null;

  return { show, ToastContainer };
}
