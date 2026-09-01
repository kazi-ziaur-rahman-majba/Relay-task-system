import React, { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { PopulatedTask } from '@/types/task';

interface DeleteConfirmModalProps {
  task: PopulatedTask | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm,
}) => {
  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-8 text-center space-y-5 shadow-2xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Red Circle Trash Icon */}
        <div className="w-16 h-16 rounded-full bg-[#FFE8E8] text-[#E50914] flex items-center justify-center mx-auto shrink-0">
          <Trash2 className="w-7 h-7 stroke-[2]" />
        </div>

        {/* Text Content */}
        <div className="space-y-1.5">
          <h3 id="delete-modal-title" className="text-xl font-extrabold text-slate-900">
            Confirm Delete
          </h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Are you sure you want to delete?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer min-w-[100px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(task.id);
              onClose();
            }}
            className="px-6 py-2.5 text-sm font-semibold bg-[#E50914] hover:bg-red-700 text-white rounded-xl transition-all shadow-xs cursor-pointer min-w-[100px]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
