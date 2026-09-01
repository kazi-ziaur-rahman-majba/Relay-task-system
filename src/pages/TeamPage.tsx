import { useState, useEffect, useMemo } from 'react';
import { TaskHeader } from '@/features/tasks/TaskHeader';
import { Avatar } from '@/components/common/Avatar';
import { TaskOwner } from '@/types/task';
import { useTaskStorage } from '@/hooks/useTaskStorage';
import { Mail, ShieldCheck } from 'lucide-react';

export default function TeamPage() {
  const { tasks: rawTasks, isLoading: isStorageLoading } = useTaskStorage();
  const [owners, setOwners] = useState<TaskOwner[]>([]);
  const [isOwnersLoading, setIsOwnersLoading] = useState<boolean>(true);

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

  // Compute stats per team member
  const memberWorkload = useMemo(() => {
    const stats: Record<string, { total: number; completed: number; inProgress: number; todo: number }> = {};

    owners.forEach((o) => {
      stats[o.id] = { total: 0, completed: 0, inProgress: 0, todo: 0 };
    });

    let unassignedCount = 0;

    rawTasks.forEach((task) => {
      if (!task.ownerId) {
        unassignedCount++;
        return;
      }
      if (!stats[task.ownerId]) {
        stats[task.ownerId] = { total: 0, completed: 0, inProgress: 0, todo: 0 };
      }
      stats[task.ownerId].total++;
      if (task.status === 'done') stats[task.ownerId].completed++;
      if (task.status === 'in_progress') stats[task.ownerId].inProgress++;
      if (task.status === 'todo' || task.status === 'backlog') stats[task.ownerId].todo++;
    });

    return { stats, unassignedCount };
  }, [owners, rawTasks]);

  const isLoading = isStorageLoading || isOwnersLoading;

  return (
    <div className="min-h-full bg-[#F7F7F7] text-slate-900 font-sans antialiased">
      <main className="w-full max-w-full px-3 sm:px-6 py-4 space-y-6">
        {/* Header */}
        <TaskHeader
          title="Team Directory & Workload"
          description="Monitor team member task assignments, workload distribution, and completion rates"
        />

        {isLoading ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="inline-block w-8 h-8 border-4 border-[#FE9F43] border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs text-slate-500 font-bold">Loading team workload data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {owners.map((member) => {
              const mStats = memberWorkload.stats[member.id] || { total: 0, completed: 0, inProgress: 0, todo: 0 };
              const completionPercent = mStats.total > 0 ? Math.round((mStats.completed / mStats.total) * 100) : 0;

              return (
                <div key={member.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 hover:border-[#FE9F43]/50 transition-all">
                  {/* User Profile Header */}
                  <div className="flex items-center gap-3.5">
                    <Avatar owner={member} size="lg" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-extrabold text-slate-900 truncate">{member.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 font-medium mt-0.5 truncate">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        {member.email}
                      </p>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#FE9F43]" />
                      Team Member
                    </span>
                    <span className="font-mono font-bold text-slate-500">{mStats.total} Tasks</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-extrabold text-slate-600">
                      <span>Completion Rate</span>
                      <span className="text-[#FE9F43]">{completionPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                      <div
                        className="bg-[#FE9F43] h-full transition-all duration-500"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Breakdown Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold block">To Do</span>
                      <span className="text-sm font-extrabold text-slate-700">{mStats.todo}</span>
                    </div>
                    <div className="bg-amber-50 p-2 rounded-xl border border-amber-100">
                      <span className="text-[10px] text-amber-600 uppercase font-extrabold block">Active</span>
                      <span className="text-sm font-extrabold text-amber-700">{mStats.inProgress}</span>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-emerald-600 uppercase font-extrabold block">Done</span>
                      <span className="text-sm font-extrabold text-emerald-700">{mStats.completed}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
