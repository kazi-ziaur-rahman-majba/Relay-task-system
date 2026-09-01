import { useState, useEffect, useMemo } from 'react';
import { TaskHeader } from '@/features/tasks/TaskHeader';
import { TaskFilterBar } from '@/features/tasks/TaskFilterBar';
import { TaskTableView } from '@/features/tasks/TaskTableView';
import { TaskCardView } from '@/features/tasks/TaskCardView';
import { MobileFilterDrawer } from '@/features/tasks/MobileFilterDrawer';
import { Pagination } from '@/components/common/Pagination';
import { Task, TaskOwner, PopulatedTask } from '@/types/task';
import { useUrlTaskState } from '@/hooks/useUrlTaskState';
import { processTasks } from '@/utils/taskFilterEngine';
import { isBefore, isToday, startOfDay } from 'date-fns';

export default function TaskManagerPage() {
  const [rawTasks, setRawTasks] = useState<Task[]>([]);
  const [owners, setOwners] = useState<TaskOwner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<PopulatedTask | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bi-directional URL SearchParams State Engine
  const {
    filters,
    setSearch,
    setStatus,
    setPriority,
    setOwnerId,
    setSortBy,
    toggleSortOrder,
    setPage,
    resetFilters,
    hasActiveFilters,
  } = useUrlTaskState();

  // Load normalized datasets (users.json and tasks.json)
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [usersRes, tasksRes] = await Promise.all([
          fetch('/users.json'),
          fetch('/tasks.json'),
        ]);

        const usersData: TaskOwner[] = await usersRes.json();
        const tasksData: Task[] = await tasksRes.json();

        setOwners(usersData);
        setRawTasks(tasksData);
      } catch (error) {
        console.error('Failed to load tasks dataset:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Map of users for fast O(1) lookup
  const usersMap = useMemo(() => {
    return owners.reduce<Record<string, TaskOwner>>((acc, owner) => {
      acc[owner.id] = owner;
      return acc;
    }, {});
  }, [owners]);

  // Overall Stat Counters across raw dataset
  const { urgentCount, overdueCount, unassignedCount } = useMemo(() => {
    const today = startOfDay(new Date('2026-08-31T12:00:00Z'));

    let urgent = 0;
    let overdue = 0;
    let unassigned = 0;

    rawTasks.forEach((task) => {
      if (task.priority === 'urgent') urgent++;
      if (task.ownerId === null) unassigned++;

      if (task.dueDate) {
        const dueDateObj = startOfDay(new Date(task.dueDate));
        if (isBefore(dueDateObj, today) && !isToday(dueDateObj)) {
          overdue++;
        }
      }
    });

    return {
      urgentCount: urgent,
      overdueCount: overdue,
      unassignedCount: unassigned,
    };
  }, [rawTasks]);

  // Process raw tasks through deterministic filter -> sort -> paginate pipeline
  const {
    items: processedTasks,
    totalItems,
    totalPages,
    currentPage,
    startIndex,
    endIndex,
  } = useMemo(() => {
    return processTasks(rawTasks, filters, usersMap, 10);
  }, [rawTasks, filters, usersMap]);

  // Toast Notification Helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Share View: Copy URL to clipboard
  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('URL copied to clipboard! Share this view with your team.');
  };

  const handleTaskClick = (task: PopulatedTask) => {
    setSelectedTask(task);
  };

  return (
    <div className="min-h-full bg-[#F7F7F7] text-slate-900 font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="w-full max-w-full px-3 sm:px-4 py-3 space-y-4">
        {/* Header & Stats Overview */}
        <TaskHeader
          totalTasks={rawTasks.length}
          urgentCount={urgentCount}
          overdueCount={overdueCount}
          unassignedCount={unassignedCount}
          onNewTaskClick={() => showToast('New Task modal will open here.')}
          onShareClick={handleShareClick}
        />

        {/* Filter Controls & Search Bar */}
        <TaskFilterBar
          filters={filters}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onPriorityChange={setPriority}
          onOwnerChange={setOwnerId}
          onSortByChange={setSortBy}
          onToggleSortOrder={toggleSortOrder}
          onResetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
          owners={owners}
          onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
        />

        {/* Loading Skeleton or Data Table/Cards */}
        {isLoading ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="inline-block w-8 h-8 border-4 border-[#FE9F43] border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs text-slate-500 font-bold">Loading workload dataset...</p>
          </div>
        ) : totalItems === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <p className="text-base font-extrabold text-slate-800">No tasks found matching your filters</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search criteria, clearing specific filters, or resetting all search conditions.
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mt-2 px-4 py-2 bg-[#FE9F43] text-white text-xs font-bold rounded-xl hover:bg-[#FF6E22] transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop / Tablet High-Density Table View (>= 768px / md) */}
            <div className="hidden md:block">
              <TaskTableView
                tasks={processedTasks}
                onTaskClick={handleTaskClick}
              />
            </div>

            {/* Mobile Touch Card View (< 768px / md) */}
            <div className="md:hidden">
              <TaskCardView
                tasks={processedTasks}
                onTaskClick={handleTaskClick}
              />
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={setPage}
            />
          </>
        )}
      </main>

      {/* Mobile Slide-Over Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onOwnerChange={setOwnerId}
        onResetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
        owners={owners}
      />

      {/* Detail Modal Placeholder */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-slate-500">{selectedTask.id}</span>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{selectedTask.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {selectedTask.description || 'No detailed description provided for this task.'}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500">
                Created: {new Date(selectedTask.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-1.5 bg-[#FE9F43] text-white font-bold rounded-lg hover:bg-[#FF6E22] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
