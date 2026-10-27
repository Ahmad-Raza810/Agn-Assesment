import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'info', title, message, duration = 4000 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      const newToast = { id, type, title, message };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message, title = 'Success') => addToast({ type: 'success', title, message }),
    [addToast]
  );

  const error = useCallback(
    (message, title = 'Error') => addToast({ type: 'error', title, message }),
    [addToast]
  );

  const info = useCallback(
    (message, title = 'Notice') => addToast({ type: 'info', title, message }),
    [addToast]
  );

  const warning = useCallback(
    (message, title = 'Warning') => addToast({ type: 'warning', title, message }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      {/* Toast container floating on top right */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const config = {
            success: {
              border: 'border-emerald-200 bg-emerald-50/95 text-emerald-900',
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
            },
            error: {
              border: 'border-rose-200 bg-rose-50/95 text-rose-900',
              icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
            },
            warning: {
              border: 'border-amber-200 bg-amber-50/95 text-amber-900',
              icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
            },
            info: {
              border: 'border-blue-200 bg-blue-50/95 text-blue-900',
              icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
            },
          }[toast.type] || {
            border: 'border-slate-200 bg-white text-slate-900',
            icon: <Info className="w-5 h-5 text-slate-600 flex-shrink-0" />,
          };

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-2 ${config.border}`}
            >
              {config.icon}
              <div className="flex-1 text-sm">
                {toast.title && <p className="font-semibold">{toast.title}</p>}
                <p className="text-slate-600 mt-0.5 leading-snug">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 transition p-0.5 rounded-md hover:bg-black/5"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
