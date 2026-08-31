import React from 'react';
import { PopulatedTask, TaskStatus } from '@/types/task';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { Avatar } from '@/components/common/Avatar';
import { DateBadge } from '@/components/common/DateBadge';

interface TaskCardViewProps {
  tasks: PopulatedTask[];
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick?: (task: PopulatedTask) => void;
}

export const TaskCardView: React.FC<TaskCardViewProps> = ({
  tasks,
  onTaskClick,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {tasks.map((task) => (
        <article
          key={task.id}
          onClick={() => onTaskClick?.(task)}
          tabIndex={0}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs space-y-3 hover:border-indigo-300 dark:hover:border-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
        >
          {/* Top Row: Task ID & Priority & Status */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                {task.id}
              </span>
              <PriorityBadge priority={task.priority} />
            </div>
            <StatusBadge status={task.status} />
          </div>

          {/* Task Title */}
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-3 leading-snug">
            {task.title}
          </h3>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer Row: Owner & Due Date */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
            <Avatar owner={task.owner} size="sm" showName />
            <DateBadge dueDate={task.dueDate} />
          </div>
        </article>
      ))}
    </div>
  );
};
