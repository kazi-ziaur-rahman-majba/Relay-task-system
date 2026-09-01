import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { TaskHeader } from '@/features/tasks/TaskHeader';
import { TaskFilterBar } from '@/features/tasks/TaskFilterBar';
import { TaskTableView } from '@/features/tasks/TaskTableView';
import { TaskCardView } from '@/features/tasks/TaskCardView';
import { MobileFilterDrawer } from '@/features/tasks/MobileFilterDrawer';
import { Pagination } from '@/components/common/Pagination';
import { CreateTaskModal } from '@/features/tasks/modals/CreateTaskModal';
import { EditTaskModal } from '@/features/tasks/modals/EditTaskModal';
import { DeleteConfirmModal } from '@/features/tasks/modals/DeleteConfirmModal';
import { ShortcutsModal } from '@/features/tasks/modals/ShortcutsModal';
import { TaskDetailDrawer } from '@/features/tasks/modals/TaskDetailDrawer';
import { TaskOwner, PopulatedTask, TaskStatus, CreateTaskInput, UpdateTaskInput } from '@/types/task';
import { useUrlTaskState } from '@/hooks/useUrlTaskState';
import { useTaskStorage } from '@/hooks/useTaskStorage';
import { processTasks } from '@/utils/taskFilterEngine';

export default function TasksPage() {
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

  // Load team members
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

  const isLoading = isStorageLoading || isOwnersLoading;

  return (
    <div className="min-h-full bg-[#F7F7F7] text-slate-900 font-sans antialiased">
      <main className="w-full max-w-full px-1 sm:px-6 py-1 sm:py-4 space-y-2.5 sm:space-y-4">
        {/* Header with New Task CTA */}
        <TaskHeader
          title="All Tasks"
          description="Manage, filter, and track all team tasks efficiently"
          onNewTaskClick={() => setIsCreateModalOpen(true)}
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
            <p className="text-xs text-slate-500 font-bold">Loading tasks dataset...</p>
          </div>
        ) : totalItems === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <p className="text-base font-extrabold text-slate-800">No tasks found matching your filters</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search criteria or resetting filters.
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
            {/* Desktop / Tablet High-Density Table View */}
            <div className="hidden md:block">
              <TaskTableView
                tasks={processedTasks}
                onStatusChange={handleInlineStatusChange}
                onTaskClick={(task) => setSelectedTask(task)}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={(task) => setDeletingTask(task)}
              />
            </div>

            {/* Mobile Touch Card View */}
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

      {/* Right Slide-Over Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onEdit={(task) => setEditingTask(task)}
        onDelete={(task) => setDeletingTask(task)}
      />
    </div>
  );
}
