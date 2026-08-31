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
    bg: 'bg-rose-50',
    text: 'text-rose-700 font-extrabold',
    border: 'border-rose-300',
    icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />,
  },
  high: {
    label: 'High',
    bg: 'bg-amber-50',
    text: 'text-amber-800 font-bold',
    border: 'border-amber-300',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
  },
  medium: {
    label: 'Medium',
    bg: 'bg-sky-50',
    text: 'text-sky-800 font-bold',
    border: 'border-sky-300',
    icon: <ArrowUpRight className="w-3.5 h-3.5 text-sky-600" />,
  },
  low: {
    label: 'Low',
    bg: 'bg-slate-100',
    text: 'text-slate-700 font-semibold',
    border: 'border-slate-300',
    icon: <Minus className="w-3.5 h-3.5 text-slate-500" />,
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const config = priorityConfig[priority] || priorityConfig.low;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border shadow-2xs ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};
