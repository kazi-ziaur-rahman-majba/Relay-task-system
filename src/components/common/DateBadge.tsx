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
      <span className={`inline-flex items-center gap-1 text-xs text-slate-400 font-medium italic ${className}`}>
        <Calendar className="w-3.5 h-3.5 text-slate-300" />
        No due date
      </span>
    );
  }

  const dateObj = new Date(dueDate);
  const today = startOfDay(new Date('2026-08-31T12:00:00Z'));
  const isOverdue = isBefore(startOfDay(dateObj), today);
  const isDueToday = isToday(dateObj);

  const formattedDate = format(dateObj, 'MMM d, yyyy');

  if (isOverdue) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-300 shadow-2xs ${className}`}
        title={`Overdue! Was due on ${formattedDate}`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        {formattedDate} (Overdue)
      </span>
    );
  }

  if (isDueToday) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs ${className}`}
        title="Due Today!"
      >
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        Today
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 ${className}`}
    >
      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      {formattedDate}
    </span>
  );
};
