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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => onTaskClick?.(task)}
          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:shadow-md hover:border-[#FE9F43]/40 transition-all cursor-pointer flex flex-col justify-between space-y-3"
        >
          {/* Top Row: Task ID & Status */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-slate-500">
              {task.id}
            </span>
            <StatusBadge status={task.status} />
          </div>

          {/* Task Title */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug">
              {task.title}
            </h3>
          </div>

          {/* Footer Info: Priority, Due Date & Owner */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <Avatar owner={task.owner} size="sm" showName />

            <div className="flex items-center gap-2">
              <PriorityBadge priority={task.priority} />
              <DateBadge dueDate={task.dueDate} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
