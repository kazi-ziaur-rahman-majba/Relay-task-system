import React from 'react';
import { TaskStatus } from '@/types/task';

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

const statusConfig: Record<TaskStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  backlog: {
    label: 'Backlog',
    bg: 'bg-slate-100',
    text: 'text-slate-800 font-bold',
    border: 'border-slate-300',
    dot: 'bg-slate-500',
  },
  todo: {
    label: 'To Do',
    bg: 'bg-sky-50',
    text: 'text-sky-800 font-bold',
    border: 'border-sky-300',
    dot: 'bg-sky-500',
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-indigo-50',
    text: 'text-indigo-800 font-bold',
    border: 'border-indigo-300',
    dot: 'bg-indigo-600',
  },
  in_review: {
    label: 'In Review',
    bg: 'bg-amber-50',
    text: 'text-amber-800 font-bold',
    border: 'border-amber-300',
    dot: 'bg-amber-500',
  },
  done: {
    label: 'Done',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800 font-bold',
    border: 'border-emerald-300',
    dot: 'bg-emerald-600',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status] || statusConfig.backlog;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border shadow-2xs transition-colors ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
    </span>
  );
};
