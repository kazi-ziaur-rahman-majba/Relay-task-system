import { StatCardsSkeleton } from './StatCardsSkeleton';
import { AnalyticsPanelSkeleton } from './AnalyticsPanelSkeleton';
import { RecentActivitySkeleton } from './RecentActivitySkeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-6 animate-fade-in">
      {/* 4 Top Metric Cards Skeleton */}
      <StatCardsSkeleton />

      {/* Analytics Charts Panel Skeleton */}
      <AnalyticsPanelSkeleton />

      {/* Side-by-side Recent Tasks & Horizontal Chart Skeleton */}
      <RecentActivitySkeleton />
    </div>
  );
}
