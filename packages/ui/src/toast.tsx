'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert } from './alert';

type ToastVariant = 'success' | 'warning' | 'danger' | 'info';

interface Toast {
  id: string;
  message: string;
  title?: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export function ToastProvider({ 
  children, 
  position = 'top-right',
  maxToasts = 5 
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => {
      const updated = [...prev, newToast];
      return updated.slice(-maxToasts);
    });

    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [maxToasts, removeToast]);

  const success = useCallback((message: string, title?: string) => {
    addToast({ message, title, variant: 'success' });
  }, [addToast]);

  const error = useCallback((message: string, title?: string) => {
    addToast({ message, title, variant: 'danger' });
  }, [addToast]);

  const warning = useCallback((message: string, title?: string) => {
    addToast({ message, title, variant: 'warning' });
  }, [addToast]);

  const info = useCallback((message: string, title?: string) => {
    addToast({ message, title, variant: 'info' });
  }, [addToast]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <div className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-2 pointer-events-none`}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto animate-in slide-in-from-top-5 fade-in duration-300"
          >
            <Alert
              variant={toast.variant}
              title={toast.title}
              onClose={() => removeToast(toast.id)}
              className="min-w-[320px] max-w-[500px] shadow-lg"
            >
              {toast.message}
            </Alert>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}