import React, { memo, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Token } from '@/types/token';
import { formatCurrency, formatNumber, formatAddress } from '@/lib/formatters';
import { PriceCell, PercentChangeCell } from './PriceCell';
import { TokenBadges } from './TokenBadges';
import { TokenProgress } from './TokenProgress';
import { TokenPopover } from './TokenPopover';
import { TokenModal } from './TokenModal';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Copy, ExternalLink, MoreHorizontal, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface TokenRowProps {
  token: Token;
  showProgress?: boolean;
  onTokenClick?: (token: Token) => void;
}

export const TokenRow = memo(({ token, showProgress = true, onTokenClick }: TokenRowProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleCopyAddress = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(token.address);
    toast.success('Address copied');
  }, [token.address]);
  
  const handleRowClick = useCallback(() => {
    onTokenClick?.(token);
    setIsModalOpen(true);
  }, [token, onTokenClick]);
  
  return (
    <>
      <tr 
        className={cn(
          'border-b border-table-border cursor-pointer',
          'hover:bg-table-hover transition-colors duration-100',
          'row-glow'
        )}
        onClick={handleRowClick}
      >
        {/* Token Info */}
        <td className="p-3">
          <TokenPopover token={token}>
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={token.imageUrl} 
                alt={token.symbol}
                className="w-8 h-8 rounded-full bg-muted flex-shrink-0"
                loading="lazy"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground truncate">
                    {token.symbol}
                  </span>
                  <TokenBadges
                    isNew={token.isNew}
                    isHot={token.isHot}
                    isTrending={token.isTrending}
                    isVerified={token.isVerified}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                    {token.name}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className="text-2xs text-muted-foreground hover:text-foreground font-mono"
                        onClick={handleCopyAddress}
                      >
                        {formatAddress(token.address, 3, 3)}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Click to copy: {token.address}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </TokenPopover>
        </td>
        
        {/* Age */}
        <td className="p-3">
          <span className="text-sm text-muted-foreground tabular-nums">
            {token.age}
          </span>
        </td>
        
        {/* Price */}
        <td className="p-3 text-right">
          <PriceCell 
            price={token.price} 
            priceDirection={token.priceDirection}
          />
        </td>
        
        {/* 1m Change */}
        <td className="p-3 text-right">
          <PercentChangeCell value={token.priceChange1m} />
        </td>
        
        {/* 5m Change */}
        <td className="p-3 text-right">
          <PercentChangeCell value={token.priceChange5m} />
        </td>
        
        {/* 1h Change */}
        <td className="p-3 text-right">
          <PercentChangeCell value={token.priceChange1h} />
        </td>
        
        {/* Volume */}
        <td className="p-3 text-right">
          <span className="text-sm tabular-nums">
            {formatCurrency(token.volume24h)}
          </span>
        </td>
        
        {/* Liquidity */}
        <td className="p-3 text-right">
          <span className="text-sm tabular-nums">
            {formatCurrency(token.liquidity)}
          </span>
        </td>
        
        {/* Market Cap */}
        <td className="p-3 text-right">
          <span className="text-sm tabular-nums">
            {formatCurrency(token.marketCap)}
          </span>
        </td>
        
        {/* Holders */}
        <td className="p-3 text-right">
          <span className="text-sm text-muted-foreground tabular-nums">
            {formatNumber(token.metrics.holders)}
          </span>
        </td>
        
        {/* Transactions */}
        <td className="p-3 text-right">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm text-muted-foreground tabular-nums cursor-help">
                {formatNumber(token.metrics.txCount)}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <div className="text-xs space-y-1">
                <p className="text-price-up">Buys: {formatNumber(token.metrics.buyCount)}</p>
                <p className="text-price-down">Sells: {formatNumber(token.metrics.sellCount)}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </td>
        
        {/* Progress */}
        {showProgress && (
          <td className="p-3">
            {token.bondingProgress !== undefined && (
              <TokenProgress progress={token.bondingProgress} />
            )}
          </td>
        )}
        
        {/* Actions */}
        <td className="p-3">
          <div className="flex items-center justify-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Details</TooltipContent>
            </Tooltip>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={handleCopyAddress}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Address
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Explorer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-primary">
                  Trade Now
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </td>
      </tr>
      
      <TokenModal 
        token={token} 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
});

TokenRow.displayName = 'TokenRow';
