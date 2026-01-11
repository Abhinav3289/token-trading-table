import React, { memo, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/formatters';
import { PriceDirection } from '@/types/token';

interface PriceCellProps {
  price: number;
  priceDirection: PriceDirection;
  showAnimation?: boolean;
}

export const PriceCell = memo(({ 
  price, 
  priceDirection,
  showAnimation = true 
}: PriceCellProps) => {
  const [flashClass, setFlashClass] = useState<string>('');
  const prevPriceRef = useRef(price);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (!showAnimation) return;
    
    if (prevPriceRef.current !== price) {
      const direction = price > prevPriceRef.current ? 'up' : 'down';
      setFlashClass(direction === 'up' ? 'price-flash-up' : 'price-flash-down');
      
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Remove flash class after animation
      timeoutRef.current = setTimeout(() => {
        setFlashClass('');
      }, 600);
      
      prevPriceRef.current = price;
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [price, showAnimation]);
  
  return (
    <span 
      className={cn(
        'font-mono text-sm tabular-nums transition-colors duration-150',
        priceDirection === 'up' && 'text-price-up',
        priceDirection === 'down' && 'text-price-down',
        priceDirection === 'neutral' && 'text-foreground',
        flashClass
      )}
    >
      {formatPrice(price)}
    </span>
  );
});

PriceCell.displayName = 'PriceCell';

interface PercentChangeCellProps {
  value: number;
  className?: string;
}

export const PercentChangeCell = memo(({ value, className }: PercentChangeCellProps) => {
  const isPositive = value >= 0;
  const formattedValue = `${isPositive ? '+' : ''}${value.toFixed(2)}%`;
  
  return (
    <span 
      className={cn(
        'font-mono text-sm tabular-nums',
        isPositive ? 'text-price-up' : 'text-price-down',
        className
      )}
    >
      {formattedValue}
    </span>
  );
});

PercentChangeCell.displayName = 'PercentChangeCell';
