import React from 'react';
import { AlertCircle, Clock, UserX, Plus, Share2, CheckCircle2 } from 'lucide-react';
import PageHeader from '@/components/page-header/PageHeader';

interface TaskHeaderProps {
  totalTasks: number;
  urgentCount: number;
  overdueCount: number;
  unassignedCount: number;
  onNewTaskClick?: () => void;
  onShareClick?: () => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  totalTasks,
  urgentCount,
  overdueCount,
  unassignedCount,
  onNewTaskClick,
  onShareClick,
}) => {
  return (
    <header className="space-y-4 pb-2">
      {/* Reusable PageHeader Component Integration */}
      <PageHeader
        headerTitle="Team Task System"
        headerDescription="Manage and track your team's work"
      >
        <button
          type="button"
          onClick={onShareClick}
          className="flex items-center justify-center px-3.5 py-2 text-xs font-bold rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer min-h-[40px]"
        >
          <Share2 className="w-4 h-4 mr-1.5 text-[#FE9F43]" />
          Share
        </button>

        <button
          type="button"
          onClick={onNewTaskClick}
          className="flex items-center justify-center px-4 py-2 text-xs font-black rounded-xl bg-[#FE9F43] hover:bg-[#FF6E22] text-white transition-all shadow-2xs cursor-pointer min-h-[40px]"
        >
          <Plus className="w-4 h-4 mr-1.5 stroke-[3]" />
          New Task
        </button>
      </PageHeader>

      {/* 4 Stat Cards with User's Exact Color Scheme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Brand Amber/Orange (#FE9F43) */}
        <div className="py-5 px-4 rounded-2xl bg-[#FE9F43] text-white shadow-xs flex items-center justify-between gap-3 min-h-[102px] transition-transform hover:scale-[1.01]">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-[#FE9F43]" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white/90 truncate">Total Tasks</p>
              <h3 className="text-2xl font-black text-white leading-tight">
                {totalTasks}
              </h3>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white/20 text-white shrink-0">
            ↑ +22%
          </span>
        </div>

        {/* Card 2: Deep Navy (#092C4C) */}
        <div className="py-5 px-4 rounded-2xl bg-[#092C4C] text-white shadow-xs flex items-center justify-between gap-3 min-h-[102px] transition-transform hover:scale-[1.01]">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertCircle className="w-6 h-6 text-[#092C4C] animate-pulse" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white/90 truncate">Urgent Tasks</p>
              <h3 className="text-2xl font-black text-white leading-tight">
                {urgentCount}
              </h3>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white/20 text-white shrink-0">
            High Priority
          </span>
        </div>

        {/* Card 3: Custom Teal (#0F9384) */}
        <div className="py-5 px-4 rounded-2xl bg-[#0F9384] text-white shadow-xs flex items-center justify-between gap-3 min-h-[102px] transition-transform hover:scale-[1.01]">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-6 h-6 text-[#0F9384]" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white/90 truncate">Overdue Tasks</p>
              <h3 className="text-2xl font-black text-white leading-tight">
                {overdueCount}
              </h3>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white/20 text-white shrink-0">
            Past Due
          </span>
        </div>

        {/* Card 4: Royal Blue (#155EEF) */}
        <div className="py-5 px-4 rounded-2xl bg-[#155EEF] text-white shadow-xs flex items-center justify-between gap-3 min-h-[102px] transition-transform hover:scale-[1.01]">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
              <UserX className="w-6 h-6 text-[#155EEF]" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white/90 truncate">Unassigned</p>
              <h3 className="text-2xl font-black text-white leading-tight">
                {unassignedCount}
              </h3>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white/20 text-white shrink-0">
            Needs Owner
          </span>
        </div>
      </div>
    </header>
  );
};
