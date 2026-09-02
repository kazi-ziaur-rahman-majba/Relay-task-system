import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Value labels plugin to render numbers next to thin bars
const valueLabels = {
  id: "horizontalValueLabels",
  afterDatasetsDraw(chart: any) {
    const dataset = chart?.data?.datasets?.[0];
    if (!dataset) return;

    const { ctx, chartArea } = chart;
    const meta = chart.getDatasetMeta(0);
    ctx.save();
    ctx.font = "600 11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#051A2C";

    meta.data.forEach((bar: any, i: number) => {
      const v = dataset.data[i];
      if (v == null) return;
      const x = Math.min(bar.x + 8, chartArea.right - 24);
      const y = bar.y + 4;
      ctx.fillText(`${v}`, x, y);
    });

    ctx.restore();
  },
};

interface HorizontalChartProps {
  labels: string[];
  data: number[];
  title?: string;
  subtitle?: string;
  barColor?: string;
}

export default function HorizontalChart({
  labels,
  data: values,
  title = "Assigned Tasks by Member",
  subtitle = "Current task workload distribution across team members",
  barColor = "#FE9F43",
}: HorizontalChartProps) {
  const maxValue = Math.max(...values, 10);
  const suggestedMax = Math.ceil(maxValue * 1.18);

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Assigned Tasks",
          data: values,
          backgroundColor: barColor,
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 8,
          maxBarThickness: 9,
        },
      ],
    }),
    [labels, values, barColor]
  );

  const options = useMemo(
    () => ({
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 2,
          right: 24,
          bottom: 2,
          left: 0,
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: "#051A2C",
          titleFont: { size: 12, weight: "bold" as const },
          bodyFont: { size: 11 },
          padding: 8,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: (item: any) => `${item.raw} assigned tasks`,
          },
        },
      },
      scales: {
        x: {
          display: false,
          grid: { display: false, drawBorder: false },
          min: 0,
          suggestedMax,
        },
        y: {
          grid: { display: false, drawBorder: false },
          ticks: {
            color: "#475569",
            font: {
              size: 10,
              weight: "normal" as const,
            },
            padding: 4,
          },
        },
      },
    }),
    [suggestedMax]
  );

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#FE9F43] flex items-center justify-center font-bold shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              {title}
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        <Link
          to="/team"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#FE9F43] hover:text-[#FF6E22] bg-amber-50 hover:bg-amber-100/80 rounded-xl transition-colors shrink-0"
        >
          <span>View Team</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Thin Horizontal Bar Chart Container */}
      <div className="relative w-full h-[270px] sm:h-[280px] pt-1">
        {values.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
            No member workload data available.
          </div>
        ) : (
          <Bar data={chartData} options={options} plugins={[valueLabels]} />
        )}
      </div>
    </div>
  );
}

