import { Skeleton } from './Skeleton';

interface TeamGridSkeletonProps {
  count?: number;
}

export function TeamGridSkeleton({ count = 6 }: TeamGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4"
        >
          {/* User Profile Header */}
          <div className="flex items-center gap-3.5">
            <Skeleton variant="circular" className="w-12 h-12 shrink-0" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-3 w-40 rounded-md" />
            </div>
          </div>

          {/* Role Badge */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <Skeleton className="h-6 w-28 rounded-lg" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-3 w-8 rounded-md" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full" />
          </div>

          {/* Breakdown Stats 3 Pills */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center">
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
