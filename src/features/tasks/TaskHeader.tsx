import React from 'react';
import { AlertCircle, Clock, UserX, Plus, Share2, CheckCircle2 } from 'lucide-react';

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
      {/* Original Header Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#051A2C] tracking-tight">
            Team Task System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage and track your team's work
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onShareClick}
            className="flex items-center justify-center px-3.5 py-2 text-xs font-bold rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer min-h-[40px]"
          >
            <Share2 className="w-4 h-4 mr-1.5 text-[#fe9f43]" />
            Share
          </button>

          <button
            type="button"
            onClick={onNewTaskClick}
            className="flex items-center justify-center px-4 py-2 text-xs font-black rounded-xl bg-[#fe9f43] hover:bg-[#FF6E22] text-white transition-all shadow-2xs cursor-pointer min-h-[40px]"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[3]" />
            New Task
          </button>
        </div>
      </div>

      {/* 4 Colored Stat Cards Matching Uploaded Reference Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Orange/Amber Solid Background (Total Tasks) */}
        <div className="p-4 rounded-2xl bg-[#fe9f43] text-white shadow-xs flex items-center justify-between gap-3 transition-transform hover:scale-[1.01]">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-[#fe9f43]" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white/90 truncate">Total Tasks</p>
              <h3 className="text-2xl font-black text-white leading-tight">
                {totalTasks}
              </h3>
            </div>
          </div>
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-white/20 text-white shrink-0">
            ↑ +22%
          </span>
        </div>

        {/* Card 2: Deep Navy Solid Background (Urgent Tasks) */}
        <div className="p-4 rounded-2xl bg-[#051A2C] text-white shadow-xs flex items-center justify-between gap-3 transition-transform hover:scale-[1.01]">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertCircle className="w-6 h-6 text-rose-600 animate-pulse" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white/90 truncate">Urgent Tasks</p>
              <h3 className="text-2xl font-black text-white leading-tight">
                {urgentCount}
              </h3>
            </div>
          </div>
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-rose-500/30 text-rose-200 shrink-0">
            ↓ -22%
          </span>
        </div>

        {/* Card 3: Teal/Emerald Solid Background (Overdue Tasks) */}
        <div className="p-4 rounded-2xl bg-[#0D9488] text-white shadow-xs flex items-center justify-between gap-3 transition-transform hover:scale-[1.01]">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-6 h-6 text-[#0D9488]" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white/90 truncate">Overdue Tasks</p>
              <h3 className="text-2xl font-black text-white leading-tight">
                {overdueCount}
              </h3>
            </div>
          </div>
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-white/20 text-white shrink-0">
            ↑ +22%
          </span>
        </div>

        {/* Card 4: Royal Blue Solid Background (Unassigned Tasks) */}
        <div className="p-4 rounded-2xl bg-[#2563EB] text-white shadow-xs flex items-center justify-between gap-3 transition-transform hover:scale-[1.01]">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
              <UserX className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white/90 truncate">Unassigned</p>
              <h3 className="text-2xl font-black text-white leading-tight">
                {unassignedCount}
              </h3>
            </div>
          </div>
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-white/20 text-white shrink-0">
            ↑ +22%
          </span>
        </div>
      </div>
    </header>
  );
};
