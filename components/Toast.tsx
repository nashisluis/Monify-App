
import React from 'react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'info' | 'warning' | 'success';
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border animate-in slide-in-from-right-10 duration-300 ${
            toast.type === 'warning'
              ? 'bg-orange-50 dark:bg-orange-950 border-orange-100 dark:border-orange-900 text-orange-800 dark:text-orange-200'
              : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            toast.type === 'warning' ? 'bg-orange-200 dark:bg-orange-900' : 'bg-blue-100 dark:bg-blue-900'
          }`}>
            <svg className={`w-4 h-4 ${toast.type === 'warning' ? 'text-orange-700 dark:text-orange-300' : 'text-blue-700 dark:text-blue-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-sm font-semibold">{toast.text}</p>
          <button 
            onClick={() => onRemove(toast.id)}
            className="ml-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
