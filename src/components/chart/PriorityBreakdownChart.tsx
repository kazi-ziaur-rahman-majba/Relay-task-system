import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BarChart2 } from 'lucide-react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface PriorityBreakdownChartProps {
  priorityCounts: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
}

export const PriorityBreakdownChart: React.FC<PriorityBreakdownChartProps> = ({ priorityCounts }) => {
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
    <div className="bg-[#FAFBFD] p-4 rounded-xl border border-slate-200/80 space-y-3">
      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
        <BarChart2 className="w-4 h-4 text-[#155EEF]" />
        <span>Priority Level Breakdown</span>
      </div>
      <div className="h-64 relative flex items-center justify-center">
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default PriorityBreakdownChart;
