'use client';

import React, { useEffect } from 'react';

interface MetagamePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetagamePopup: React.FC<MetagamePopupProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 transition-opacity duration-300 z-40 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-dark-500 border-2 border-amber-400 rounded-lg p-8 max-w-md mx-4 text-center">
        <button 
          className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 text-dark-500 rounded-full flex items-center justify-center font-bold hover:bg-amber-300 transition-colors"
          onClick={onClose}
          aria-label="Close popup"
        >
          ✕
        </button>
        
        <h3 className="text-2xl font-bold text-white mb-4">
          What did you think was going to happen?
        </h3>
        
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-fuchsia-500 via-amber-500 to-fuchsia-500 relative transition-all duration-300 rounded-md p-0.5 font-bold hover:scale-105"
        >
          <div className="bg-dark-500 text-white w-full h-full px-6 rounded-md py-2 uppercase transition-all duration-1000">
            Okay fair
          </div>
        </button>
      </div>
    </div>
  );
}; 