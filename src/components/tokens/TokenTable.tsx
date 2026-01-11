import React, { memo, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Token, TokenCategory, TokenFilters } from '@/types/token';
import { useTokenData } from '@/hooks/useTokenData';
import { TokenTableHeader } from './TokenTableHeader';
import { TokenRow } from './TokenRow';
import { TokenTableSkeleton } from './TokenTableSkeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, Filter, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TokenTableProps {
  category: TokenCategory;
  showProgress?: boolean;
}

export const TokenTable = memo(({ category, showProgress = true }: TokenTableProps) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<TokenFilters>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { 
    tokens, 
    isLoading, 
    isError, 
    refetch,
    sortConfig,
    handleSort,
    totalCount,
    filteredCount,
  } = useTokenData({ 
    category,
    filters: { ...filters, search },
  });
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);
  
  const clearFilters = useCallback(() => {
    setFilters({});
    setSearch('');
  }, []);
  
  const hasActiveFilters = search || Object.keys(filters).length > 0;
  
  if (isError) {
    return (
      <ErrorState onRetry={refetch} />
    );
  }
  
  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-4 px-1">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tokens..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9 bg-muted/50 border-table-border"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className={cn(
                  'border-table-border',
                  hasActiveFilters && 'border-primary text-primary'
                )}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <FilterPanel 
                filters={filters}
                onChange={setFilters}
                onClear={clearFilters}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredCount !== totalCount 
              ? `${filteredCount} of ${totalCount}`
              : totalCount
            } tokens
          </span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={cn(
              'w-4 h-4',
              isLoading && 'animate-spin'
            )} />
          </Button>
        </div>
      </div>
      
      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg border border-table-border bg-card">
        {isLoading ? (
          <TokenTableSkeleton rows={10} />
        ) : tokens.length === 0 ? (
          <EmptyState 
            hasFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        ) : (
          <table className="w-full">
            <TokenTableHeader 
              sortConfig={sortConfig}
              onSort={handleSort}
              showProgress={showProgress}
            />
            <tbody>
              {tokens.map((token) => (
                <TokenRow 
                  key={token.id} 
                  token={token}
                  showProgress={showProgress}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
});

TokenTable.displayName = 'TokenTable';

// Filter Panel Component
interface FilterPanelProps {
  filters: TokenFilters;
  onChange: (filters: TokenFilters) => void;
  onClear: () => void;
}

const FilterPanel = memo(({ filters, onChange, onClear }: FilterPanelProps) => {
  const handleMinLiquidityChange = (value: number[]) => {
    onChange({ ...filters, minLiquidity: value[0] * 1000 });
  };
  
  const handleMinVolumeChange = (value: number[]) => {
    onChange({ ...filters, minVolume: value[0] * 1000 });
  };
  
  const handleVerifiedChange = (checked: boolean) => {
    onChange({ ...filters, showVerifiedOnly: checked });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Filters</h4>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear all
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm">
            Min Liquidity: ${((filters.minLiquidity || 0) / 1000).toFixed(0)}K
          </Label>
          <Slider
            value={[(filters.minLiquidity || 0) / 1000]}
            onValueChange={handleMinLiquidityChange}
            max={500}
            step={10}
            className="py-2"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm">
            Min Volume: ${((filters.minVolume || 0) / 1000).toFixed(0)}K
          </Label>
          <Slider
            value={[(filters.minVolume || 0) / 1000]}
            onValueChange={handleMinVolumeChange}
            max={1000}
            step={25}
            className="py-2"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="verified-only" className="text-sm">
            Verified tokens only
          </Label>
          <Switch
            id="verified-only"
            checked={filters.showVerifiedOnly || false}
            onCheckedChange={handleVerifiedChange}
          />
        </div>
      </div>
    </div>
  );
});

FilterPanel.displayName = 'FilterPanel';

// Empty State Component
interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

const EmptyState = memo(({ hasFilters, onClearFilters }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
      <Search className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-medium mb-2">No tokens found</h3>
    <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
      {hasFilters 
        ? 'No tokens match your current filters. Try adjusting or clearing them.'
        : 'No tokens available in this category yet.'}
    </p>
    {hasFilters && (
      <Button variant="outline" onClick={onClearFilters}>
        Clear filters
      </Button>
    )}
  </div>
));

EmptyState.displayName = 'EmptyState';

// Error State Component
interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState = memo(({ onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-lg border border-table-border">
    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
      <X className="w-8 h-8 text-destructive" />
    </div>
    <h3 className="text-lg font-medium mb-2">Failed to load tokens</h3>
    <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
      Something went wrong while fetching the token data. Please try again.
    </p>
    <Button onClick={onRetry}>
      <RefreshCw className="w-4 h-4 mr-2" />
      Retry
    </Button>
  </div>
));

ErrorState.displayName = 'ErrorState';
