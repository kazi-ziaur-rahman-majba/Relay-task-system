import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TaskHeader } from '@/features/tasks/TaskHeader';
import { StatCards } from '@/features/tasks/StatCards';
import { AnalyticsPanel } from '@/features/tasks/analytics/AnalyticsPanel';
import { DateBadge } from '@/components/common/DateBadge';
import { TaskDetailDrawer } from '@/features/tasks/modals/TaskDetailDrawer';
import HorizontalChart from '@/components/chart/HorizontalChart';
import { DashboardSkeleton } from '@/components/skeleton';
import { TaskOwner, PopulatedTask } from '@/types/task';
import { useTaskStorage } from '@/hooks/useTaskStorage';
import { isBefore, isToday, startOfDay } from 'date-fns';
import { ArrowRight, ListTodo } from 'lucide-react';

export default function DashboardPage() {
  const { tasks: rawTasks, isLoading: isStorageLoading } = useTaskStorage();
  const [owners, setOwners] = useState<TaskOwner[]>([]);
  const [isOwnersLoading, setIsOwnersLoading] = useState<boolean>(true);
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

  // Recent 5 Created Tasks (latest tasks first, latest ID tiebreaker)
  const recentCreatedTasks: PopulatedTask[] = useMemo(() => {
    return [...rawTasks]
      .sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        if (timeB !== timeA) {
          return timeB - timeA;
        }
        const idA = parseInt(a.id.replace('TSK-', ''), 10) || 0;
        const idB = parseInt(b.id.replace('TSK-', ''), 10) || 0;
        return idB - idA;
      })
      .slice(0, 5)
      .map((task) => ({
        ...task,
        owner: task.ownerId ? usersMap[task.ownerId] || null : null,
      }));
  }, [rawTasks, usersMap]);

  // Compute member assigned task workload for the thin horizontal bar chart
  const memberWorkload = useMemo(() => {
    const counts: Record<string, number> = {};
    owners.forEach((o) => {
      counts[o.id] = 0;
    });

    rawTasks.forEach((t) => {
      if (t.ownerId && counts[t.ownerId] !== undefined) {
        counts[t.ownerId]++;
      }
    });

    const sorted = [...owners]
      .map((o) => {
        const parts = o.name.split(' ');
        const shortName = parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
        return {
          id: o.id,
          name: shortName,
          count: counts[o.id] || 0,
        };
      })
      .sort((a, b) => b.count - a.count);

    return {
      labels: sorted.map((s) => s.name),
      data: sorted.map((s) => s.count),
    };
  }, [owners, rawTasks]);

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
          <DashboardSkeleton />
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

            {/* Side-by-Side: Recent Tasks (Left) + Assigned Workload Thin Bar Chart (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">
              {/* Left: Recent Tasks & Activities Widget */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                {/* Header with Title and View All CTA */}
                <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3 border-b border-slate-100 pb-2.5 sm:pb-3">
                  <div className="flex items-start sm:items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-[#FE9F43] flex items-center justify-center font-bold shrink-0 mt-0.5 sm:mt-0">
                      <ListTodo className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug sm:leading-tight">
                        Recent Activity & Tasks
                      </h2>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-normal mt-0.5">
                        Latest 5 newly created tasks across workflows
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/tasks"
                    className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-[#FE9F43] hover:text-[#FF6E22] bg-amber-50 hover:bg-amber-100/80 rounded-xl transition-colors shrink-0 self-start sm:self-auto mt-0.5 sm:mt-0"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </Link>
                </div>

                {/* Tasks List */}
                <div className="space-y-2.5 flex-1">
                  {recentCreatedTasks.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 font-medium bg-slate-50 rounded-xl">
                      No tasks available in this view.
                    </div>
                  ) : (
                    recentCreatedTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="group p-3 rounded-xl border border-slate-100 hover:border-amber-200/90 bg-slate-50/30 hover:bg-amber-50/20 transition-all duration-200 flex items-center justify-between gap-2.5 cursor-pointer shadow-2xs hover:shadow-xs"
                      >
                        {/* Left: Task ID & Title */}
                        <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                          <span className="font-mono text-xs font-normal text-slate-600 bg-white group-hover:bg-[#FE9F43]/10 group-hover:text-[#FE9F43] px-2 py-0.5 rounded-md border border-slate-200/80 group-hover:border-amber-300/60 transition-colors shrink-0">
                            {task.id}
                          </span>
                          <p
                            className="hidden sm:block text-xs sm:text-sm font-normal text-slate-700 group-hover:text-slate-900 truncate transition-colors"
                            title={task.title}
                          >
                            {task.title}
                          </p>
                        </div>

                        {/* Right: Deadline Only */}
                        <div className="flex items-center gap-2 shrink-0 pl-2">
                          <DateBadge dueDate={task.dueDate} />
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#FE9F43] group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100 hidden sm:block" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right: Thin Horizontal Bar Chart (Team Workload) */}
              <HorizontalChart
                labels={memberWorkload.labels}
                data={memberWorkload.data}
                title="Assigned Tasks by Member"
                subtitle="Live task count assigned per team member"
              />
            </div>
          </>
        )}
      </main>

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
