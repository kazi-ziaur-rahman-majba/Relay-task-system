import React from 'react';
import { TaskOwner } from '@/types/task';
import { UserX } from 'lucide-react';

interface AvatarProps {
  owner: TaskOwner | null;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  owner,
  size = 'md',
  showName = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }[size];

  if (!owner) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div
          className={`${sizeClasses} rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400`}
          title="Unassigned"
        >
          <UserX className="w-4 h-4" />
        </div>
        {showName && <span className="text-xs italic text-slate-400">Unassigned</span>}
      </div>
    );
  }

  const initials = owner.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`flex items-center gap-2 min-w-0 ${className}`}>
      <img
        src={owner.avatarUrl}
        alt={owner.name}
        className={`${sizeClasses} rounded-full object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0`}
        onError={(e) => {
          // Fallback to initials if image fails
          e.currentTarget.style.display = 'none';
          if (e.currentTarget.nextElementSibling) {
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
          }
        }}
      />
      <div
        className={`${sizeClasses} rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 hidden`}
        aria-hidden="true"
      >
        {initials}
      </div>
      {showName && (
        <span
          className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate max-w-[140px] sm:max-w-[180px]"
          title={owner.name}
        >
          {owner.name}
        </span>
      )}
    </div>
  );
};
