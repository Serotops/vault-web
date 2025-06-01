// SWR hooks for user-related data

import useSWR from 'swr';
import { useSWRConfig } from 'swr';
import { User, Auction, Bid, PaginatedResponse, Notification } from '@/types';
import { cacheKeys, swrOptions } from '@/lib/swr-config';
import { apiClient } from '@/lib/api-client';
import { useAuth } from './use-auth';

// Hook for fetching user profile data
export const useUserProfile = (userId: string | null) => {
  const key = userId ? cacheKeys.userProfile(userId) : null;
  
  const fetcherFn = key ? async () => {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  } : null;
  
  const { data, error, isLoading, mutate } = useSWR<User>(
    key,
    fetcherFn,
    swrOptions.userSpecific
  );

  return {
    user: data,
    isLoading,
    error,
    mutate,
  };
};

// Hook for fetching current user's data
export const useCurrentUser = () => {
  const { isAuthenticated } = useAuth();
  
  const fetcherFn = isAuthenticated ? async () => {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  } : null;
  
  const { data, error, isLoading, mutate } = useSWR<User>(
    isAuthenticated ? cacheKeys.currentUser() : null,
    fetcherFn,
    swrOptions.userSpecific
  );

  return {
    currentUser: data,
    isLoading,
    error,
    mutate,
  };
};

// Hook for fetching user's active auctions
export const useUserAuctions = (userId: string | null, status?: string, page = 1, pageSize = 10) => {
  const key = userId ? cacheKeys.userProfile(userId) : null;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(status && { status }),
  });
  
  const fetcherFn = key ? async () => {
    const response = await apiClient.get<PaginatedResponse<Auction>>(`/users/${userId}/auctions?${queryParams}`);
    return response.data;
  } : null;
  
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Auction>>(
    key ? [key, 'auctions', queryParams.toString()] : null,
    fetcherFn,
    swrOptions.userSpecific
  );

  return {
    auctions: data?.items || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    mutate,
  };
};

// Hook for fetching user's bid history
export const useUserBids = (userId: string | null, page = 1, pageSize = 20) => {
  const key = userId ? cacheKeys.userBids(userId) : null;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  
  const fetcherFn = key ? async () => {
    const response = await apiClient.get<PaginatedResponse<Bid>>(`/users/${userId}/bids?${queryParams}`);
    return response.data;
  } : null;
  
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Bid>>(
    key ? [key, queryParams.toString()] : null,
    fetcherFn,
    swrOptions.userSpecific
  );

  return {
    bids: data?.items || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    mutate,
  };
};

// Hook for fetching user's watchlist
export const useUserWatchlist = (userId: string | null, page = 1, pageSize = 20) => {
  const key = userId ? cacheKeys.userWatchlist(userId) : null;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  
  const fetcherFn = key ? async () => {
    const response = await apiClient.get<PaginatedResponse<Auction>>(`/users/${userId}/watchlist?${queryParams}`);
    return response.data;
  } : null;
  
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Auction>>(
    key ? [key, queryParams.toString()] : null,
    fetcherFn,
    swrOptions.userSpecific
  );

  return {
    watchlist: data?.items || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    mutate,
  };
};

// Hook for fetching user's notifications
export const useUserNotifications = (userId: string | null, page = 1, pageSize = 15) => {
  const key = userId ? cacheKeys.userNotifications(userId) : null;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  
  const fetcherFn = key ? async () => {
    const response = await apiClient.get<PaginatedResponse<Notification>>(`/users/${userId}/notifications?${queryParams}`);
    return response.data;
  } : null;
    const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Notification>>(
    key ? [key, queryParams.toString()] : null,
    fetcherFn,
    swrOptions.realtime  // Notifications are real-time via SignalR
  );

  return {
    notifications: data?.items || [],
    totalCount: data?.totalCount || 0,
    unreadCount: data?.items?.filter(n => !n.isRead).length || 0,
    isLoading,
    error,
    mutate,
  };
};

// Hook for managing watchlist (add/remove items)
export const useWatchlistActions = () => {
  const { mutate } = useSWRConfig();
  const { user } = useAuth();

  const addToWatchlist = async (auctionId: string) => {
    try {
      const response = await fetch(`/api/users/watchlist/${auctionId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to add to watchlist');
      }

      // Invalidate watchlist cache
      if (user) {
        await mutate(cacheKeys.userWatchlist(user.id));
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  const removeFromWatchlist = async (auctionId: string) => {
    try {
      const response = await fetch(`/api/users/watchlist/${auctionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove from watchlist');
      }

      // Invalidate watchlist cache
      if (user) {
        await mutate(cacheKeys.userWatchlist(user.id));
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  const isInWatchlist = (auctionId: string): boolean => {
    // TODO: Implement local check based on watchlist data
    return false;
  };

  return {
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };
};

// Hook for updating user profile
export const useUpdateProfile = () => {
  const { mutate } = useSWRConfig();
  const { user, refreshUser } = useAuth();

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();

      // Refresh user data in auth context and cache
      await refreshUser();
      if (user) {
        await mutate(cacheKeys.userProfile(user.id));
        await mutate(cacheKeys.currentUser());
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  return { updateProfile };
};

// Hook for user statistics
export const useUserStats = (userId: string | null) => {
  const key = userId ? [cacheKeys.userProfile(userId), 'stats'] : null;
  
  const fetcherFn = key ? async () => {
    const response = await apiClient.get<{
      totalAuctions: number;
      activeAuctions: number;
      soldAuctions: number;
      totalBids: number;
      wonAuctions: number;
      watchlistCount: number;
    }>(`/users/${userId}/stats`);
    return response.data;
  } : null;
  
  const { data, error, isLoading, mutate } = useSWR<{
    totalAuctions: number;
    activeAuctions: number;
    soldAuctions: number;
    totalBids: number;
    wonAuctions: number;
    watchlistCount: number;
  }>(
    key,
    fetcherFn,
    swrOptions.semiStatic
  );

  return {
    stats: data,
    isLoading,
    error,
    mutate,
  };
};
