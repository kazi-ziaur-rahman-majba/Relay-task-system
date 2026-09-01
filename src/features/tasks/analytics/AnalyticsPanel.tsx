import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Task } from '@/types/task';
import { PieChart, BarChart2 } from 'lucide-react';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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

  // Thicker, chunkier Doughnut Chart with rounded corners and spacing gap
  const doughnutData = {
    labels: ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'],
    datasets: [
      {
        data: [
          statusCounts.backlog,
          statusCounts.todo,
          statusCounts.in_progress,
          statusCounts.in_review,
          statusCounts.done,
        ],
        backgroundColor: [
          '#092C4C', // Deep Navy
          '#00B4D8', // Bright Cyan Blue
          '#10B981', // Vivid Emerald Green
          '#FE9F43', // Brand Orange/Amber
          '#8B5CF6', // Purple
        ],
        borderWidth: 3,
        borderColor: '#FFFFFF',
        borderRadius: 10,
        spacing: 5,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '48%', // Thicker ring width (52% thickness)
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { family: 'sans-serif', size: 11, weight: 700 },
          color: '#334155',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
        },
      },
    },
  };

  // Priority Bar Chart Configuration
  const barData = {
    labels: ['Urgent', 'High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Task Count',
        data: [
          priorityCounts.urgent,
          priorityCounts.high,
          priorityCounts.medium,
          priorityCounts.low,
        ],
        backgroundColor: [
          '#092C4C', // Urgent - Deep Navy
          '#FE9F43', // High - Brand Amber
          '#8B5CF6', // Medium - Purple
          '#0F9384', // Low - Teal
        ],
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { family: 'sans-serif', size: 11, weight: 700 },
          color: '#334155',
        },
      },
    },
  };

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
        {/* Doughnut Chart Card */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
            <PieChart className="w-4 h-4 text-[#FE9F43]" />
            <span>Workflow Status Proportions</span>
          </div>
          <div className="h-64 relative flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="bg-[#FAFBFD] p-4 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
            <BarChart2 className="w-4 h-4 text-[#155EEF]" />
            <span>Priority Level Breakdown</span>
          </div>
          <div className="h-64 relative flex items-center justify-center">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
