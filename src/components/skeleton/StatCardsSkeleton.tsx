import { Skeleton } from './Skeleton';

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="py-3 px-3.5 sm:py-5 sm:px-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3 min-h-[72px] sm:min-h-[102px]"
        >
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
            {/* Icon square */}
            <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shrink-0" />
            {/* Label and Big Number */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton className="h-3 w-16 sm:w-20" />
              <Skeleton className="h-6 sm:h-7 w-10 sm:w-12" />
            </div>
          </div>
          {/* Badge */}
          <Skeleton className="h-6 w-14 sm:w-16 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}
