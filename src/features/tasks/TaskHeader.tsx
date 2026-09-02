import React from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/page-header/PageHeader';

interface TaskHeaderProps {
  title?: string;
  description?: string;
  onNewTaskClick?: () => void;
  children?: React.ReactNode;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  title = "Team Task System",
  description = "Manage and track your team's work",
  onNewTaskClick,
  children,
}) => {
  return (
    <header className="pb-2">
      <PageHeader
        headerTitle={title}
        headerDescription={description}
      >
        {children}

        {onNewTaskClick && (
          <button
            type="button"
            onClick={onNewTaskClick}
            className="flex items-center justify-center px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold rounded-lg sm:rounded-xl bg-[#FE9F43] hover:bg-[#FF6E22] text-white transition-all shadow-2xs cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 stroke-[2.5]" />
            New Task
          </button>
        )}
      </PageHeader>
    </header>
  );
};
