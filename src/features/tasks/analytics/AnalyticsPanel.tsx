import React, { useMemo } from 'react';
import { Task } from '@/types/task';
import WorkflowStatusChart from '@/components/chart/WorkflowStatusChart';
import PriorityBreakdownChart from '@/components/chart/PriorityBreakdownChart';

interface AnalyticsPanelProps {
  tasks: Task[];
  onClose?: () => void;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ tasks }) => {
  const statusCounts = useMemo(() => {
    const counts = {
      backlog: 0,
      todo: 0,
      in_progress: 0,
      in_review: 0,
      done: 0,
    };

    tasks.forEach((t) => {
      if (counts[t.status] !== undefined) {
        counts[t.status]++;
      }
    });

    return counts;
  }, [tasks]);

  const priorityCounts = useMemo(() => {
    const counts = {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    tasks.forEach((t) => {
      if (counts[t.priority] !== undefined) {
        counts[t.priority]++;
      }
    });

    return counts;
  }, [tasks]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#FE9F43] flex items-center justify-center font-bold">
            📊
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 leading-none">
              Workload Visual Analytics
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Real-time distribution of workflow statuses and priority levels across {tasks.length} tasks.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {/* Workflow Status Doughnut Chart Component */}
        <WorkflowStatusChart statusCounts={statusCounts} />

        {/* Priority Breakdown Bar Chart Component */}
        <PriorityBreakdownChart priorityCounts={priorityCounts} />
      </div>
    </div>
  );
};
