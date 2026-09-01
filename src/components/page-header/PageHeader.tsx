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
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3 ${className}`}>
      <div className="flex flex-col">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-[#051A2C]">
          {headerTitle}
        </h1>
        {headerDescription && (
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {headerDescription}
          </p>
        )}
      </div>

      {children && <div className="flex items-center gap-2.5">{children}</div>}
    </div>
  );
};

export default PageHeader;
