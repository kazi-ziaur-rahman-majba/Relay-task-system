import React from 'react';
import { PopulatedTask } from '@/types/task';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { DateBadge } from '@/components/common/DateBadge';
import { Avatar } from '@/components/common/Avatar';
import { X, Edit2, Trash2, Calendar, User, Clock, Tag } from 'lucide-react';

interface TaskDetailDrawerProps {
  task: PopulatedTask | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: PopulatedTask) => void;
  onDelete?: (task: PopulatedTask) => void;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Right Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out">
          
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-[#051A2C] bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs">
                {task.id}
              </span>
              <StatusBadge status={task.status} />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {task.title}
              </h2>
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5 pb-4 border-b border-slate-100">
              <PriorityBadge priority={task.priority} />
              <DateBadge dueDate={task.dueDate} />
            </div>

            {/* Owner Section */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FE9F43]" /> Assigned Owner
              </span>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <Avatar owner={task.owner} size="md" showName />
                {task.owner?.email && (
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
                    {task.owner.email}
                  </span>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Task Description
              </span>
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100/80 min-h-[100px]">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
                  {task.description || 'No detailed description provided for this task.'}
                </p>
              </div>
            </div>

            {/* Tags (if available) */}
            {task.tags && task.tags.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" /> Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Info */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500 font-medium">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Created Date:
                </span>
                <span className="font-bold text-slate-700">
                  {new Date(task.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Last Updated:
                </span>
                <span className="font-bold text-slate-700">
                  {new Date(task.updatedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2.5">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onEdit(task);
                  onClose();
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold rounded-xl transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Task
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(task);
                  onClose();
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-extrabold rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
