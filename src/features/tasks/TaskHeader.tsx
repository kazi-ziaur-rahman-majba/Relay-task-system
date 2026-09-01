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
            className="flex items-center justify-center px-4 py-2 text-xs font-black rounded-xl bg-[#FE9F43] hover:bg-[#FF6E22] text-white transition-all shadow-2xs cursor-pointer min-h-[40px]"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[3]" />
            New Task
          </button>
        )}
      </PageHeader>
    </header>
  );
};
