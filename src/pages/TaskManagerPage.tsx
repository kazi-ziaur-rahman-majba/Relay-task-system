import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { TaskHeader } from '@/features/tasks/TaskHeader';
import { TaskFilterBar } from '@/features/tasks/TaskFilterBar';
import { TaskTableView } from '@/features/tasks/TaskTableView';
import { TaskCardView } from '@/features/tasks/TaskCardView';
import { MobileFilterDrawer } from '@/features/tasks/MobileFilterDrawer';
import { AnalyticsPanel } from '@/features/tasks/analytics/AnalyticsPanel';
import { Pagination } from '@/components/common/Pagination';
import { CreateTaskModal } from '@/features/tasks/modals/CreateTaskModal';
import { EditTaskModal } from '@/features/tasks/modals/EditTaskModal';
import { DeleteConfirmModal } from '@/features/tasks/modals/DeleteConfirmModal';
import { ShortcutsModal } from '@/features/tasks/modals/ShortcutsModal';
import { TaskOwner, PopulatedTask, TaskStatus, CreateTaskInput, UpdateTaskInput } from '@/types/task';
import { useUrlTaskState } from '@/hooks/useUrlTaskState';
import { useTaskStorage } from '@/hooks/useTaskStorage';
import { exportTasksToJson, parseImportedJsonFile } from '@/utils/datasetUtils';
import { processTasks } from '@/utils/taskFilterEngine';
import { isBefore, isToday, startOfDay } from 'date-fns';

export default function TaskManagerPage() {
  const {
    tasks: rawTasks,
    isLoading: isStorageLoading,
    createTask,
    updateTask,
    deleteTask,
    resetToDefaultSeed,
  } = useTaskStorage();

  const [owners, setOwners] = useState<TaskOwner[]>([]);
  const [isOwnersLoading, setIsOwnersLoading] = useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Modal Visibility States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<PopulatedTask | null>(null);
  const [deletingTask, setDeletingTask] = useState<PopulatedTask | null>(null);
  const [selectedTask, setSelectedTask] = useState<PopulatedTask | null>(null);

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

  // Load team members dataset (team-members.json)
  useEffect(() => {
    async function loadTeamMembers() {
      try {
        setIsOwnersLoading(true);
        const res = await fetch('/team-members.json');
        const usersData: TaskOwner[] = await res.json();
        setOwners(usersData);
      } catch (error) {
        console.error('Failed to load team-members dataset:', error);
      } finally {
        setIsOwnersLoading(false);
      }
    }

    loadTeamMembers();
  }, []);

  // Keyboard shortcut listener for '?' key to launch Shortcuts Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?') {
        const target = e.target as HTMLElement;
        const isInput =
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable);

        if (!isInput) {
          e.preventDefault();
          setIsShortcutsOpen((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const usersMap = useMemo(() => {
    return owners.reduce<Record<string, TaskOwner>>((acc, owner) => {
      acc[owner.id] = owner;
      return acc;
    }, {});
  }, [owners]);

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

  // Mutation Handlers
  const handleCreateTask = (input: CreateTaskInput) => {
    createTask(input);
    toast.success(`New task created successfully!`);
  };

  const handleInlineStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
    toast.success(`Task ${taskId} status updated to ${newStatus.replace('_', ' ')}.`);
  };

  const handleEditTaskSubmit = (id: string, updates: UpdateTaskInput) => {
    updateTask(id, updates);
    toast.success(`Task ${id} details saved successfully.`);
    setEditingTask(null);
  };

  const handleDeleteTaskConfirm = (id: string) => {
    deleteTask(id);
    toast.error(`Task ${id} has been deleted.`);
    setDeletingTask(null);
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('URL copied to clipboard! Share this view with your team.');
  };

  // JSON Mobility Handlers
  const handleExportJson = () => {
    exportTasksToJson(rawTasks);
    toast.success(`Exported ${rawTasks.length} tasks to JSON file.`);
  };

  const handleImportJsonFile = async (file: File) => {
    try {
      const importedTasks = await parseImportedJsonFile(file);
      localStorage.setItem('relay_tasks_data', JSON.stringify(importedTasks));
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || 'Failed to import JSON file.');
    }
  };

  const isLoading = isStorageLoading || isOwnersLoading;

  return (
    <div className="min-h-full bg-[#F7F7F7] text-slate-900 font-sans antialiased">
      <main className="w-full max-w-full px-3 sm:px-4 py-3 space-y-4">
        {/* Header & Stats Overview */}
        <TaskHeader
          totalTasks={rawTasks.length}
          urgentCount={urgentCount}
          overdueCount={overdueCount}
          unassignedCount={unassignedCount}
          onNewTaskClick={() => setIsCreateModalOpen(true)}
          onShareClick={handleShareClick}
          onToggleAnalytics={() => setIsAnalyticsOpen((prev) => !prev)}
          isAnalyticsOpen={isAnalyticsOpen}
          onExportJson={handleExportJson}
          onImportJsonFile={handleImportJsonFile}
        />

        {/* Collapsible Workload Visual Analytics Panel */}
        {isAnalyticsOpen && <AnalyticsPanel tasks={rawTasks} />}

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

        {/* Developer Reset Seed Button Notice */}
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
          <span>Press <kbd className="px-1 py-0.5 bg-white border rounded text-slate-600 shadow-2xs">?</kbd> for keyboard shortcuts guide</span>
          <button
            onClick={() => {
              if (confirm('Reset task data back to default 250 seed items?')) {
                resetToDefaultSeed();
                toast.success('Restored default 250 seed tasks.');
              }
            }}
            className="hover:text-[#FE9F43] transition-colors cursor-pointer"
          >
            Reset Demo Seed Data
          </button>
        </div>

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
                onStatusChange={handleInlineStatusChange}
                onTaskClick={(task) => setSelectedTask(task)}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={(task) => setDeletingTask(task)}
              />
            </div>

            {/* Mobile Touch Card View (< 768px / md) */}
            <div className="md:hidden">
              <TaskCardView
                tasks={processedTasks}
                onStatusChange={handleInlineStatusChange}
                onTaskClick={(task) => setSelectedTask(task)}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={(task) => setDeletingTask(task)}
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

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        owners={owners}
      />

      <EditTaskModal
        task={editingTask}
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        onSubmit={handleEditTaskSubmit}
        owners={owners}
      />

      <DeleteConfirmModal
        task={deletingTask}
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTaskConfirm}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Detail View Modal */}
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingTask(selectedTask);
                    setSelectedTask(null);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{selectedTask.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                {selectedTask.description || 'No detailed description provided for this task.'}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Created: {new Date(selectedTask.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(selectedTask.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
