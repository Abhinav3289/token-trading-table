import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TokenProgressProps {
  progress: number;
  className?: string;
}

export const TokenProgress = memo(({ progress, className }: TokenProgressProps) => {
  const isFinalStretch = progress >= 80;
  const isComplete = progress >= 100;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn('flex items-center gap-2 min-w-[100px]', className)}>
          <div className="flex-1 relative">
            <Progress 
              value={Math.min(progress, 100)} 
              className={cn(
                'h-2 bg-muted',
                isComplete && 'opacity-80'
              )}
            />
            {/* Gradient overlay for progress bar */}
            <div 
              className={cn(
                'absolute inset-0 h-2 rounded-full overflow-hidden',
                'pointer-events-none'
              )}
            >
              <div 
                className={cn(
                  'h-full transition-all duration-300',
                  isFinalStretch 
                    ? 'bg-gradient-to-r from-badge-hot/80 to-badge-hot' 
                    : 'bg-gradient-to-r from-primary/80 to-primary',
                  isComplete && 'bg-gradient-to-r from-badge-migrated/80 to-badge-migrated'
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
          <span className={cn(
            'text-xs font-mono tabular-nums min-w-[40px] text-right',
            isComplete ? 'text-badge-migrated' : 
            isFinalStretch ? 'text-badge-hot' : 
            'text-muted-foreground'
          )}>
            {progress.toFixed(1)}%
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[200px]">
        <p className="font-medium">Bonding Progress</p>
        <p className="text-xs text-muted-foreground">
          {isComplete 
            ? 'Token has migrated to DEX'
            : isFinalStretch 
              ? 'Final stretch! Almost ready to migrate'
              : 'Accumulating liquidity for DEX migration'}
        </p>
      </TooltipContent>
    </Tooltip>
  );
});

TokenProgress.displayName = 'TokenProgress';
