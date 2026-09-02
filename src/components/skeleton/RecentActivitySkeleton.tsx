import { Skeleton } from './Skeleton';

export function RecentActivitySkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">
      {/* Left: Recent Tasks Skeleton */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          <Skeleton className="h-7 w-20 rounded-xl" />
        </div>

        {/* 5 Row Skeletons */}
        <div className="space-y-1.5 flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/40 flex items-center justify-between gap-2.5"
            >
              {/* Left ID & Title */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="hidden sm:block h-4 w-48 md:w-60" />
              </div>
              {/* Right Due Date */}
              <Skeleton className="h-5 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Right: Thin Horizontal Bar Chart Skeleton */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-52" />
            </div>
          </div>
          <Skeleton className="h-7 w-20 rounded-xl" />
        </div>

        {/* 12 Horizontal Bar Skeletons */}
        <div className="h-[270px] sm:h-[280px] flex flex-col justify-around py-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-3 w-16 shrink-0" />
              <div className="flex-1 flex items-center gap-2">
                <Skeleton
                  className="h-2 rounded-full"
                  style={{ width: `${Math.max(15, 100 - i * 7.5)}%` }}
                />
                <Skeleton className="h-3 w-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
