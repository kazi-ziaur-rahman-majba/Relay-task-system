import React from 'react';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
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
  return (
    <div className="space-y-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
      {/* Top Search Input & Mobile Filter Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by task title, ID (TSK-0001), or owner name... (Press '/' to focus)"
            className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fe9f43] focus:bg-white transition-all min-h-[38px]"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Button (< 768px / md) */}
        <button
          onClick={onOpenMobileFilter}
          className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-[#fe9f43] text-white rounded-xl transition-colors shrink-0 min-h-[38px]"
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
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onStatusChange(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#fe9f43] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-[#fe9f43] focus:outline-none"
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
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-[#fe9f43] focus:outline-none max-w-[180px] truncate"
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
              onClick={onResetFilters}
              className="px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as TaskSortField)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-[#fe9f43] focus:outline-none"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
          </select>

          <button
            onClick={onToggleSortOrder}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
