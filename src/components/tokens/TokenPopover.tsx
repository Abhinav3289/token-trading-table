import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Token } from '@/types/token';
import { formatCurrency, formatNumber, formatPercent, formatAddress } from '@/lib/formatters';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Copy, ExternalLink, Users, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { TokenBadges } from './TokenBadges';
import { TokenSocialLinks } from './TokenSocials';
import { toast } from 'sonner';

interface TokenPopoverProps {
  token: Token;
  children: React.ReactNode;
}

export const TokenPopover = memo(({ token, children }: TokenPopoverProps) => {
  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(token.address);
    toast.success('Address copied to clipboard');
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-popover border-border"
        side="right"
        align="start"
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-start gap-3">
            <img 
              src={token.imageUrl} 
              alt={token.symbol}
              className="w-12 h-12 rounded-full bg-muted"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground truncate">
                  {token.name}
                </h4>
                <TokenBadges 
                  isVerified={token.isVerified}
                  hasAudit={token.hasAudit}
                />
              </div>
              <p className="text-sm text-muted-foreground">{token.symbol}</p>
              <div className="flex items-center gap-1 mt-1">
                <code className="text-xs text-muted-foreground font-mono">
                  {formatAddress(token.address, 6, 4)}
                </code>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5"
                  onClick={handleCopyAddress}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          
          <TokenBadges
            isNew={token.isNew}
            isHot={token.isHot}
            isTrending={token.isTrending}
            className="mt-3"
          />
        </div>
        
        {/* Metrics Grid */}
        <div className="p-4 grid grid-cols-2 gap-3">
          <MetricItem 
            label="Market Cap" 
            value={formatCurrency(token.marketCap)} 
          />
          <MetricItem 
            label="Liquidity" 
            value={formatCurrency(token.liquidity)} 
          />
          <MetricItem 
            label="24h Volume" 
            value={formatCurrency(token.volume24h)} 
          />
          <MetricItem 
            label="FDV" 
            value={formatCurrency(token.fdv)} 
          />
        </div>
        
        <Separator />
        
        {/* Holder Stats */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Holders:</span>
            <span className="font-medium">{formatNumber(token.metrics.holders)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Transactions:</span>
            <span className="font-medium">{formatNumber(token.metrics.txCount)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-price-up" />
              <span className="text-muted-foreground">Buys:</span>
              <span className="text-price-up">{formatNumber(token.metrics.buyCount)}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-price-down" />
              <span className="text-muted-foreground">Sells:</span>
              <span className="text-price-down">{formatNumber(token.metrics.sellCount)}</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Risk Metrics */}
        <div className="p-4 space-y-2">
          <RiskItem 
            label="Top Holder" 
            value={`${token.metrics.topHolderPercent.toFixed(1)}%`}
            risk={token.metrics.topHolderPercent > 20 ? 'high' : token.metrics.topHolderPercent > 10 ? 'medium' : 'low'}
          />
          <RiskItem 
            label="Dev Holding" 
            value={`${token.metrics.devHolding.toFixed(1)}%`}
            risk={token.metrics.devHolding > 5 ? 'high' : token.metrics.devHolding > 2 ? 'medium' : 'low'}
          />
          <RiskItem 
            label="Insiders" 
            value={`${token.metrics.insiderPercent.toFixed(1)}%`}
            risk={token.metrics.insiderPercent > 15 ? 'high' : token.metrics.insiderPercent > 8 ? 'medium' : 'low'}
          />
        </div>
        
        <Separator />
        
        {/* Footer */}
        <div className="p-4 flex items-center justify-between">
          <TokenSocialLinks socials={token.socials} />
          <Button size="sm" className="gap-1">
            <ExternalLink className="w-3.5 h-3.5" />
            Trade
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
});

TokenPopover.displayName = 'TokenPopover';

const MetricItem = memo(({ label, value }: { label: string; value: string }) => (
  <div className="space-y-0.5">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-medium tabular-nums">{value}</p>
  </div>
));
MetricItem.displayName = 'MetricItem';

const RiskItem = memo(({ 
  label, 
  value, 
  risk 
}: { 
  label: string; 
  value: string; 
  risk: 'low' | 'medium' | 'high' 
}) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className={cn(
      'font-mono tabular-nums',
      risk === 'low' && 'text-price-up',
      risk === 'medium' && 'text-warning',
      risk === 'high' && 'text-price-down'
    )}>
      {value}
    </span>
  </div>
));
RiskItem.displayName = 'RiskItem';
