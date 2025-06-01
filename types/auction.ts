// Auction domain types
export interface Auction {
  id: string;
  title: string;
  description: string;
  category: AuctionCategory;
  condition: ItemCondition;
  startingBid: number;
  currentBid: number;
  buyNowPrice?: number;
  startTime: Date;
  endTime: Date;
  sellerId: string;
  status: AuctionStatus;
  images: AuctionImage[];
  bidCount: number;
  watchers: number;
  shippingInfo: ShippingInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  timestamp: Date;
  isAutoBid: boolean;
  maxBidAmount?: number;
}

export interface AuctionImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  order: number;
  alt: string;
}

export interface ShippingInfo {
  domestic: number;
  international?: number;
  handlingTime: string;
  shipsTo: string[];
}

export type AuctionCategory = 
  | 'comics'
  | 'trading-cards'
  | 'action-figures'
  | 'vintage-toys'
  | 'gaming'
  | 'movies'
  | 'music'
  | 'sports';

export type ItemCondition = 
  | 'mint'
  | 'near-mint'
  | 'very-fine'
  | 'fine'
  | 'very-good'
  | 'good'
  | 'fair'
  | 'poor';

export type AuctionStatus = 
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'ended'
  | 'cancelled'
  | 'sold';

// Placeholder for additional auction-related types
export interface AuctionFilters {
  // TODO: Define auction filter types
}

export interface AuctionSearchParams {
  // TODO: Define search parameter types
}
