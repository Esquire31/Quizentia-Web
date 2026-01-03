import React, { useEffect } from 'react';

interface DeleteSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  autoCloseDelay?: number; // in milliseconds
}

const DeleteSuccessModal: React.FC<DeleteSuccessModalProps> = ({
  isOpen,
  onClose,
  message = 'Item deleted successfully',
  autoCloseDelay = 2000
}) => {
  useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border-0 animate-scale-in">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 animate-bounce-once">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default DeleteSuccessModal;
