import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskOwner, PopulatedTask, TaskStatus, TaskPriority, TaskSortField } from '@/types/task';
import { TaskHeader } from '@/features/tasks/TaskHeader';
import { TaskFilterBar } from '@/features/tasks/TaskFilterBar';
import { TaskTableView } from '@/features/tasks/TaskTableView';
import { TaskCardView } from '@/features/tasks/TaskCardView';
import { MobileFilterDrawer } from '@/features/tasks/MobileFilterDrawer';

export const TaskManagerPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<TaskOwner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<TaskSortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Mobile Filter Drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Toast notification for Share Link
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch tasks and users from public JSON
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksRes, usersRes] = await Promise.all([
          fetch('/tasks.json'),
          fetch('/users.json'),
        ]);

        if (!tasksRes.ok || !usersRes.ok) {
          throw new Error('Failed to load tasks data');
        }

        const tasksData: Task[] = await tasksRes.json();
        const usersData: TaskOwner[] = await usersRes.json();

        setTasks(tasksData);
        setUsers(usersData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Something went wrong while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Map tasks with populated owner objects
  const usersMap = useMemo(() => {
    const map = new Map<string, TaskOwner>();
    users.forEach((u) => map.set(u.id, u));
    return map;
  }, [users]);

  const populatedTasks: PopulatedTask[] = useMemo(() => {
    return tasks.map((t) => ({
      ...t,
      owner: t.ownerId ? usersMap.get(t.ownerId) || null : null,
    }));
  }, [tasks, usersMap]);

  // Overall Statistics for Header
  const totalTasks = populatedTasks.length;
  const urgentCount = useMemo(() => populatedTasks.filter((t) => t.priority === 'urgent').length, [populatedTasks]);
  const overdueCount = useMemo(() => {
    const today = new Date('2026-08-31T12:00:00Z');
    return populatedTasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < today && t.status !== 'done'
    ).length;
  }, [populatedTasks]);
  const unassignedCount = useMemo(() => populatedTasks.filter((t) => !t.ownerId).length, [populatedTasks]);

  // Filtered & Sorted Tasks Pipeline
  const filteredTasks = useMemo(() => {
    let result = [...populatedTasks];

    // 1. Search Filter (Title, ID, Owner Name)
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          (t.owner && t.owner.name.toLowerCase().includes(q))
      );
    }

    // 2. Status Filter
    if (selectedStatus !== 'all') {
      result = result.filter((t) => t.status === selectedStatus);
    }

    // 3. Priority Filter
    if (selectedPriority !== 'all') {
      result = result.filter((t) => t.priority === selectedPriority);
    }

    // 4. Owner Filter
    if (selectedOwnerId !== 'all') {
      if (selectedOwnerId === 'unassigned') {
        result = result.filter((t) => !t.ownerId);
      } else {
        result = result.filter((t) => t.ownerId === selectedOwnerId);
      }
    }

    // 5. Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'dueDate') {
        const d1 = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const d2 = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        comparison = d1 - d2;
      } else if (sortBy === 'priority') {
        const priorityOrder: Record<TaskPriority, number> = { urgent: 1, high: 2, medium: 3, low: 4 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'createdAt') {
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [populatedTasks, search, selectedStatus, selectedPriority, selectedOwnerId, sortBy, sortOrder]);

  const hasActiveFilters =
    Boolean(search) ||
    selectedStatus !== 'all' ||
    selectedPriority !== 'all' ||
    selectedOwnerId !== 'all';

  const handleResetFilters = () => {
    setSearch('');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSelectedOwnerId('all');
    setSortBy('dueDate');
    setSortOrder('asc');
  };

  const handleShareClick = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setToastMessage('Filtered view link copied to clipboard!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-full bg-[#F7F7F7] text-slate-900 font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg shadow-lg text-sm font-semibold flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="w-full max-w-full px-2.5 sm:px-3.5 py-2.5 space-y-3.5">
        {/* Header & Stats Overview */}
        <TaskHeader
          totalTasks={totalTasks}
          urgentCount={urgentCount}
          overdueCount={overdueCount}
          unassignedCount={unassignedCount}
          onNewTaskClick={() => alert('New Task Modal feature coming next!')}
          onShareClick={handleShareClick}
        />

        {/* Filter Bar */}
        <TaskFilterBar
          search={search}
          onSearchChange={setSearch}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          selectedOwnerId={selectedOwnerId}
          onOwnerChange={setSelectedOwnerId}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onToggleSortOrder={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
          owners={users}
          onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
        />

        {/* Main Content Area */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 animate-pulse font-medium">
            Loading team tasks...
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-600 dark:text-rose-400 space-y-3">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-2xs">
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No matching tasks found</h3>
            <p className="text-sm text-slate-400">
              No tasks match your current filter parameters. Try clearing your filters to see all tasks.
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Counter bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>Showing <strong>{filteredTasks.length}</strong> of {totalTasks} tasks</span>
            </div>

            {/* Desktop View (>= 768px) */}
            <div className="hidden md:block">
              <TaskTableView tasks={filteredTasks} />
            </div>

            {/* Mobile View (< 768px) */}
            <div className="block md:hidden">
              <TaskCardView tasks={filteredTasks} />
            </div>
          </div>
        )}
      </main>

      {/* Mobile Filter Slide-over Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        selectedOwnerId={selectedOwnerId}
        onOwnerChange={setSelectedOwnerId}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        owners={users}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};
