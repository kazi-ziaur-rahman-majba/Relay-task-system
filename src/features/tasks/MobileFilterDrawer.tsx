import React from 'react';
import { X, Check } from 'lucide-react';
import { TaskStatus, TaskPriority, TaskOwner, TaskFilterState } from '@/types/task';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TaskFilterState;
  onStatusChange: (status: TaskStatus | 'all') => void;
  onPriorityChange: (priority: TaskPriority | 'all') => void;
  onOwnerChange: (ownerId: string) => void;
  owners: TaskOwner[];
  onResetFilters: () => void;
  hasActiveFilters: boolean;
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
  filters,
  onStatusChange,
  onPriorityChange,
  onOwnerChange,
  owners,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  const activeStatus = filters.status.length > 0 ? filters.status[0] : 'all';
  const activePriority = filters.priority.length > 0 ? filters.priority[0] : 'all';

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs md:hidden animate-fade-in">
      <div className="bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto p-5 space-y-6 shadow-2xl border-t border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900">Filter Tasks</h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
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
              const selected = activeStatus === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onStatusChange(opt.id)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border text-left flex items-center justify-between transition-colors min-h-[42px] cursor-pointer ${
                    selected
                      ? 'bg-[#FFF5EC] border-[#FE9F43] text-[#FE9F43]'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {opt.label}
                  {selected && <Check className="w-4 h-4 text-[#FE9F43]" />}
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
              const selected = activePriority === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onPriorityChange(opt.id)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border text-left flex items-center justify-between transition-colors min-h-[42px] cursor-pointer ${
                    selected
                      ? 'bg-[#FFF5EC] border-[#FE9F43] text-[#FE9F43]'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {opt.label}
                  {selected && <Check className="w-4 h-4 text-[#FE9F43]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Owner Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Assignee / Owner</label>
          <select
            value={filters.ownerId}
            onChange={(e) => onOwnerChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 min-h-[44px]"
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

        {/* Actions Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={onResetFilters}
            className="w-1/2 min-h-[44px] py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 min-h-[44px] py-2 bg-[#FE9F43] text-white font-extrabold text-xs rounded-xl hover:bg-[#FF6E22] transition-colors cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
