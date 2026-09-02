import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'rectangular' | 'rounded' | 'circular';
}

export function Skeleton({
  className = '',
  variant = 'rounded',
  ...props
}: SkeletonProps) {
  const variantClass =
    variant === 'circular'
      ? 'rounded-full'
      : variant === 'rounded'
      ? 'rounded-xl'
      : 'rounded-none';

  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${variantClass} ${className}`}
      {...props}
    />
  );
}
