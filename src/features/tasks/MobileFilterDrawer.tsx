import React from 'react';
import { X, Check } from 'lucide-react';
import { TaskStatus, TaskPriority, TaskSortField, TaskOwner } from '@/types/task';
import Button from '@/components/button/Button';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStatus: TaskStatus | 'all';
  onStatusChange: (status: TaskStatus | 'all') => void;
  selectedPriority: TaskPriority | 'all';
  onPriorityChange: (priority: TaskPriority | 'all') => void;
  selectedOwnerId: string | 'all';
  onOwnerChange: (ownerId: string | 'all') => void;
  sortBy: TaskSortField;
  onSortByChange: (sort: TaskSortField) => void;
  owners: TaskOwner[];
  onResetFilters: () => void;
}

const statusOptions: { id: TaskStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All Statuses' },
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'in_review', label: 'In Review' },
  { id: 'done', label: 'Done' },
];

const priorityOptions: { id: TaskPriority | 'all'; label: string }[] = [
  { id: 'all', label: 'All Priorities' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
];

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  selectedOwnerId,
  onOwnerChange,
  sortBy,
  onSortByChange,
  owners,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs md:hidden animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-t-2xl max-h-[85vh] overflow-y-auto p-5 space-y-6 shadow-2xl border-t border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Filter & Sort Tasks</h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Workflow Status</label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((opt) => {
              const selected = selectedStatus === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onStatusChange(opt.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left flex items-center justify-between transition-colors min-h-[44px] ${
                    selected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                  {selected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Priority Level</label>
          <div className="grid grid-cols-2 gap-2">
            {priorityOptions.map((opt) => {
              const selected = selectedPriority === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onPriorityChange(opt.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left flex items-center justify-between transition-colors min-h-[44px] ${
                    selected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                  {selected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Owner Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Assignee / Owner</label>
          <select
            value={selectedOwnerId}
            onChange={(e) => onOwnerChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-slate-100 min-h-[44px]"
          >
            <option value="all">All Owners</option>
            <option value="unassigned">Unassigned</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as TaskSortField)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-slate-100 min-h-[44px]"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
          </select>
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Button
            type="button"
            onClick={onResetFilters}
            buttonClass="!bg-slate-100 dark:!bg-slate-800 !text-slate-700 dark:!text-slate-300 w-1/2 min-h-[44px]"
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={onClose}
            buttonClass="!bg-indigo-600 !text-white w-1/2 min-h-[44px] font-semibold"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
