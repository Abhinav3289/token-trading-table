// Number and string formatting utilities

export const formatPrice = (price: number): string => {
  if (price === 0) return '$0.00';
  
  if (price < 0.00001) {
    return `$${price.toExponential(2)}`;
  }
  
  if (price < 0.01) {
    // Count leading zeros after decimal
    const priceStr = price.toFixed(10);
    const match = priceStr.match(/^0\.(0+)/);
    if (match) {
      const zeroCount = match[1].length;
      const significantDigits = price.toFixed(zeroCount + 4).slice(zeroCount + 2);
      return `$0.0{${zeroCount}}${significantDigits.replace(/0+$/, '')}`;
    }
    return `$${price.toFixed(6)}`;
  }
  
  if (price < 1) {
    return `$${price.toFixed(4)}`;
  }
  
  if (price < 1000) {
    return `$${price.toFixed(2)}`;
  }
  
  return `$${formatCompactNumber(price)}`;
};

export const formatCompactNumber = (num: number): string => {
  if (num === 0) return '0';
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum >= 1e9) {
    return `${sign}${(absNum / 1e9).toFixed(2)}B`;
  }
  if (absNum >= 1e6) {
    return `${sign}${(absNum / 1e6).toFixed(2)}M`;
  }
  if (absNum >= 1e3) {
    return `${sign}${(absNum / 1e3).toFixed(2)}K`;
  }
  
  return `${sign}${absNum.toFixed(2)}`;
};

export const formatCurrency = (num: number): string => {
  return `$${formatCompactNumber(num)}`;
};

export const formatPercent = (percent: number): string => {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};

export const formatAddress = (address: string, startChars = 4, endChars = 4): string => {
  if (address.length <= startChars + endChars + 2) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatAge = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffSecs < 60) return `${diffSecs}s`;
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return `${Math.floor(diffDays / 7)}w`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
