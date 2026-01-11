import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import { Token, TokenCategory, TokenPriceUpdate, SortConfig, TokenFilters } from '@/types/token';
import { allMockTokens } from '@/data/mockTokens';
import { useWebSocketMock } from './useWebSocketMock';

const fetchTokens = async (category: TokenCategory): Promise<Token[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  return allMockTokens[category];
};

interface UseTokenDataOptions {
  category: TokenCategory;
  initialSort?: SortConfig;
  filters?: TokenFilters;
  enableRealtime?: boolean;
}

export const useTokenData = ({
  category,
  initialSort = { column: 'createdAt', direction: 'desc' },
  filters = {},
  enableRealtime = true,
}: UseTokenDataOptions) => {
  const queryClient = useQueryClient();
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort);
  
  const { data: tokens = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['tokens', category],
    queryFn: () => fetchTokens(category),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
  
  // Handle price updates from WebSocket
  const handlePriceUpdate = useCallback((update: TokenPriceUpdate) => {
    queryClient.setQueryData<Token[]>(['tokens', category], (oldData) => {
      if (!oldData) return oldData;
      
      return oldData.map(token => {
        if (token.id === update.id) {
          return {
            ...token,
            price: update.price,
            priceDirection: update.priceDirection,
            priceChange1m: update.priceChange1m,
            priceChange5m: update.priceChange5m,
            volume24h: update.volume24h,
            marketCap: update.marketCap,
          };
        }
        return token;
      });
    });
  }, [queryClient, category]);
  
  const tokenIds = useMemo(() => tokens.map(t => t.id), [tokens]);
  
  useWebSocketMock({
    onPriceUpdate: handlePriceUpdate,
    tokenIds,
    updateInterval: 2000,
    enabled: enableRealtime && !isLoading,
  });
  
  // Filter tokens
  const filteredTokens = useMemo(() => {
    let result = [...tokens];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(t => 
        t.symbol.toLowerCase().includes(search) ||
        t.name.toLowerCase().includes(search) ||
        t.address.toLowerCase().includes(search)
      );
    }
    
    if (filters.minLiquidity !== undefined) {
      result = result.filter(t => t.liquidity >= filters.minLiquidity!);
    }
    
    if (filters.maxLiquidity !== undefined) {
      result = result.filter(t => t.liquidity <= filters.maxLiquidity!);
    }
    
    if (filters.minVolume !== undefined) {
      result = result.filter(t => t.volume24h >= filters.minVolume!);
    }
    
    if (filters.minMarketCap !== undefined) {
      result = result.filter(t => t.marketCap >= filters.minMarketCap!);
    }
    
    if (filters.showVerifiedOnly) {
      result = result.filter(t => t.isVerified);
    }
    
    return result;
  }, [tokens, filters]);
  
  // Sort tokens
  const sortedTokens = useMemo(() => {
    const sorted = [...filteredTokens];
    
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.column as keyof Token];
      const bValue = b[sortConfig.column as keyof Token];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      }
      
      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
    
    return sorted;
  }, [filteredTokens, sortConfig]);
  
  const handleSort = useCallback((column: string) => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  }, []);
  
  return {
    tokens: sortedTokens,
    isLoading,
    isError,
    refetch,
    sortConfig,
    handleSort,
    totalCount: tokens.length,
    filteredCount: filteredTokens.length,
  };
};
