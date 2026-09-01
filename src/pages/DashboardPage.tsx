import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TaskHeader } from '@/features/tasks/TaskHeader';
import { StatCards } from '@/features/tasks/StatCards';
import { AnalyticsPanel } from '@/features/tasks/analytics/AnalyticsPanel';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar } from '@/components/common/Avatar';
import { TaskOwner, PopulatedTask } from '@/types/task';
import { useTaskStorage } from '@/hooks/useTaskStorage';
import { isBefore, isToday, startOfDay } from 'date-fns';
import { ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const { tasks: rawTasks, isLoading: isStorageLoading } = useTaskStorage();
  const [owners, setOwners] = useState<TaskOwner[]>([]);
  const [isOwnersLoading, setIsOwnersLoading] = useState<boolean>(true);

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

  // Compute stat metrics
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

    return { urgentCount: urgent, overdueCount: overdue, unassignedCount: unassigned };
  }, [rawTasks]);

  // Urgent & Recent Tasks for Widget
  const recentCriticalTasks: PopulatedTask[] = useMemo(() => {
    return rawTasks
      .filter((task) => task.priority === 'urgent' || task.status === 'in_progress')
      .slice(0, 5)
      .map((task) => ({
        ...task,
        owner: task.ownerId ? usersMap[task.ownerId] || null : null,
      }));
  }, [rawTasks, usersMap]);

  const isLoading = isStorageLoading || isOwnersLoading;

  return (
    <div className="min-h-full bg-[#F7F7F7] text-slate-900 font-sans antialiased">
      <main className="w-full max-w-full px-1 sm:px-6 py-1 sm:py-4 space-y-3 sm:space-y-6">
        {/* Page Header */}
        <TaskHeader
          title="Dashboard & Analytics"
          description="Executive summary of team workload, task progress, and analytics"
        />

        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="inline-block w-8 h-8 border-4 border-[#FE9F43] border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs text-slate-500 font-bold">Loading dashboard metrics...</p>
          </div>
        ) : (
          <>
            {/* Top 4 Stat Summary Cards */}
            <StatCards
              totalTasks={rawTasks.length}
              urgentCount={urgentCount}
              overdueCount={overdueCount}
              unassignedCount={unassignedCount}
            />

            {/* Visual Workload Analytics Panel */}
            <AnalyticsPanel tasks={rawTasks} />

            {/* Recent Critical Tasks Widget */}
            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#FE9F43] shrink-0" />
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900">High Priority & In-Progress Tasks</h2>
                    <p className="text-xs text-slate-500 font-medium">Quick snapshot of active tasks needing attention</p>
                  </div>
                </div>
                <Link
                  to="/tasks"
                  className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-[#FE9F43] hover:text-[#FF6E22] bg-amber-50 hover:bg-amber-100/80 rounded-xl transition-colors shrink-0"
                >
                  View All Tasks <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {recentCriticalTasks.map((task) => (
                  <div key={task.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <CheckCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#051A2C]">{task.id}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-slate-900 line-clamp-2 mt-0.5" title={task.title}>
                          {task.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pl-6 sm:pl-0 shrink-0">
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />
                      {task.owner ? (
                        <Avatar owner={task.owner} size="sm" />
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Unassigned</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
