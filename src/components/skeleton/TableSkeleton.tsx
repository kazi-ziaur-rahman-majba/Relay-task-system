import { Skeleton } from './Skeleton';

interface TableSkeletonProps {
  rowsCount?: number;
}

export function TableSkeleton({ rowsCount = 8 }: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Desktop Table View Skeleton */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-20">ID</th>
                <th className="py-3.5 px-4 w-[320px]">Task Title</th>
                <th className="py-3.5 px-4 w-44">Owner</th>
                <th className="py-3.5 px-4 w-32">Priority</th>
                <th className="py-3.5 px-4 w-36">Due Date</th>
                <th className="py-3.5 px-4 w-36">Status</th>
                <th className="py-3.5 px-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: rowsCount }).map((_, i) => (
                <tr key={i} className="bg-white">
                  {/* ID */}
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-4 w-14 rounded-md" />
                  </td>

                  {/* Title */}
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-4 w-60 rounded-md" />
                  </td>

                  {/* Owner */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Skeleton variant="circular" className="w-6 h-6" />
                      <Skeleton className="h-3.5 w-24 rounded-md" />
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-6 w-18 rounded-lg" />
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-6 w-24 rounded-lg" />
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-6 w-24 rounded-lg" />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="w-7 h-7 rounded-lg" />
                      <Skeleton className="w-7 h-7 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List Skeleton */}
      <div className="md:hidden space-y-3">
        {Array.from({ length: Math.min(rowsCount, 5) }).map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Skeleton variant="circular" className="w-6 h-6" />
                <Skeleton className="h-3.5 w-20" />
              </div>
              <Skeleton className="h-5 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
