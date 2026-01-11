import { Token, TokenCategory } from '@/types/token';

const generateRandomAddress = () => {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

const generateAge = (createdAt: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
};

const tokenNames = [
  { symbol: 'PEPE', name: 'Pepe' },
  { symbol: 'DOGE', name: 'Dogecoin' },
  { symbol: 'SHIB', name: 'Shiba Inu' },
  { symbol: 'BONK', name: 'Bonk' },
  { symbol: 'WIF', name: 'dogwifhat' },
  { symbol: 'FLOKI', name: 'Floki' },
  { symbol: 'MEME', name: 'Memecoin' },
  { symbol: 'COQ', name: 'Coq Inu' },
  { symbol: 'SAMO', name: 'Samoyedcoin' },
  { symbol: 'MYRO', name: 'Myro' },
  { symbol: 'POPCAT', name: 'Popcat' },
  { symbol: 'MEW', name: 'cat in a dogs world' },
  { symbol: 'BOME', name: 'BOOK OF MEME' },
  { symbol: 'SLERF', name: 'Slerf' },
  { symbol: 'TREMP', name: 'Doland Tremp' },
  { symbol: 'PONKE', name: 'Ponke' },
  { symbol: 'GME', name: 'GameStop' },
  { symbol: 'TRUMP', name: 'MAGA' },
  { symbol: 'FWOG', name: 'Fwog' },
  { symbol: 'GIGA', name: 'Giga Chad' },
  { symbol: 'BRETT', name: 'Brett' },
  { symbol: 'TOSHI', name: 'Toshi' },
  { symbol: 'MOCHI', name: 'Mochi' },
  { symbol: 'ANDY', name: 'Andy' },
  { symbol: 'NEIRO', name: 'Neiro' },
];

const generateMockToken = (index: number, category: TokenCategory): Token => {
  const tokenInfo = tokenNames[index % tokenNames.length];
  const now = new Date();
  
  // Generate different creation times based on category
  let createdAt: Date;
  switch (category) {
    case 'new':
      createdAt = new Date(now.getTime() - Math.random() * 3600000); // Within 1 hour
      break;
    case 'finalStretch':
      createdAt = new Date(now.getTime() - Math.random() * 86400000); // Within 1 day
      break;
    case 'migrated':
      createdAt = new Date(now.getTime() - Math.random() * 604800000); // Within 1 week
      break;
  }
  
  const priceChange1m = (Math.random() - 0.5) * 20;
  const priceChange5m = (Math.random() - 0.5) * 40;
  const priceChange1h = (Math.random() - 0.5) * 100;
  const priceChange24h = (Math.random() - 0.5) * 200;
  
  const price = Math.random() * 0.01;
  const liquidity = Math.random() * 500000 + 10000;
  const volume24h = Math.random() * 1000000 + 50000;
  const marketCap = liquidity * (Math.random() * 5 + 2);
  
  return {
    id: `token-${category}-${index}`,
    symbol: `${tokenInfo.symbol}${index}`,
    name: `${tokenInfo.name} ${index}`,
    address: generateRandomAddress(),
    imageUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${tokenInfo.symbol}${index}`,
    
    price,
    priceChange1m,
    priceChange5m,
    priceChange1h,
    priceChange24h,
    priceDirection: priceChange1m > 0 ? 'up' : priceChange1m < 0 ? 'down' : 'neutral',
    
    volume24h,
    liquidity,
    marketCap,
    fdv: marketCap * 1.5,
    
    bondingProgress: category === 'new' ? Math.random() * 100 : 
                     category === 'finalStretch' ? 80 + Math.random() * 20 : 100,
    
    createdAt,
    age: generateAge(createdAt),
    category,
    
    isNew: category === 'new',
    isHot: Math.random() > 0.7,
    isTrending: Math.random() > 0.8,
    isVerified: Math.random() > 0.5,
    hasAudit: Math.random() > 0.7,
    
    socials: {
      twitter: Math.random() > 0.3 ? `https://twitter.com/${tokenInfo.symbol.toLowerCase()}` : undefined,
      telegram: Math.random() > 0.4 ? `https://t.me/${tokenInfo.symbol.toLowerCase()}` : undefined,
      website: Math.random() > 0.5 ? `https://${tokenInfo.symbol.toLowerCase()}.io` : undefined,
      discord: Math.random() > 0.6 ? `https://discord.gg/${tokenInfo.symbol.toLowerCase()}` : undefined,
    },
    
    metrics: {
      holders: Math.floor(Math.random() * 10000) + 100,
      txCount: Math.floor(Math.random() * 50000) + 500,
      buyCount: Math.floor(Math.random() * 25000) + 250,
      sellCount: Math.floor(Math.random() * 25000) + 250,
      topHolderPercent: Math.random() * 30 + 5,
      devHolding: Math.random() * 10,
      insiderPercent: Math.random() * 20,
    },
  };
};

export const generateMockTokens = (count: number, category: TokenCategory): Token[] => {
  return Array.from({ length: count }, (_, i) => generateMockToken(i, category));
};

export const mockNewPairs = generateMockTokens(25, 'new');
export const mockFinalStretch = generateMockTokens(25, 'finalStretch');
export const mockMigrated = generateMockTokens(25, 'migrated');

export const allMockTokens = {
  new: mockNewPairs,
  finalStretch: mockFinalStretch,
  migrated: mockMigrated,
};
