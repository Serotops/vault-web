import { useState, useEffect, useCallback, useRef } from 'react';
import {
	BidDto,
	AuctionStats,
	BiddingState,
	PlaceBidRequest,
} from '@/types/auction';
import { biddingSignalRService } from '@/lib/bidding-signalr-service';
import { apiClient } from '@/lib/api-client';

interface UseBiddingOptions {
	auctionId: string;
	autoConnect?: boolean;
	loadInitialData?: boolean;
}

export function useBidding({
	auctionId,
	autoConnect = true,
	loadInitialData = true,
}: UseBiddingOptions) {
	const [state, setState] = useState<BiddingState>({
		bids: [],
		stats: {
			auctionId,
			highestBid: 0,
			bidCount: 0,
		},
		isLoading: true,
		error: null,
		isConnected: false,
		typingUsers: [],
	});

	const [isPlacingBid, setIsPlacingBid] = useState(false);
	const currentUserRef = useRef<string | null>(null);
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Initialize current user
	useEffect(() => {
		const userInfo = localStorage.getItem('userInfo');
		if (userInfo) {
			try {
				const user = JSON.parse(userInfo);
				currentUserRef.current = user.userId;
			} catch (error) {
				console.error('Error parsing user info:', error);
			}
		}
	}, []);

	// Fetch initial data
	const fetchInitialData = useCallback(async () => {
		if (!loadInitialData) return;

		try {
			setState((prev) => ({ ...prev, isLoading: true, error: null }));

			// Fetch bids and stats in parallel
			const [bidsResponse, statsResponse] = await Promise.all([
				apiClient.getAuctionBids(auctionId, 1, 50),
				apiClient.getAuctionStats(auctionId),
			]);

			setState((prev) => ({
				...prev,
				bids: bidsResponse.data || [],
				stats: statsResponse || prev.stats,
				isLoading: false,
			}));
		} catch (error) {
			console.error('Error fetching initial bidding data:', error);
			setState((prev) => ({
				...prev,
				error: 'Failed to load bidding data',
				isLoading: false,
			}));
		}
	}, [auctionId, loadInitialData]);

	// Setup SignalR event handlers
	useEffect(() => {
		const handleBidPlaced = (bid: BidDto) => {
			setState((prev) => ({
				...prev,
				bids: [bid, ...prev.bids].sort(
					(a, b) =>
						new Date(b.timestamp).getTime() -
						new Date(a.timestamp).getTime()
				),
			}));
		};

		const handleBidConfirmed = (bid: BidDto) => {
			setState((prev) => ({
				...prev,
				bids: [bid, ...prev.bids.filter((b) => b.id !== bid.id)].sort(
					(a, b) =>
						new Date(b.timestamp).getTime() -
						new Date(a.timestamp).getTime()
				),
			}));
		};

		const handleStatsUpdated = (stats: AuctionStats) => {
			setState((prev) => ({
				...prev,
				stats: { ...prev.stats, ...stats },
			}));
		};

		const handleUserTyping = (data: { UserId: string, UserName: string, AuctionId: string, IsTyping: boolean }) => {
			// Don't show typing indicator for current user
			if (data.UserId === currentUserRef.current) return;

			setState((prev) => ({
				...prev,
				typingUsers: data.IsTyping
					? [
							...prev.typingUsers.filter((id) => id !== data.UserId),
							data.UserId,
					  ]
					: prev.typingUsers.filter((id) => id !== data.UserId),
			}));
		};

		// Register event handlers
		biddingSignalRService.on('BidPlaced', handleBidPlaced);
		biddingSignalRService.on('BidConfirmed', handleBidConfirmed);
		biddingSignalRService.on('AuctionStatsUpdated', handleStatsUpdated);
		biddingSignalRService.on('UserTyping', handleUserTyping);

		return () => {
			// Cleanup event handlers
			biddingSignalRService.off('BidPlaced');
			biddingSignalRService.off('BidConfirmed');
			biddingSignalRService.off('AuctionStatsUpdated');
			biddingSignalRService.off('UserTyping');
		};
	}, []);

	// Connection management
	useEffect(() => {
		let mounted = true;

		const connectAndJoin = async () => {
			if (!autoConnect) return;

			try {
				const connected = await biddingSignalRService.connect();

				if (!mounted) return;

				if (connected) {
					const joined = await biddingSignalRService.joinAuctionRoom(
						auctionId
					);
					setState((prev) => ({ ...prev, isConnected: joined }));

					if (joined) {
						await fetchInitialData();
					}
				} else {
					setState((prev) => ({
						...prev,
						isConnected: false,
						error: 'Failed to connect to real-time service',
					}));
				}
			} catch (error) {
				console.error('Error connecting to bidding service:', error);
				if (mounted) {
					setState((prev) => ({
						...prev,
						isConnected: false,
						error: 'Connection error',
					}));
				}
			}
		};

		connectAndJoin();

		return () => {
			mounted = false;
			biddingSignalRService.leaveAuctionRoom(auctionId);
		};
	}, [auctionId, autoConnect]);

	// Place bid function
	const placeBid = useCallback(
		async (amount: number): Promise<boolean> => {
			if (isPlacingBid) return false;

			setIsPlacingBid(true);
			setState((prev) => ({ ...prev, error: null }));

			try {
				// Optimistic update
				const optimisticBid: BidDto = {
					id: `temp-${Date.now()}`,
					auctionId,
					bidderId: currentUserRef.current || '',
					bidderName: 'You',
					amount,
					timestamp: new Date().toISOString(),
					isHighestBid: true,
				};

				setState((prev) => ({
					...prev,
					bids: [optimisticBid, ...prev.bids],
					stats: {
						...prev.stats,
						highestBid: amount,
						bidCount: prev.stats.bidCount + 1,
					},
				}));

				// Send bid to server
				const connectionId = biddingSignalRService.connectionId;
				await apiClient.placeBid(
					auctionId,
					amount,
					connectionId || undefined
				);

				return true;
			} catch (error: any) {
				console.error('Error placing bid:', error);

				// Revert optimistic update
				setState((prev) => ({
					...prev,
					bids: prev.bids.filter(
						(bid) => !bid.id.startsWith('temp-')
					),
					error:
						error.response?.data?.message || 'Failed to place bid',
				}));

				return false;
			} finally {
				setIsPlacingBid(false);
			}
		},
		[auctionId, isPlacingBid]
	);

	// Typing indicator
	const sendTypingIndicator = useCallback(
		(isTyping: boolean) => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}

			biddingSignalRService.sendTypingIndicator(auctionId, isTyping);

			if (isTyping) {
				// Auto-clear typing indicator after 3 seconds
				typingTimeoutRef.current = setTimeout(() => {
					biddingSignalRService.sendTypingIndicator(auctionId, false);
				}, 3000);
			}
		},
		[auctionId]
	);

	// Retry connection
	const retryConnection = useCallback(async () => {
		setState((prev) => ({ ...prev, error: null, isLoading: true }));

		try {
			const connected = await biddingSignalRService.connect();
			if (connected) {
				const joined = await biddingSignalRService.joinAuctionRoom(
					auctionId
				);
				setState((prev) => ({
					...prev,
					isConnected: joined,
					isLoading: false,
				}));

				if (joined) {
					await fetchInitialData();
				}
			}
		} catch (error) {
			setState((prev) => ({
				...prev,
				isConnected: false,
				isLoading: false,
				error: 'Retry failed',
			}));
		}
	}, [auctionId]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		};
	}, []);

	return {
		// State
		bids: state.bids,
		stats: state.stats,
		isLoading: state.isLoading,
		error: state.error,
		isConnected: state.isConnected,
		typingUsers: state.typingUsers,
		isPlacingBid,

		// Actions
		placeBid,
		sendTypingIndicator,
		retryConnection,

		// Utils
		connectionState: biddingSignalRService.connectionState,
		connectionId: biddingSignalRService.connectionId,
	};
}
