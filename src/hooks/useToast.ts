import { useState, useCallback } from 'react';
import { ToastMessage } from '../components/Toast';

export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastMessage = { ...toast, id };
    
    setMessages(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setMessages(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<ToastMessage>) => {
    setMessages(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ));
  }, []);

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    return addToast({ type: 'success', title, message, duration });
  }, [addToast]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    return addToast({ type: 'error', title, message, duration });
  }, [addToast]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    return addToast({ type: 'info', title, message, duration });
  }, [addToast]);

  const showLoading = useCallback((title: string, message: string) => {
    return addToast({ type: 'loading', title, message, duration: 0 });
  }, [addToast]);

  return {
    messages,
    addToast,
    removeToast,
    updateToast,
    showSuccess,
    showError,
    showInfo,
    showLoading
  };
}