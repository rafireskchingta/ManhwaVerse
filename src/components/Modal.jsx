import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-manhwa-card rounded-2xl border border-manhwa-border shadow-elevated z-10 overflow-hidden flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-manhwa-border bg-manhwa-surface/50">
          <h2 className="font-serif font-bold text-base text-manhwa-text">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-manhwa-muted hover:text-manhwa-text hover:bg-manhwa-surface transition-smooth"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-grow">{children}</div>
      </div>
    </div>
  );
};
