import React from 'react';
import { LoadingIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from './Icons.tsx';

interface ToastProps {
  type: 'loading' | 'success' | 'error';
  message: string;
  onDismiss: () => void;
}

const toastConfig = {
  loading: {
    icon: LoadingIcon,
    bgColor: 'bg-blue-500',
    iconColor: 'text-white',
  },
  success: {
    icon: CheckCircleIcon,
    bgColor: 'bg-green-500',
    iconColor: 'text-white',
  },
  error: {
    icon: XCircleIcon,
    bgColor: 'bg-red-500',
    iconColor: 'text-white',
  },
};

const Toast: React.FC<ToastProps> = ({ type, message, onDismiss }) => {
  const { icon: Icon, bgColor } = toastConfig[type];

  return (
    <div 
      className={`fixed top-5 right-5 flex items-center p-4 rounded-lg shadow-lg text-white ${bgColor} animate-slide-in-from-right`}
      role="alert"
    >
      <div className="flex-shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <div className="ml-3 text-sm font-medium">
        {message}
      </div>
      {type !== 'loading' && (
        <button 
          type="button" 
          className="ml-4 -mr-2 p-1.5 rounded-md inline-flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <span className="sr-only">Dismiss</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Toast;