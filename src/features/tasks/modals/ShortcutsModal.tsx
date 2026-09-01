import React, { useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcutsList = [
  { key: '/', description: 'Focus Search Bar' },
  { key: '⌘ + K', description: 'Focus Search Input (Mac / Win)' },
  { key: 'Escape', description: 'Close active modal / reset search' },
  { key: '?', description: 'Open Keyboard Shortcuts Guide' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#FE9F43] flex items-center justify-center font-bold">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shortcuts-modal-title" className="text-base font-black text-slate-900">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Speed up your task management workflow.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts Cheat Sheet Table */}
        <div className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
          {shortcutsList.map((item) => (
            <div key={item.key} className="py-2.5 flex items-center justify-between">
              <span className="text-slate-600 font-medium">{item.description}</span>
              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded-md font-mono text-[11px] font-bold text-slate-800 shadow-2xs">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-black bg-[#FE9F43] hover:bg-[#FF6E22] text-white rounded-xl transition-all cursor-pointer min-h-[44px]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
