import React, { useRef, useEffect } from 'react';
import { Search, Filter, X, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { TaskStatus, TaskPriority, TaskSortField, TaskOwner } from '@/types/task';

interface TaskFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus: TaskStatus | 'all';
  onStatusChange: (status: TaskStatus | 'all') => void;
  selectedPriority: TaskPriority | 'all';
  onPriorityChange: (priority: TaskPriority | 'all') => void;
  selectedOwnerId: string | 'all';
  onOwnerChange: (ownerId: string | 'all') => void;
  sortBy: TaskSortField;
  onSortByChange: (sort: TaskSortField) => void;
  sortOrder: 'asc' | 'desc';
  onToggleSortOrder: () => void;
  owners: TaskOwner[];
  onOpenMobileFilter?: () => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

const statusTabs: { id: TaskStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All Tasks' },
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'in_review', label: 'In Review' },
  { id: 'done', label: 'Done' },
];

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  selectedOwnerId,
  onOwnerChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  owners,
  onOpenMobileFilter,
  hasActiveFilters,
  onResetFilters,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement !== searchInputRef.current &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5 transition-all">
      {/* Primary Row: Status Tabs (Left) & Search Box with Mobile Filter (Right) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Navigation Status Tabs */}
        <div className="overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
          <nav className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl min-w-max border border-slate-200/50" aria-label="Status Tabs">
            {statusTabs.map((tab) => {
              const isActive = selectedStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onStatusChange(tab.id)}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#fe9f43] text-white shadow-2xs scale-[1.02]'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Search Input Box & Mobile Filter Button */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0">
          <div className="relative flex-1 lg:w-72 xl:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title, ID, owner... (Press '/')"
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fe9f43]/40 focus:border-[#fe9f43] focus:bg-white transition-all min-h-[38px] shadow-2xs"
            />
            {search ? (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200/60 rounded border border-slate-300/60 font-mono items-center justify-center pointer-events-none">
                /
              </kbd>
            )}
          </div>

          {/* Mobile Filter Button (< 1024px / lg) */}
          <button
            onClick={onOpenMobileFilter}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-[#fe9f43] text-white rounded-xl shadow-2xs hover:bg-[#e88f35] active:scale-95 transition-all shrink-0 min-h-[38px] cursor-pointer"
            aria-label="Open filter menu"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Secondary Controls Row (Desktop View >= 1024px / lg): Priority, Owner, Sort & Reset */}
      <div className="hidden lg:flex items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
        {/* Left: Filter Dropdowns */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters:</span>
          </div>

          {/* Priority Select */}
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 font-semibold focus:ring-2 focus:ring-[#fe9f43]/40 focus:border-[#fe9f43] focus:outline-none transition-all cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Owner Select */}
          <select
            value={selectedOwnerId}
            onChange={(e) => onOwnerChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 font-semibold focus:ring-2 focus:ring-[#fe9f43]/40 focus:border-[#fe9f43] focus:outline-none max-w-[200px] truncate transition-all cursor-pointer"
          >
            <option value="all">All Owners</option>
            <option value="unassigned">Unassigned</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>

          {/* Reset Active Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ml-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Right: Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as TaskSortField)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 font-semibold focus:ring-2 focus:ring-[#fe9f43]/40 focus:border-[#fe9f43] focus:outline-none transition-all cursor-pointer"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
          </select>

          <button
            onClick={onToggleSortOrder}
            className="p-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
