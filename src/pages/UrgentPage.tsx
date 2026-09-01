import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { TaskHeader } from '@/features/tasks/TaskHeader';
import { TaskTableView } from '@/features/tasks/TaskTableView';
import { TaskCardView } from '@/features/tasks/TaskCardView';
import { EditTaskModal } from '@/features/tasks/modals/EditTaskModal';
import { DeleteConfirmModal } from '@/features/tasks/modals/DeleteConfirmModal';
import { TaskOwner, PopulatedTask, TaskStatus, UpdateTaskInput } from '@/types/task';
import { useTaskStorage } from '@/hooks/useTaskStorage';
import { isBefore, isToday, startOfDay } from 'date-fns';
import { AlertCircle, Clock } from 'lucide-react';

export default function UrgentPage() {
  const {
    tasks: rawTasks,
    isLoading: isStorageLoading,
    updateTask,
    deleteTask,
  } = useTaskStorage();

  const [owners, setOwners] = useState<TaskOwner[]>([]);
  const [isOwnersLoading, setIsOwnersLoading] = useState<boolean>(true);
  const [editingTask, setEditingTask] = useState<PopulatedTask | null>(null);
  const [deletingTask, setDeletingTask] = useState<PopulatedTask | null>(null);
  const [selectedTask, setSelectedTask] = useState<PopulatedTask | null>(null);

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

  const usersMap = useMemo(() => {
    return owners.reduce<Record<string, TaskOwner>>((acc, owner) => {
      acc[owner.id] = owner;
      return acc;
    }, {});
  }, [owners]);

  // Filter urgent & overdue tasks
  const { urgentTasks, urgentCount, overdueCount } = useMemo(() => {
    const today = startOfDay(new Date('2026-08-31T12:00:00Z'));
    let urgent = 0;
    let overdue = 0;

    const filtered = rawTasks.filter((task) => {
      const isUrgent = task.priority === 'urgent';
      let isTaskOverdue = false;

      if (task.dueDate) {
        const dueDateObj = startOfDay(new Date(task.dueDate));
        if (isBefore(dueDateObj, today) && !isToday(dueDateObj)) {
          isTaskOverdue = true;
        }
      }

      if (isUrgent) urgent++;
      if (isTaskOverdue) overdue++;

      return isUrgent || isTaskOverdue;
    });

    const populated = filtered.map((task) => ({
      ...task,
      owner: task.ownerId ? usersMap[task.ownerId] || null : null,
    }));

    return {
      urgentTasks: populated,
      urgentCount: urgent,
      overdueCount: overdue,
    };
  }, [rawTasks, usersMap]);

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
      <main className="w-full max-w-full px-3 sm:px-6 py-4 space-y-5">
        {/* Header */}
        <TaskHeader
          title="Urgent & Overdue Focus"
          description="Dedicated triage view for high-priority and past-due tasks"
        />

        {/* Highlight Alert Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-amber-500 text-white flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white/90">Urgent Priority Items</p>
              <p className="text-xl font-black">{urgentCount} tasks need immediate attention</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-600 text-white flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white/90">Overdue Deadline Items</p>
              <p className="text-xl font-black">{overdueCount} tasks past target date</p>
            </div>
          </div>
        </div>

        {/* Task Table / Cards */}
        {isLoading ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="inline-block w-8 h-8 border-4 border-[#FE9F43] border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs text-slate-500 font-bold">Loading urgent workload...</p>
          </div>
        ) : urgentTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <h3 className="text-base font-extrabold text-slate-800">All clear! No urgent or overdue tasks.</h3>
            <p className="text-xs text-slate-500">Your team is up to date on all critical work items.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <TaskTableView
                tasks={urgentTasks}
                onStatusChange={handleInlineStatusChange}
                onTaskClick={(task) => setSelectedTask(task)}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={(task) => setDeletingTask(task)}
              />
            </div>

            <div className="md:hidden">
              <TaskCardView
                tasks={urgentTasks}
                onStatusChange={handleInlineStatusChange}
                onTaskClick={(task) => setSelectedTask(task)}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={(task) => setDeletingTask(task)}
              />
            </div>
          </>
        )}
      </main>

      {/* Modals */}
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
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{selectedTask.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                {selectedTask.description || 'No detailed description provided for this task.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
