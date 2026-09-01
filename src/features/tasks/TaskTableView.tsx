import React from 'react';
import { PopulatedTask, TaskStatus } from '@/types/task';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { Avatar } from '@/components/common/Avatar';
import { DateBadge } from '@/components/common/DateBadge';
import { Edit2, Trash2 } from 'lucide-react';

interface TaskTableViewProps {
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

export const TaskTableView: React.FC<TaskTableViewProps> = ({
  tasks,
  onStatusChange,
  onTaskClick,
  onEditTask,
  onDeleteTask,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 select-none">
              <th scope="col" className="py-3 px-4 w-20">ID</th>
              <th scope="col" className="py-3 px-4 w-[320px] max-w-[320px]">Task Title</th>
              <th scope="col" className="py-3 px-4 w-44">Owner</th>
              <th scope="col" className="py-3 px-4 w-32">Priority</th>
              <th scope="col" className="py-3 px-4 w-36">Due Date</th>
              <th scope="col" className="py-3 px-4 w-36">Status</th>
              <th scope="col" className="py-3 px-4 w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tasks.map((task) => (
              <tr
                key={task.id}
                onClick={() => onTaskClick?.(task)}
                tabIndex={0}
                className="group hover:bg-[#FFF5EC]/80 focus:bg-[#FFF5EC] focus:outline-none transition-colors cursor-pointer"
              >
                {/* ID */}
                <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-500 group-hover:text-[#FE9F43]">
                  {task.id}
                </td>

                {/* Title */}
                <td className="py-3.5 px-4 w-[320px] max-w-[320px]">
                  <div 
                    className="max-h-14 overflow-y-hidden hover:overflow-y-auto whitespace-normal break-words text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#FE9F43] transition-colors pr-1 scrollbar-thin scrollbar-thumb-slate-300"
                    title={task.title}
                  >
                    {task.title}
                  </div>
                </td>

                {/* Owner */}
                <td className="py-3.5 px-4">
                  <Avatar owner={task.owner} size="sm" showName />
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4">
                  <PriorityBadge priority={task.priority} />
                </td>

                {/* Due Date */}
                <td className="py-3.5 px-4">
                  <DateBadge dueDate={task.dueDate} />
                </td>

                {/* Status Picker (Inline Quick Update) */}
                <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                  <div className="relative inline-block group/select">
                    <StatusBadge status={task.status} />
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange?.(task.id, e.target.value as TaskStatus)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      title="Click to quick change status"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>

                {/* Row Actions */}
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditTask?.(task)}
                      className="p-1.5 text-slate-400 hover:text-[#FE9F43] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit task details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTask?.(task)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
