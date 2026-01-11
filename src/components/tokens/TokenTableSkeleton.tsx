import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonRowProps {
  delay?: number;
}

const SkeletonCell = memo(({ width = 'w-16', className }: { width?: string; className?: string }) => (
  <div className={cn('h-4 rounded shimmer', width, className)} />
));
SkeletonCell.displayName = 'SkeletonCell';

const SkeletonRow = memo(({ delay = 0 }: SkeletonRowProps) => (
  <tr 
    className="border-b border-table-border animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Token Info */}
    <td className="p-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full shimmer" />
        <div className="space-y-1.5">
          <SkeletonCell width="w-20" />
          <SkeletonCell width="w-14" className="h-3" />
        </div>
      </div>
    </td>
    
    {/* Age */}
    <td className="p-3">
      <SkeletonCell width="w-12" />
    </td>
    
    {/* Price */}
    <td className="p-3">
      <SkeletonCell width="w-24" />
    </td>
    
    {/* 1m Change */}
    <td className="p-3">
      <SkeletonCell width="w-16" />
    </td>
    
    {/* 5m Change */}
    <td className="p-3">
      <SkeletonCell width="w-16" />
    </td>
    
    {/* 1h Change */}
    <td className="p-3">
      <SkeletonCell width="w-16" />
    </td>
    
    {/* Volume */}
    <td className="p-3">
      <SkeletonCell width="w-20" />
    </td>
    
    {/* Liquidity */}
    <td className="p-3">
      <SkeletonCell width="w-20" />
    </td>
    
    {/* Market Cap */}
    <td className="p-3">
      <SkeletonCell width="w-20" />
    </td>
    
    {/* Holders */}
    <td className="p-3">
      <SkeletonCell width="w-14" />
    </td>
    
    {/* Txns */}
    <td className="p-3">
      <SkeletonCell width="w-14" />
    </td>
    
    {/* Progress (for new pairs) */}
    <td className="p-3">
      <div className="w-24 h-2 rounded-full shimmer" />
    </td>
    
    {/* Actions */}
    <td className="p-3">
      <div className="flex gap-2">
        <div className="w-6 h-6 rounded shimmer" />
        <div className="w-6 h-6 rounded shimmer" />
      </div>
    </td>
  </tr>
));
SkeletonRow.displayName = 'SkeletonRow';

interface TokenTableSkeletonProps {
  rows?: number;
}

export const TokenTableSkeleton = memo(({ rows = 10 }: TokenTableSkeletonProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead className="bg-table-header sticky top-0 z-10">
          <tr className="border-b border-table-border">
            <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Token</th>
            <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Age</th>
            <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
            <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">1m</th>
            <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">5m</th>
            <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">1h</th>
            <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Volume</th>
            <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Liq</th>
            <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">MCap</th>
            <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Holders</th>
            <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Txns</th>
            <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Progress</th>
            <th className="p-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonRow key={index} delay={index * 50} />
          ))}
        </tbody>
      </table>
    </div>
  );
});

TokenTableSkeleton.displayName = 'TokenTableSkeleton';
