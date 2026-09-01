import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PopulatedTask, TaskStatus, TaskPriority, TaskOwner, UpdateTaskInput } from '@/types/task';

interface EditTaskModalProps {
  task: PopulatedTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, updates: UpdateTaskInput) => void;
  owners: TaskOwner[];
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSubmit,
  owners,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [ownerId, setOwnerId] = useState<string>('unassigned');
  const [dueDate, setDueDate] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);

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

  // Pre-populate form values when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setOwnerId(task.ownerId || 'unassigned');

      if (task.dueDate) {
        const dateObj = new Date(task.dueDate);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        setDueDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setDueDate('');
      }
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError('Task title is required.');
      return;
    }

    if (title.trim().length > 200) {
      setTitleError('Task title cannot exceed 200 characters.');
      return;
    }

    setTitleError(null);

    onSubmit(task.id, {
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      ownerId: ownerId === 'unassigned' ? null : ownerId,
      dueDate: dueDate || null,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-title"
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400">{task.id}</span>
              <h2 id="edit-task-title" className="text-lg font-black text-slate-900">
                Edit Task
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Update details for this task.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-700">
          {/* Title */}
          <div>
            <label htmlFor="edit-task-title-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-task-title-input"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(null);
              }}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all min-h-[44px] ${
                titleError ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-[#FE9F43]'
              }`}
              maxLength={200}
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? 'edit-task-title-error' : undefined}
            />
            {titleError && (
              <p id="edit-task-title-error" className="text-[11px] font-bold text-rose-500 mt-1">
                {titleError}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="edit-task-desc-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="edit-task-desc-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FE9F43] transition-all resize-none"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-task-status-select" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Status
              </label>
              <select
                id="edit-task-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#FE9F43] focus:outline-none cursor-pointer min-h-[44px]"
              >
                <option value="todo">To Do</option>
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label htmlFor="edit-task-priority-select" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Priority
              </label>
              <select
                id="edit-task-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#FE9F43] focus:outline-none cursor-pointer min-h-[44px]"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Owner & Due Date Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-task-owner-select" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Assignee / Owner
              </label>
              <select
                id="edit-task-owner-select"
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#FE9F43] focus:outline-none cursor-pointer truncate min-h-[44px]"
              >
                <option value="unassigned">Unassigned</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edit-task-due-date-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Due Date
              </label>
              <input
                id="edit-task-due-date-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#FE9F43] focus:outline-none cursor-pointer min-h-[44px]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-black bg-[#FE9F43] hover:bg-[#FF6E22] text-white rounded-xl transition-all shadow-2xs cursor-pointer min-h-[44px]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
