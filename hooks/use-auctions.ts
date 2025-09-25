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

// API response type that matches your backend
interface ApiAuctionResponse {
	id: string;
	name: string;
	brand: string;
	startDate: string;
	endDate: string;
	description?: string;
	startingBid?: number;
	currentBid?: number;
	buyNowPrice?: number;
	sellerId?: string;
	bidCount?: number;
	watchers?: number;
	createdAt?: string;
	updatedAt?: string;
}

interface ApiPaginatedResponse<T> {
	pageIndex: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	data: T[];
}

// Data mapper to convert API response to frontend format
const mapAuctionData = (apiData: ApiAuctionResponse): Auction => {
	return {
		id: apiData.id,
		title: apiData.name || 'Untitled Auction',
		description: apiData.description || 'No description available',
		category: 'gaming', // Default category for now
		condition: 'good', // Default condition
		startingBid: apiData.startingBid || 0,
		currentBid: apiData.currentBid || 0,
		buyNowPrice: apiData.buyNowPrice,
		startTime: new Date(apiData.startDate || Date.now()),
		endTime: new Date(apiData.endDate || Date.now()),
		sellerId: apiData.sellerId || '',
		status: 'active', // Default status
		images: [], // Empty for now since API doesn't return images
		bidCount: apiData.bidCount || 0,
		watchers: apiData.watchers || 0,
		shippingInfo: {
			domestic: 0,
			handlingTime: '1-2 days',
			shipsTo: ['US'],
		},
		createdAt: new Date(apiData.createdAt || Date.now()),
		updatedAt: new Date(apiData.updatedAt || Date.now()),
	};
};

// Fetcher functions with proper typing
const fetchAuctions = async (
	url: string
): Promise<PaginatedResponse<Auction>> => {
	const response = await apiClient.get<
		ApiPaginatedResponse<ApiAuctionResponse>
	>(url);
	// Transform the API response to match frontend expectations
	return {
		...response,
		data: response.data.map(mapAuctionData),
	};
};

const fetchAuction = async (url: string): Promise<Auction> => {
	const response = await apiClient.get<ApiAuctionResponse>(url);
	return mapAuctionData(response);
};

const fetchBids = async (url: string): Promise<Bid[]> => {
	const response = await apiClient.get<Bid[]>(url);
	return response;
};

const fetchAuctionCount = async (url: string): Promise<{ count: number }> => {
	const response = await apiClient.get<{ count: number }>(url);
	return response;
};

// Hook for fetching all auctions with filtering and pagination
export const useAuctions = (filters?: AuctionFilters) => {
	const key = filters ? ['auctions', filters] : ['auctions'];

	const { data, error, isLoading, mutate } = useSWR(
		key,
		async () => {
			const queryParams = filters
				? new URLSearchParams(
						Object.entries(filters)
							.filter(([_, value]) => value !== undefined)
							.map(([key, value]) => [key, String(value)])
				  ).toString()
				: '';
			return fetchAuctions(
				`/auctions${queryParams ? '?' + queryParams : ''}`
			);
		},
		swrOptions.semiStatic // Use semi-static config - no aggressive polling
	);

	return {
		auctions: data?.data || [],
		totalCount: data?.totalItems || 0,
		totalPages: data?.totalPages || 0,
		currentPage: data?.pageIndex || 1,
		hasNext: (data?.pageIndex || 1) < (data?.totalPages || 1),
		hasPrevious: (data?.pageIndex || 1) > 1,
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
		swrOptions.realtime // Real-time data handled by SignalR, no polling
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
	const key = auctionId
		? ['auction', auctionId, 'bids', page, pageSize]
		: null;

	const { data, error, isLoading, mutate } = useSWR(
		key,
		async () =>
			fetchBids(
				`/auctions/${auctionId}/bids?page=${page}&pageSize=${pageSize}`
			),
		swrOptions.realtime // Bids are real-time via SignalR
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
			const queryParams = filters
				? new URLSearchParams(
						Object.entries(filters)
							.filter(([_, value]) => value !== undefined)
							.map(([key, value]) => [key, String(value)])
				  ).toString()
				: '';
			return fetchAuctionCount(
				`/auctions/count${queryParams ? '?' + queryParams : ''}`
			);
		},
		swrOptions.semiStatic // Count changes less frequently
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
			const response = await apiClient.post<any>(
				`/auctions/${auctionId}/bids`,
				{
					amount,
				}
			);

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
		swrOptions.semiStatic // Search results updated less frequently
	);

	return {
		searchResults: data?.data || [],
		totalCount: data?.totalItems || 0,
		totalPages: data?.totalPages || 0,
		currentPage: data?.pageIndex || 1,
		hasNext: (data?.pageIndex || 1) < (data?.totalPages || 1),
		hasPrevious: (data?.pageIndex || 1) > 1,
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
		swrOptions.realtime // Ending soon times are real-time critical
	);

	return {
		endingSoonAuctions: data?.data || [],
		isLoading,
		error,
		mutate,
	};
};
