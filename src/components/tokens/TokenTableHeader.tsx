import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { SortConfig } from '@/types/token';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ColumnConfig {
  key: string;
  label: string;
  shortLabel?: string;
  sortable: boolean;
  align?: 'left' | 'center' | 'right';
  tooltip?: string;
  width?: string;
  hideOnMobile?: boolean;
}

const columns: ColumnConfig[] = [
  { key: 'symbol', label: 'Token', sortable: true, align: 'left', width: 'min-w-[180px]' },
  { key: 'createdAt', label: 'Age', sortable: true, align: 'left', width: 'w-16' },
  { key: 'price', label: 'Price', sortable: true, align: 'right', width: 'w-28' },
  { key: 'priceChange1m', label: '1m', shortLabel: '1m', sortable: true, align: 'right', tooltip: '1 minute change', width: 'w-20' },
  { key: 'priceChange5m', label: '5m', shortLabel: '5m', sortable: true, align: 'right', tooltip: '5 minute change', width: 'w-20', hideOnMobile: true },
  { key: 'priceChange1h', label: '1h', shortLabel: '1h', sortable: true, align: 'right', tooltip: '1 hour change', width: 'w-20', hideOnMobile: true },
  { key: 'volume24h', label: 'Volume', sortable: true, align: 'right', tooltip: '24h trading volume', width: 'w-24' },
  { key: 'liquidity', label: 'Liq', sortable: true, align: 'right', tooltip: 'Liquidity', width: 'w-24', hideOnMobile: true },
  { key: 'marketCap', label: 'MCap', sortable: true, align: 'right', tooltip: 'Market Cap', width: 'w-24' },
  { key: 'holders', label: 'Holders', sortable: true, align: 'right', width: 'w-20', hideOnMobile: true },
  { key: 'txCount', label: 'Txns', sortable: true, align: 'right', tooltip: 'Total transactions', width: 'w-20', hideOnMobile: true },
];

interface TokenTableHeaderProps {
  sortConfig: SortConfig;
  onSort: (column: string) => void;
  showProgress?: boolean;
}

export const TokenTableHeader = memo(({ 
  sortConfig, 
  onSort,
  showProgress = true 
}: TokenTableHeaderProps) => {
  return (
    <thead className="bg-table-header sticky top-0 z-10">
      <tr className="border-b border-table-border">
        {columns.map((column) => (
          <HeaderCell
            key={column.key}
            column={column}
            isActive={sortConfig.column === column.key}
            direction={sortConfig.column === column.key ? sortConfig.direction : undefined}
            onSort={onSort}
          />
        ))}
        {showProgress && (
          <th className={cn(
            'p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider',
            'hidden lg:table-cell'
          )}>
            Progress
          </th>
        )}
        <th className="p-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-20">
          Actions
        </th>
      </tr>
    </thead>
  );
});

TokenTableHeader.displayName = 'TokenTableHeader';

interface HeaderCellProps {
  column: ColumnConfig;
  isActive: boolean;
  direction?: 'asc' | 'desc';
  onSort: (column: string) => void;
}

const HeaderCell = memo(({ column, isActive, direction, onSort }: HeaderCellProps) => {
  const content = (
    <th
      className={cn(
        'p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider',
        column.align === 'right' && 'text-right',
        column.align === 'center' && 'text-center',
        column.width,
        column.hideOnMobile && 'hidden md:table-cell',
        column.sortable && 'cursor-pointer hover:text-foreground transition-colors select-none'
      )}
      onClick={() => column.sortable && onSort(column.key)}
    >
      <div className={cn(
        'inline-flex items-center gap-1',
        column.align === 'right' && 'flex-row-reverse'
      )}>
        <span>{column.shortLabel || column.label}</span>
        {column.sortable && (
          <SortIndicator isActive={isActive} direction={direction} />
        )}
      </div>
    </th>
  );
  
  if (column.tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{column.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
  
  return content;
});

HeaderCell.displayName = 'HeaderCell';

interface SortIndicatorProps {
  isActive: boolean;
  direction?: 'asc' | 'desc';
}

const SortIndicator = memo(({ isActive, direction }: SortIndicatorProps) => {
  if (!isActive) {
    return <ChevronsUpDown className="w-3 h-3 opacity-40" />;
  }
  
  return direction === 'asc' 
    ? <ChevronUp className="w-3 h-3" />
    : <ChevronDown className="w-3 h-3" />;
});

SortIndicator.displayName = 'SortIndicator';
