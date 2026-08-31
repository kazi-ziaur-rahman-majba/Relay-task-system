import React from 'react';
import { Calendar, AlertCircle, Clock } from 'lucide-react';
import { format, isBefore, isToday, startOfDay } from 'date-fns';

interface DateBadgeProps {
  dueDate: string | null;
  className?: string;
}

export const DateBadge: React.FC<DateBadgeProps> = ({ dueDate, className = '' }) => {
  if (!dueDate) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-slate-400 italic ${className}`}>
        <Calendar className="w-3.5 h-3.5 text-slate-300" />
        No due date
      </span>
    );
  }

  const dateObj = new Date(dueDate);
  const today = startOfDay(new Date('2026-08-31T12:00:00Z')); // Current local context date
  const isOverdue = isBefore(startOfDay(dateObj), today);
  const isDueToday = isToday(dateObj);

  const formattedDate = format(dateObj, 'MMM d, yyyy');

  if (isOverdue) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 ${className}`}
        title={`Overdue! Was due on ${formattedDate}`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
        {formattedDate} (Overdue)
      </span>
    );
  }

  if (isDueToday) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 ${className}`}
        title="Due Today!"
      >
        <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        Today
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 ${className}`}
    >
      <Calendar className="w-3.5 h-3.5 text-slate-400" />
      {formattedDate}
    </span>
  );
};
