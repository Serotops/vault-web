// SignalR hooks for real-time auction updates

import { useEffect, useRef, useCallback } from 'react';
import { useSWRConfig } from 'swr';
import { signalRService } from '@/lib/signalr-service';
import { cacheKeys, mutateRelated } from '@/lib/swr-config';
import { useAuth } from './use-auth';

// Hook for managing SignalR connection lifecycle
export const useSignalRConnection = () => {
  const { isAuthenticated } = useAuth();
  const connectionRef = useRef<boolean>(false);

  useEffect(() => {
    if (isAuthenticated && !connectionRef.current) {
      signalRService.start();
      connectionRef.current = true;
    }

    if (!isAuthenticated && connectionRef.current) {
      signalRService.stop();
      connectionRef.current = false;
    }

    return () => {
      if (connectionRef.current) {
        signalRService.stop();
        connectionRef.current = false;
      }
    };
  }, [isAuthenticated]);

  return {
    isConnected: signalRService.isConnected,
    connectionState: signalRService.connectionState,
  };
};

// Hook for real-time auction updates
export const useAuctionRealtime = (auctionId: string | null) => {
  const { mutate } = useSWRConfig();
  const connectionEstablished = useRef(false);

  // Handle bid updates
  const handleBidReceived = useCallback((receivedAuctionId: string, bidData: any) => {
    if (receivedAuctionId === auctionId) {
      // Update auction data immediately
      mutateRelated.bid(receivedAuctionId, bidData.bidderId).forEach(key => {
        mutate(key);
      });
    }
  }, [auctionId, mutate]);

  // Handle auction end
  const handleAuctionEnded = useCallback((receivedAuctionId: string, result: any) => {
    if (receivedAuctionId === auctionId) {
      // Update auction data when it ends
      mutateRelated.auction(receivedAuctionId).forEach(key => {
        mutate(key);
      });
    }
  }, [auctionId, mutate]);

  // Handle user count updates
  const handleUserCountUpdated = useCallback((receivedAuctionId: string, count: number) => {
    if (receivedAuctionId === auctionId) {
      // Update watcher count
      mutate(cacheKeys.auctionWatchers(receivedAuctionId));
    }
  }, [auctionId, mutate]);

  useEffect(() => {
    if (!auctionId || !signalRService.isConnected) return;

    // Join auction group
    signalRService.joinAuctionGroup(auctionId);
    connectionEstablished.current = true;

    // Set up event listeners
    signalRService.onBidReceived(handleBidReceived);
    signalRService.onAuctionEnded(handleAuctionEnded);
    signalRService.onUserCountUpdated(handleUserCountUpdated);

    return () => {
      if (connectionEstablished.current && auctionId) {
        signalRService.leaveAuctionGroup(auctionId);
        connectionEstablished.current = false;
      }
    };
  }, [auctionId, handleBidReceived, handleAuctionEnded, handleUserCountUpdated]);

  return {
    isConnected: signalRService.isConnected,
    isInAuctionGroup: connectionEstablished.current,
  };
};

// Hook for real-time notifications
export const useNotificationRealtime = () => {
  const { mutate } = useSWRConfig();
  const { user } = useAuth();

  const handleNotificationReceived = useCallback((notification: any) => {
    // Update notifications cache
    if (user) {
      mutate(cacheKeys.userNotifications(user.id));
    }

    // You can also trigger a toast notification here
    console.log('New notification received:', notification);
  }, [user, mutate]);

  useEffect(() => {
    if (!signalRService.isConnected) return;

    signalRService.onNotificationReceived(handleNotificationReceived);

    return () => {
      // Cleanup is handled by SignalR service
    };
  }, [handleNotificationReceived]);

  return {
    isConnected: signalRService.isConnected,
  };
};

// Hook for real-time bid updates across all auctions
export const useGlobalBidUpdates = () => {
  const { mutate } = useSWRConfig();

  const handleGlobalBidReceived = useCallback((auctionId: string, bidData: any) => {
    // Update global auction lists when any bid is received
    mutate(cacheKeys.auctions());
    mutate(['featured-auctions']);
    mutate(['ending-soon-auctions']);
  }, [mutate]);

  const handleGlobalAuctionEnded = useCallback((auctionId: string, result: any) => {
    // Update global auction lists when any auction ends
    mutate(cacheKeys.auctions());
    mutate(['featured-auctions']);
    mutate(['ending-soon-auctions']);
  }, [mutate]);

  useEffect(() => {
    if (!signalRService.isConnected) return;

    signalRService.onBidReceived(handleGlobalBidReceived);
    signalRService.onAuctionEnded(handleGlobalAuctionEnded);

    return () => {
      // Cleanup is handled by SignalR service
    };
  }, [handleGlobalBidReceived, handleGlobalAuctionEnded]);

  return {
    isConnected: signalRService.isConnected,
  };
};

// Hook for managing auction group subscriptions
export const useAuctionGroups = () => {
  const joinedGroups = useRef<Set<string>>(new Set());

  const joinGroup = useCallback(async (auctionId: string) => {
    if (!signalRService.isConnected || joinedGroups.current.has(auctionId)) {
      return;
    }

    try {
      await signalRService.joinAuctionGroup(auctionId);
      joinedGroups.current.add(auctionId);
    } catch (error) {
      console.error('Failed to join auction group:', error);
    }
  }, []);

  const leaveGroup = useCallback(async (auctionId: string) => {
    if (!joinedGroups.current.has(auctionId)) {
      return;
    }

    try {
      await signalRService.leaveAuctionGroup(auctionId);
      joinedGroups.current.delete(auctionId);
    } catch (error) {
      console.error('Failed to leave auction group:', error);
    }
  }, []);

  const leaveAllGroups = useCallback(async () => {
    const groups = Array.from(joinedGroups.current);
    await Promise.all(groups.map(group => leaveGroup(group)));
  }, [leaveGroup]);

  useEffect(() => {
    return () => {
      // Leave all groups on unmount
      leaveAllGroups();
    };
  }, [leaveAllGroups]);

  return {
    joinGroup,
    leaveGroup,
    leaveAllGroups,
    joinedGroups: Array.from(joinedGroups.current),
    isConnected: signalRService.isConnected,
  };
};

// Main SignalR hook for components
export function useSignalR(options: {
  onBidUpdate?: (auctionId: string, bidData: any) => void;
  onAuctionEnd?: (auctionId: string, result: any) => void;
  onNotification?: (notification: any) => void;
} = {}) {
  const connection = useSignalRConnection();
  const { joinGroup, leaveGroup, leaveAllGroups, joinedGroups } = useAuctionGroups();

  // Set up event listeners
  useEffect(() => {
    if (options.onBidUpdate) {
      signalRService.onBidReceived(options.onBidUpdate);
    }
    if (options.onAuctionEnd) {
      signalRService.onAuctionEnded(options.onAuctionEnd);
    }
    if (options.onNotification) {
      signalRService.onNotificationReceived(options.onNotification);
    }

    return () => {
      // Clean up listeners on unmount
      signalRService.removeAllListeners();
    };
  }, [options.onBidUpdate, options.onAuctionEnd, options.onNotification]);

  return {
    isConnected: signalRService.isConnected,
    joinGroup,
    leaveGroup,
    leaveAllGroups,
    joinedGroups,
  };
}
