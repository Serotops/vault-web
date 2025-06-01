// SWR hooks for auction data fetching

import useSWR from 'swr';
import { useSWRConfig } from 'swr';
import { Auction, Bid, PaginatedResponse } from '@/types';
import { apiClient } from '@/lib/api-client';
import { swrOptions } from '@/lib/swr-config';

// Define filter types
interface AuctionFilters {
  category?: string;
  condition?: string;
  status?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Fetcher functions with proper typing
const fetchAuctions = async (url: string): Promise<PaginatedResponse<Auction>> => {
  const response = await apiClient.get<PaginatedResponse<Auction>>(url);
  return response.data;
};

const fetchAuction = async (url: string): Promise<Auction> => {
  const response = await apiClient.get<Auction>(url);
  return response.data;
};

const fetchBids = async (url: string): Promise<Bid[]> => {
  const response = await apiClient.get<Bid[]>(url);
  return response.data;
};

const fetchAuctionCount = async (url: string): Promise<{ count: number }> => {
  const response = await apiClient.get<{ count: number }>(url);
  return response.data;
};

// Hook for fetching all auctions with filtering and pagination
export const useAuctions = (filters?: AuctionFilters) => {
  const key = filters ? ['auctions', filters] : ['auctions'];
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async () => {
      const queryParams = filters ? new URLSearchParams(
        Object.entries(filters)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString() : '';
        return fetchAuctions(`/auctions${queryParams ? '?' + queryParams : ''}`);
    },
    swrOptions.semiStatic  // Use semi-static config - no aggressive polling
  );

  return {
    auctions: data?.items || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    hasNext: data?.hasNext || false,
    hasPrevious: data?.hasPrevious || false,
    isLoading,
    error,
    mutate,
  };
};

// Hook for fetching a single auction by ID
export const useAuction = (auctionId: string | null) => {
  const key = auctionId ? ['auction', auctionId] : null;
    const { data, error, isLoading, mutate } = useSWR(
    key,
    async () => fetchAuction(`/auctions/${auctionId}`),
    swrOptions.realtime  // Real-time data handled by SignalR, no polling
  );

  return {
    auction: data,
    isLoading,
    error,
    mutate,
  };
};

// Hook for fetching bids for a specific auction
export const useAuctionBids = (
  auctionId: string | null,
  page: number = 1,
  pageSize: number = 20
) => {
  const key = auctionId ? ['auction', auctionId, 'bids', page, pageSize] : null;
  
  const { data, error, isLoading, mutate } = useSWR(
    key,    async () => fetchBids(`/auctions/${auctionId}/bids?page=${page}&pageSize=${pageSize}`),
    swrOptions.realtime  // Bids are real-time via SignalR
  );

  return {
    bids: data || [],
    isLoading,
    error,
    mutate,
  };
};

// Hook for fetching auction count by category or status
export const useAuctionCount = (filters?: {
  category?: string;
  status?: string;
}) => {
  const key = ['auction-count', filters];
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async () => {
      const queryParams = filters ? new URLSearchParams(
        Object.entries(filters)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString() : '';
        return fetchAuctionCount(`/auctions/count${queryParams ? '?' + queryParams : ''}`);
    },
    swrOptions.semiStatic  // Count changes less frequently
  );

  return {
    count: data?.count || 0,
    isLoading,
    error,
    mutate,
  };
};

// Hook for placing a bid on an auction
export const usePlaceBid = () => {
  const { mutate } = useSWRConfig();

  const placeBid = async (auctionId: string, amount: number) => {
    try {
      const response = await apiClient.post<any>(`/auctions/${auctionId}/bids`, {
        amount,
      });

      if (response.success) {
        // Revalidate relevant data
        mutate(['auction', auctionId]);
        mutate(['auction', auctionId, 'bids']);
        mutate(['auctions']);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to place bid');
      }
    } catch (error) {
      throw error;
    }
  };

  return { placeBid };
};

// Hook for searching auctions
export const useSearchAuctions = (
  query: string,
  filters?: Omit<AuctionFilters, 'search'>
) => {
  const key = query ? ['search', query, filters] : null;
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async () => {
      const searchParams = new URLSearchParams({
        search: query,
        ...Object.fromEntries(
          Object.entries(filters || {})
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ),
      });
        return fetchAuctions(`/auctions/search?${searchParams.toString()}`);
    },
    swrOptions.semiStatic  // Search results updated less frequently
  );

  return {
    searchResults: data?.items || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    hasNext: data?.hasNext || false,
    hasPrevious: data?.hasPrevious || false,
    isLoading,
    error,
    mutate,
  };
};

// Hook for fetching auctions ending soon
export const useEndingSoonAuctions = (limit: number = 10) => {
  const key = ['auctions', 'ending-soon', limit];
    const { data, error, isLoading, mutate } = useSWR(
    key,
    async () => fetchAuctions(`/auctions/ending-soon?limit=${limit}`),
    swrOptions.realtime  // Ending soon times are real-time critical
  );

  return {
    endingSoonAuctions: data?.items || [],
    isLoading,
    error,
    mutate,
  };
};
