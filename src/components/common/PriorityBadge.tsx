import React from 'react';
import { TaskPriority } from '@/types/task';
import { AlertCircle, AlertTriangle, ArrowUpRight, Minus } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

const priorityConfig: Record<
  TaskPriority,
  { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  urgent: {
    label: 'Urgent',
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    text: 'text-rose-700 dark:text-rose-300 font-bold',
    border: 'border-rose-300 dark:border-rose-800',
    icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />,
  },
  high: {
    label: 'High',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />,
  },
  medium: {
    label: 'Medium',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    icon: <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />,
  },
  low: {
    label: 'Low',
    bg: 'bg-slate-50 dark:bg-slate-800/60',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-700',
    icon: <Minus className="w-3.5 h-3.5 text-slate-400" />,
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const config = priorityConfig[priority] || priorityConfig.low;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md border shadow-2xs ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};
