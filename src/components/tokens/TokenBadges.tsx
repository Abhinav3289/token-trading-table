import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Flame, TrendingUp, BadgeCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface BadgeProps {
  className?: string;
}

export const NewBadge = memo(({ className }: BadgeProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 text-2xs font-medium rounded',
        'bg-badge-new/20 text-badge-new',
        className
      )}>
        <Sparkles className="w-3 h-3" />
        NEW
      </span>
    </TooltipTrigger>
    <TooltipContent side="top">
      <p>New token - Listed within the last hour</p>
    </TooltipContent>
  </Tooltip>
));
NewBadge.displayName = 'NewBadge';

export const HotBadge = memo(({ className }: BadgeProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 text-2xs font-medium rounded',
        'bg-badge-hot/20 text-badge-hot',
        className
      )}>
        <Flame className="w-3 h-3" />
        HOT
      </span>
    </TooltipTrigger>
    <TooltipContent side="top">
      <p>High trading volume in the last hour</p>
    </TooltipContent>
  </Tooltip>
));
HotBadge.displayName = 'HotBadge';

export const TrendingBadge = memo(({ className }: BadgeProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 text-2xs font-medium rounded',
        'bg-primary/20 text-primary',
        className
      )}>
        <TrendingUp className="w-3 h-3" />
      </span>
    </TooltipTrigger>
    <TooltipContent side="top">
      <p>Trending - Top gainer</p>
    </TooltipContent>
  </Tooltip>
));
TrendingBadge.displayName = 'TrendingBadge';

export const VerifiedBadge = memo(({ className }: BadgeProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <BadgeCheck className={cn('w-4 h-4 text-badge-migrated', className)} />
    </TooltipTrigger>
    <TooltipContent side="top">
      <p>Verified token contract</p>
    </TooltipContent>
  </Tooltip>
));
VerifiedBadge.displayName = 'VerifiedBadge';

export const AuditedBadge = memo(({ className }: BadgeProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <ShieldCheck className={cn('w-4 h-4 text-primary', className)} />
    </TooltipTrigger>
    <TooltipContent side="top">
      <p>Contract has been audited</p>
    </TooltipContent>
  </Tooltip>
));
AuditedBadge.displayName = 'AuditedBadge';

interface TokenBadgesProps {
  isNew?: boolean;
  isHot?: boolean;
  isTrending?: boolean;
  isVerified?: boolean;
  hasAudit?: boolean;
  className?: string;
}

export const TokenBadges = memo(({
  isNew,
  isHot,
  isTrending,
  isVerified,
  hasAudit,
  className,
}: TokenBadgesProps) => {
  const hasBadges = isNew || isHot || isTrending || isVerified || hasAudit;
  
  if (!hasBadges) return null;
  
  return (
    <div className={cn('flex items-center gap-1 flex-wrap', className)}>
      {isNew && <NewBadge />}
      {isHot && <HotBadge />}
      {isTrending && <TrendingBadge />}
      {isVerified && <VerifiedBadge />}
      {hasAudit && <AuditedBadge />}
    </div>
  );
});

TokenBadges.displayName = 'TokenBadges';
