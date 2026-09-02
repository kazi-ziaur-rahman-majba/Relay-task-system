import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { PieChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface WorkflowStatusChartProps {
  statusCounts: {
    backlog: number;
    todo: number;
    in_progress: number;
    in_review: number;
    done: number;
  };
}

export const WorkflowStatusChart: React.FC<WorkflowStatusChartProps> = ({ statusCounts }) => {
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
    cutout: '48%',
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

  return (
    <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
        <PieChart className="w-4 h-4 text-[#FE9F43]" />
        <span>Workflow Status Proportions</span>
      </div>
      <div className="h-64 relative flex items-center justify-center">
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  );
};

export default WorkflowStatusChart;
