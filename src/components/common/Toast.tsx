import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ToastProps {
  visible: boolean;
  message: string;
  isError?: boolean;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ visible, message, isError = false, onClose }) => {
  const { colors } = useApp();

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border transition-all"
        style={{
          backgroundColor: colors.cardHigh,
          borderColor: isError ? colors.semanticDanger : colors.accent,
          color: colors.textPrimary,
          minWidth: '280px',
          maxWidth: '420px',
        }}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: colors.semanticDanger }} />
        ) : (
          <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: colors.semanticSuccess }} />
        )}
        <span className="text-sm font-medium flex-1">{message}</span>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
          </button>
        )}
      </div>
    </div>
  );
};
