import React, { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { TokenCategory } from '@/types/token';
import { TokenTable } from './TokenTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Flame, Rocket, Zap } from 'lucide-react';

interface TabConfig {
  id: TokenCategory;
  label: string;
  icon: React.ElementType;
  description: string;
  showProgress: boolean;
}

const tabConfigs: TabConfig[] = [
  {
    id: 'new',
    label: 'New Pairs',
    icon: Sparkles,
    description: 'Recently launched tokens in bonding phase',
    showProgress: true,
  },
  {
    id: 'finalStretch',
    label: 'Final Stretch',
    icon: Flame,
    description: 'Tokens about to complete bonding (80%+)',
    showProgress: true,
  },
  {
    id: 'migrated',
    label: 'Migrated',
    icon: Rocket,
    description: 'Tokens that have migrated to DEX',
    showProgress: false,
  },
];

export const TokenTabs = memo(() => {
  const [activeTab, setActiveTab] = useState<TokenCategory>('new');
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={(v) => setActiveTab(v as TokenCategory)}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <TabsList className="bg-muted/50 p-1">
          {tabConfigs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                'gap-2 data-[state=active]:bg-background',
                'data-[state=active]:text-foreground'
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Live indicator */}
        <div className="flex items-center gap-2 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-muted-foreground">
            <Zap className="w-3 h-3 inline mr-1" />
            Live
          </span>
        </div>
      </div>
      
      {tabConfigs.map((tab) => (
        <TabsContent 
          key={tab.id} 
          value={tab.id}
          className="mt-0 focus-visible:outline-none"
        >
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">{tab.description}</p>
          </div>
          <TokenTable 
            category={tab.id} 
            showProgress={tab.showProgress}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
});

TokenTabs.displayName = 'TokenTabs';
