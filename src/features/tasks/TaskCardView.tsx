import React from 'react';
import { PopulatedTask, TaskStatus } from '@/types/task';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { Avatar } from '@/components/common/Avatar';
import { DateBadge } from '@/components/common/DateBadge';
import { Edit2, Trash2, Eye } from 'lucide-react';

interface TaskCardViewProps {
  tasks: PopulatedTask[];
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick?: (task: PopulatedTask) => void;
  onEditTask?: (task: PopulatedTask) => void;
  onDeleteTask?: (task: PopulatedTask) => void;
}

const ALL_STATUSES: { id: TaskStatus; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'in_review', label: 'In Review' },
  { id: 'done', label: 'Done' },
];

export const TaskCardView: React.FC<TaskCardViewProps> = ({
  tasks,
  onStatusChange,
  onTaskClick,
  onEditTask,
  onDeleteTask,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3.5">
      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => onTaskClick?.(task)}
          className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-md hover:border-[#FE9F43]/40 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
        >
          {/* Top Row: Task ID & Quick Action Icons */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-[#051A2C] bg-slate-100 px-2 py-0.5 rounded-md">
              {task.id}
            </span>

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onTaskClick?.(task)}
                className="p-1 text-[#051A2C] border border-[#FE9F43] rounded-sm hover:bg-[#FE9F43] hover:text-white transition-colors cursor-pointer"
                title="View task details"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onEditTask?.(task)}
                className="p-1 text-[#051A2C] border border-[#FE9F43] rounded-sm hover:bg-[#FE9F43] hover:text-white transition-colors cursor-pointer"
                title="Edit task"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteTask?.(task)}
                className="p-1 text-[#051A2C] border border-[#FE9F43] rounded-sm hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Task Title */}
          <div>
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-[#FE9F43] transition-colors">
              {task.title}
            </h3>
          </div>

          {/* Badges Row: Status Picker & Priority */}
          <div className="flex items-center flex-wrap gap-2 pt-0.5" onClick={(e) => e.stopPropagation()}>
            <div className="relative inline-block">
              <StatusBadge status={task.status} />
              <select
                value={task.status}
                onChange={(e) => onStatusChange?.(task.id, e.target.value as TaskStatus)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <PriorityBadge priority={task.priority} />
          </div>

          {/* Footer Row: Owner Avatar & Due Date */}
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <Avatar owner={task.owner} size="sm" showName />
            <DateBadge dueDate={task.dueDate} />
          </div>
        </div>
      ))}
    </div>
  );
};
