import React from 'react';

interface PageHeaderProps {
  headerTitle: string;
  headerDescription?: string;
  children?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  headerTitle,
  headerDescription,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div className="flex flex-col min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-[#051A2C] truncate">
            {headerTitle}
          </h1>

          {/* Mobile Side-by-side CTA Button */}
          {children && <div className="flex sm:hidden items-center shrink-0">{children}</div>}
        </div>

        {headerDescription && (
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {headerDescription}
          </p>
        )}
      </div>

      {/* Desktop CTA Button */}
      {children && <div className="hidden sm:flex items-center gap-2.5 shrink-0">{children}</div>}
    </div>
  );
};

export default PageHeader;
