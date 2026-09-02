import { Skeleton } from './Skeleton';

export function AnalyticsPanelSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      </div>

      {/* Visual Charts Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {/* Doughnut Chart Card Skeleton */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-md" />
            <Skeleton className="h-3.5 w-40" />
          </div>
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Skeleton variant="circular" className="w-40 h-40" />
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-3 w-12 rounded-md" />
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart Card Skeleton */}
        <div className="bg-[#FAFBFD] p-4 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-md" />
            <Skeleton className="h-3.5 w-36" />
          </div>
          <div className="h-64 flex items-end justify-center gap-6 pb-6 pt-8">
            <Skeleton className="w-12 h-44 rounded-t-lg" />
            <Skeleton className="w-12 h-32 rounded-t-lg" />
            <Skeleton className="w-12 h-24 rounded-t-lg" />
            <Skeleton className="w-12 h-16 rounded-t-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
