import React, { useEffect, useRef, useState } from 'react';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
import { TaskStatus, TaskPriority, TaskSortField, TaskOwner, TaskFilterState } from '@/types/task';
import { useDebounce } from '@/hooks/useDebounce';

interface TaskFilterBarProps {
  filters: TaskFilterState;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: TaskStatus | 'all') => void;
  onPriorityChange: (priority: TaskPriority | 'all') => void;
  onOwnerChange: (ownerId: string) => void;
  onSortByChange: (sort: TaskSortField) => void;
  onToggleSortOrder: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  owners: TaskOwner[];
  onOpenMobileFilter?: () => void;
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
  filters,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onOwnerChange,
  onSortByChange,
  onToggleSortOrder,
  onResetFilters,
  hasActiveFilters,
  owners,
  onOpenMobileFilter,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Local immediate search state for smooth typing experience
  const [localSearchInput, setLocalSearchInput] = useState<string>(filters.search);

  // Sync local input when URL search param changes externally (e.g. browser back/forward or reset)
  useEffect(() => {
    setLocalSearchInput(filters.search);
  }, [filters.search]);

  // Debounce search input by 300ms before updating URL query params
  const debouncedSearchValue = useDebounce(localSearchInput, 300);

  useEffect(() => {
    if (debouncedSearchValue !== filters.search) {
      onSearchChange(debouncedSearchValue);
    }
  }, [debouncedSearchValue, filters.search, onSearchChange]);

  // Keyboard shortcut: '/' key to focus search bar (guarded against active input elements)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        const target = e.target as HTMLElement;
        const isInput =
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable);

        if (!isInput) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeStatus = filters.status.length > 0 ? filters.status[0] : 'all';
  const activePriority = filters.priority.length > 0 ? filters.priority[0] : 'all';

  return (
    <div className="space-y-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
      {/* Top Search Input & Mobile Filter Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={localSearchInput}
            onChange={(e) => setLocalSearchInput(e.target.value)}
            placeholder="Search tasks by title, ID (TSK-0001), or owner... (Press '/' to focus)"
            className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FE9F43] focus:bg-white transition-all min-h-[38px]"
          />
          {localSearchInput && (
            <button
              onClick={() => {
                setLocalSearchInput('');
                onSearchChange('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Button (< 768px / md) */}
        <button
          onClick={onOpenMobileFilter}
          className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-[#FE9F43] text-white rounded-xl transition-colors shrink-0 min-h-[38px] cursor-pointer"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          )}
        </button>
      </div>

      {/* Navigation Status Tabs */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-1 min-w-max" aria-label="Status Tabs">
          {statusTabs.map((tab) => {
            const isActive = activeStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onStatusChange(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FE9F43] text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Filter Selectors (Desktop View >= 768px / md) */}
      <div className="hidden md:flex items-center justify-between gap-3 pt-0.5 text-xs">
        <div className="flex items-center gap-2">
          {/* Priority Select */}
          <select
            value={activePriority}
            onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold focus:ring-2 focus:ring-[#FE9F43] focus:outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Owner Select */}
          <select
            value={filters.ownerId}
            onChange={(e) => onOwnerChange(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold focus:ring-2 focus:ring-[#FE9F43] focus:outline-none max-w-[180px] truncate cursor-pointer"
          >
            <option value="all">All Owners</option>
            <option value="unassigned">Unassigned</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setLocalSearchInput('');
                onResetFilters();
              }}
              className="px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-bold">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onSortByChange(e.target.value as TaskSortField)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold focus:ring-2 focus:ring-[#FE9F43] focus:outline-none cursor-pointer"
          >
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>

          <button
            onClick={onToggleSortOrder}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title={`Sort ${filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
