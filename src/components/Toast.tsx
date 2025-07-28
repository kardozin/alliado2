import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, X, Zap, Loader } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'loading';
  title: string;
  message: string;
  duration?: number;
}

interface ToastProps {
  message: ToastMessage;
  onClose: (id: string) => void;
}

export function Toast({ message, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    if (message.type !== 'loading' && message.duration !== 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(message.id), 300);
      }, message.duration || 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'loading':
        return <Loader className="w-5 h-5 text-amber-400 animate-spin" />;
      default:
        return <Zap className="w-5 h-5 text-blue-400" />;
    }
  };

  const getColors = () => {
    switch (message.type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      case 'loading':
        return 'bg-amber-500/10 border-amber-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`glass-effect rounded-xl p-4 border ${getColors()} animate-slide-in-right`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-100 text-sm">{message.title}</h4>
            <p className="text-gray-300 text-sm mt-1 leading-relaxed">{message.message}</p>
          </div>
          {message.type !== 'loading' && (
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(message.id), 300);
              }}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-200 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  messages: ToastMessage[];
  onClose: (id: string) => void;
}

export function ToastContainer({ messages, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {messages.map((message) => (
        <Toast key={message.id} message={message} onClose={onClose} />
      ))}
    </div>
  );
}