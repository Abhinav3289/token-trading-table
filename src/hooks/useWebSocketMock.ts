import { useEffect, useRef, useCallback } from 'react';
import { TokenPriceUpdate, PriceDirection } from '@/types/token';

interface UseWebSocketMockOptions {
  onPriceUpdate: (update: TokenPriceUpdate) => void;
  tokenIds: string[];
  updateInterval?: number;
  enabled?: boolean;
}

export const useWebSocketMock = ({
  onPriceUpdate,
  tokenIds,
  updateInterval = 2000,
  enabled = true,
}: UseWebSocketMockOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tokenIdsRef = useRef(tokenIds);
  
  // Keep tokenIds ref updated
  useEffect(() => {
    tokenIdsRef.current = tokenIds;
  }, [tokenIds]);
  
  const generatePriceUpdate = useCallback((tokenId: string): TokenPriceUpdate => {
    const changePercent = (Math.random() - 0.5) * 10; // -5% to +5%
    const priceMultiplier = 1 + changePercent / 100;
    const newPrice = Math.random() * 0.01 * priceMultiplier;
    
    const direction: PriceDirection = 
      changePercent > 0.5 ? 'up' : 
      changePercent < -0.5 ? 'down' : 
      'neutral';
    
    return {
      id: tokenId,
      price: newPrice,
      priceDirection: direction,
      priceChange1m: (Math.random() - 0.5) * 20,
      priceChange5m: (Math.random() - 0.5) * 40,
      volume24h: Math.random() * 1000000 + 50000,
      marketCap: Math.random() * 5000000 + 100000,
    };
  }, []);
  
  const startUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      const ids = tokenIdsRef.current;
      if (ids.length === 0) return;
      
      // Update 1-3 random tokens per interval
      const updateCount = Math.min(Math.floor(Math.random() * 3) + 1, ids.length);
      const shuffled = [...ids].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < updateCount; i++) {
        const update = generatePriceUpdate(shuffled[i]);
        onPriceUpdate(update);
      }
    }, updateInterval);
  }, [generatePriceUpdate, onPriceUpdate, updateInterval]);
  
  const stopUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  
  useEffect(() => {
    if (enabled && tokenIds.length > 0) {
      startUpdates();
    } else {
      stopUpdates();
    }
    
    return stopUpdates;
  }, [enabled, tokenIds.length, startUpdates, stopUpdates]);
  
  return {
    startUpdates,
    stopUpdates,
    isConnected: enabled && intervalRef.current !== null,
  };
};
