import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Token } from '@/types/token';
import { formatPrice, formatCurrency, formatNumber, formatPercent, formatAddress } from '@/lib/formatters';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy, 
  ExternalLink, 
  Users, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Wallet,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { TokenBadges } from './TokenBadges';
import { TokenSocialLinks } from './TokenSocials';
import { TokenProgress } from './TokenProgress';
import { PercentChangeCell } from './PriceCell';
import { toast } from 'sonner';

interface TokenModalProps {
  token: Token | null;
  open: boolean;
  onClose: () => void;
}

export const TokenModal = memo(({ token, open, onClose }: TokenModalProps) => {
  if (!token) return null;
  
  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(token.address);
    toast.success('Address copied to clipboard');
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-card">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start gap-4">
            <img 
              src={token.imageUrl} 
              alt={token.symbol}
              className="w-16 h-16 rounded-full bg-muted"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-xl">{token.name}</DialogTitle>
                <TokenBadges 
                  isVerified={token.isVerified}
                  hasAudit={token.hasAudit}
                />
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-lg text-muted-foreground">{token.symbol}</span>
                <TokenBadges
                  isNew={token.isNew}
                  isHot={token.isHot}
                  isTrending={token.isTrending}
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <code className="text-sm text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                  {formatAddress(token.address, 8, 6)}
                </code>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={handleCopyAddress}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold tabular-nums">{formatPrice(token.price)}</p>
              <PercentChangeCell value={token.priceChange24h} className="text-base" />
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-6">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              {/* Price Changes */}
              <div className="grid grid-cols-4 gap-4">
                <PriceChangeCard label="1m" value={token.priceChange1m} />
                <PriceChangeCard label="5m" value={token.priceChange5m} />
                <PriceChangeCard label="1h" value={token.priceChange1h} />
                <PriceChangeCard label="24h" value={token.priceChange24h} />
              </div>
              
              <Separator />
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard icon={Wallet} label="Market Cap" value={formatCurrency(token.marketCap)} />
                <MetricCard icon={BarChart3} label="Liquidity" value={formatCurrency(token.liquidity)} />
                <MetricCard icon={TrendingUp} label="24h Volume" value={formatCurrency(token.volume24h)} />
                <MetricCard icon={Clock} label="Age" value={token.age} />
              </div>
              
              {/* Bonding Progress */}
              {token.bondingProgress !== undefined && token.bondingProgress < 100 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Bonding Progress</h4>
                    <TokenProgress progress={token.bondingProgress} />
                  </div>
                </>
              )}
              
              <Separator />
              
              {/* Socials & Actions */}
              <div className="flex items-center justify-between">
                <TokenSocialLinks socials={token.socials} />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Explorer
                  </Button>
                  <Button size="sm" className="gap-1">
                    Trade Now
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  icon={Users}
                  label="Total Holders"
                  value={formatNumber(token.metrics.holders)}
                />
                <StatCard 
                  icon={BarChart3}
                  label="Total Transactions"
                  value={formatNumber(token.metrics.txCount)}
                />
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">Transaction Breakdown</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-price-up" />
                    <div>
                      <p className="text-xs text-muted-foreground">Buy Transactions</p>
                      <p className="text-lg font-semibold text-price-up tabular-nums">
                        {formatNumber(token.metrics.buyCount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-price-down" />
                    <div>
                      <p className="text-xs text-muted-foreground">Sell Transactions</p>
                      <p className="text-lg font-semibold text-price-down tabular-nums">
                        {formatNumber(token.metrics.sellCount)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Buy/Sell Ratio Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Buy/Sell Ratio</span>
                    <span>{(token.metrics.buyCount / token.metrics.sellCount).toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                    <div 
                      className="bg-price-up h-full"
                      style={{ 
                        width: `${(token.metrics.buyCount / (token.metrics.buyCount + token.metrics.sellCount)) * 100}%` 
                      }}
                    />
                    <div 
                      className="bg-price-down h-full"
                      style={{ 
                        width: `${(token.metrics.sellCount / (token.metrics.buyCount + token.metrics.sellCount)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <div className="grid gap-3">
                <SecurityItem 
                  label="Top Holder Concentration"
                  value={`${token.metrics.topHolderPercent.toFixed(1)}%`}
                  risk={token.metrics.topHolderPercent > 20 ? 'high' : token.metrics.topHolderPercent > 10 ? 'medium' : 'low'}
                  description="Percentage of supply held by the largest holder"
                />
                <SecurityItem 
                  label="Developer Holdings"
                  value={`${token.metrics.devHolding.toFixed(1)}%`}
                  risk={token.metrics.devHolding > 5 ? 'high' : token.metrics.devHolding > 2 ? 'medium' : 'low'}
                  description="Percentage of supply held by the deployer"
                />
                <SecurityItem 
                  label="Insider Percentage"
                  value={`${token.metrics.insiderPercent.toFixed(1)}%`}
                  risk={token.metrics.insiderPercent > 15 ? 'high' : token.metrics.insiderPercent > 8 ? 'medium' : 'low'}
                  description="Estimated percentage held by connected wallets"
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-4">
                <div className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg',
                  token.isVerified ? 'bg-price-up/10' : 'bg-muted'
                )}>
                  <Shield className={cn(
                    'w-5 h-5',
                    token.isVerified ? 'text-price-up' : 'text-muted-foreground'
                  )} />
                  <span className="text-sm">
                    {token.isVerified ? 'Contract Verified' : 'Not Verified'}
                  </span>
                </div>
                <div className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg',
                  token.hasAudit ? 'bg-price-up/10' : 'bg-muted'
                )}>
                  <Shield className={cn(
                    'w-5 h-5',
                    token.hasAudit ? 'text-price-up' : 'text-muted-foreground'
                  )} />
                  <span className="text-sm">
                    {token.hasAudit ? 'Audited' : 'No Audit'}
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
});

TokenModal.displayName = 'TokenModal';

const PriceChangeCard = memo(({ label, value }: { label: string; value: number }) => (
  <div className="bg-muted/50 rounded-lg p-3 text-center">
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <PercentChangeCell value={value} />
  </div>
));
PriceChangeCard.displayName = 'PriceChangeCard';

const MetricCard = memo(({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string 
}) => (
  <div className="bg-muted/50 rounded-lg p-3">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className="font-semibold tabular-nums">{value}</p>
  </div>
));
MetricCard.displayName = 'MetricCard';

const StatCard = memo(({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string 
}) => (
  <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
    <div className="p-2 bg-primary/10 rounded-lg">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  </div>
));
StatCard.displayName = 'StatCard';

const SecurityItem = memo(({ 
  label, 
  value, 
  risk,
  description
}: { 
  label: string; 
  value: string; 
  risk: 'low' | 'medium' | 'high';
  description: string;
}) => (
  <div className="bg-muted/50 rounded-lg p-4">
    <div className="flex items-center justify-between mb-1">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {risk === 'high' && <AlertTriangle className="w-4 h-4 text-price-down" />}
        <span className={cn(
          'font-mono tabular-nums font-semibold',
          risk === 'low' && 'text-price-up',
          risk === 'medium' && 'text-warning',
          risk === 'high' && 'text-price-down'
        )}>
          {value}
        </span>
      </div>
    </div>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
));
SecurityItem.displayName = 'SecurityItem';
