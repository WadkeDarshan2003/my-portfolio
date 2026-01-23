import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ messages, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm pointer-events-none">
      {messages.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-emerald-50/95 dark:bg-emerald-950/40',
          border: 'border-emerald-200 dark:border-emerald-800',
          text: 'text-emerald-800 dark:text-emerald-200',
          icon: 'text-emerald-600 dark:text-emerald-400',
          Icon: CheckCircle,
        };
      case 'error':
        return {
          bg: 'bg-red-50/95 dark:bg-red-950/40',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-200',
          icon: 'text-red-600 dark:text-red-400',
          Icon: AlertCircle,
        };
      case 'info':
        return {
          bg: 'bg-blue-50/95 dark:bg-blue-950/40',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-200',
          icon: 'text-blue-600 dark:text-blue-400',
          Icon: Info,
        };
    }
  };

  const styles = getStyles();
  const Icon = styles.Icon;

  return (
    <div 
      className={`
        ${styles.bg} ${styles.border}
        border rounded-2xl p-4 flex items-start gap-3
        backdrop-blur-xl shadow-lg animate-fade-in-up
        transition-all duration-300 hover:scale-105 pointer-events-auto
      `}
    >
      <Icon className={`${styles.icon} w-5 h-5 mt-0.5 flex-shrink-0`} />
      
      <div className="flex-1">
        <p className={`${styles.text} text-sm font-medium`}>
          {toast.message}
        </p>
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        title="Dismiss notification"
        className={`${styles.text} hover:opacity-70 transition-opacity flex-shrink-0 mt-0.5`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const useToast = () => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setMessages(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return {
    messages,
    showToast,
    removeToast,
    success: (msg: string) => showToast(msg, 'success'),
    error: (msg: string) => showToast(msg, 'error'),
    info: (msg: string) => showToast(msg, 'info'),
  };
};
