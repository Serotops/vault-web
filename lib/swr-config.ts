import { SWRConfiguration } from 'swr';
import { apiClient } from './api-client';

// Default SWR configuration
export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
  errorRetryCount: 3,
  errorRetryInterval: 1000,
  loadingTimeout: 3000,
  focusThrottleInterval: 5000,
};

// Default fetcher function using our API client
export const fetcher = async (url: string) => {
  const response = await apiClient.get(url);
  return response.data;
};

// Cache key generators for consistent SWR keys
export const cacheKeys = {
  // Auction-related keys
  auctions: (filters?: Record<string, any>) => 
    filters ? ['auctions', filters] : ['auctions'],
  auction: (id: string) => ['auction', id],
  auctionBids: (id: string) => ['auction', id, 'bids'],
  auctionWatchers: (id: string) => ['auction', id, 'watchers'],
  
  // User-related keys
  user: (id: string) => ['user', id],
  userProfile: (id: string) => ['user', id, 'profile'],
  userBids: (id: string) => ['user', id, 'bids'],
  userWatchlist: (id: string) => ['user', id, 'watchlist'],
  userNotifications: (id: string) => ['user', id, 'notifications'],
  
  // Search and categories
  categories: () => ['categories'],
  search: (query: string, filters?: Record<string, any>) => 
    ['search', query, filters],
  
  // Authentication
  currentUser: () => ['auth', 'current-user'],
};

// Helper function to mutate related cache entries
export const mutateRelated = {
  // When an auction is updated, invalidate related cache entries
  auction: (id: string) => [
    cacheKeys.auction(id),
    cacheKeys.auctionBids(id),
    cacheKeys.auctionWatchers(id),
    cacheKeys.auctions(),
  ],
  
  // When a bid is placed, invalidate related cache entries
  bid: (auctionId: string, userId: string) => [
    cacheKeys.auction(auctionId),
    cacheKeys.auctionBids(auctionId),
    cacheKeys.userBids(userId),
    cacheKeys.auctions(),
  ],
  
  // When watchlist is updated
  watchlist: (userId: string) => [
    cacheKeys.userWatchlist(userId),
    cacheKeys.auctions(),
  ],
};

// SWR options for different data types
export const swrOptions = {
  // Real-time data - SignalR handles updates, SWR for caching only
  realtime: {
    refreshInterval: 0,              // No polling - SignalR handles real-time
    revalidateOnFocus: false,        // SignalR keeps data fresh
    revalidateOnReconnect: true,     // Refresh when connection restored
  },
  
  // Semi-static data - less frequent updates
  semiStatic: {
    refreshInterval: 300000,         // 5 minutes instead of 30 seconds
    revalidateOnFocus: false,
  },
  
  // Static data (manual refresh only)
  static: {
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  },
  
  // User-specific data - occasional refresh only
  userSpecific: {
    refreshInterval: 0,              // No polling - update via SignalR or manual actions
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  },
};
