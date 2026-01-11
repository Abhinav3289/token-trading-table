// Token data types for Axiom Trade table

export type TokenCategory = 'new' | 'finalStretch' | 'migrated';

export type PriceDirection = 'up' | 'down' | 'neutral';

export interface TokenSocials {
  twitter?: string;
  telegram?: string;
  website?: string;
  discord?: string;
}

export interface TokenMetrics {
  holders: number;
  txCount: number;
  buyCount: number;
  sellCount: number;
  topHolderPercent: number;
  devHolding: number;
  insiderPercent: number;
}

export interface Token {
  id: string;
  symbol: string;
  name: string;
  address: string;
  imageUrl: string;
  
  // Price data
  price: number;
  priceChange1m: number;
  priceChange5m: number;
  priceChange1h: number;
  priceChange24h: number;
  priceDirection: PriceDirection;
  
  // Volume & Liquidity
  volume24h: number;
  liquidity: number;
  marketCap: number;
  fdv: number;
  
  // Progress (for new pairs)
  bondingProgress?: number;
  
  // Metadata
  createdAt: Date;
  age: string;
  category: TokenCategory;
  
  // Flags
  isNew: boolean;
  isHot: boolean;
  isTrending: boolean;
  isVerified: boolean;
  hasAudit: boolean;
  
  // Social & Metrics
  socials: TokenSocials;
  metrics: TokenMetrics;
}

export interface TokenPriceUpdate {
  id: string;
  price: number;
  priceDirection: PriceDirection;
  priceChange1m: number;
  priceChange5m: number;
  volume24h: number;
  marketCap: number;
}

export interface TokenTableColumn {
  id: string;
  label: string;
  accessor: keyof Token | string;
  sortable: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  column: string;
  direction: SortDirection;
}

export interface TokenFilters {
  minLiquidity?: number;
  maxLiquidity?: number;
  minVolume?: number;
  minMarketCap?: number;
  showVerifiedOnly?: boolean;
  search?: string;
}

// API response types
export interface TokensResponse {
  tokens: Token[];
  total: number;
  page: number;
  pageSize: number;
}

export interface WebSocketMessage {
  type: 'price_update' | 'new_token' | 'token_removed';
  payload: TokenPriceUpdate | Token | string;
}
