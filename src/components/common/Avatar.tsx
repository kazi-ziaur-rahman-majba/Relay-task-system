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
          className={`${sizeClasses} rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400 shrink-0`}
          title="Unassigned"
        >
          <UserX className="w-3.5 h-3.5" />
        </div>
        {showName && <span className="text-xs font-medium italic text-slate-400">Unassigned</span>}
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
        className={`${sizeClasses} rounded-full object-cover bg-slate-100 border border-slate-200 shrink-0`}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          if (e.currentTarget.nextElementSibling) {
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
          }
        }}
      />
      <div
        className={`${sizeClasses} rounded-full bg-[#FFF5EC] text-[#FE9F43] font-bold border border-[#FE9F43]/30 items-center justify-center shrink-0 hidden`}
        aria-hidden="true"
      >
        {initials}
      </div>
      {showName && (
        <span
          className="text-xs font-bold text-slate-900 truncate max-w-[140px] sm:max-w-[180px]"
          title={owner.name}
        >
          {owner.name}
        </span>
      )}
    </div>
  );
};
