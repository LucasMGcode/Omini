import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface AlertBannerProps {
  message: string;
  onDismiss: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ message, onDismiss }) => {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 mb-6 rounded-xl flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-amber-600 mr-3" />
        <span className="text-amber-800 font-montserrat">{message}</span>
      </div>
      <button onClick={onDismiss} className="text-amber-600 hover:text-amber-800 transition-colors p-1 rounded-lg hover:bg-amber-100">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default AlertBanner;
