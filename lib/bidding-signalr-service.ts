import { BidDto, AuctionStats, SignalRBidEvents } from '@/types/auction';

export class BiddingSignalRService {
	private connection: any = null;
	private eventHandlers: Partial<SignalRBidEvents> = {};
	private currentAuctionId: string | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private isConnecting = false;
	private signalR: any = null;

	constructor() {
		// Only initialize on client side
		if (typeof window !== 'undefined') {
			this.initializeSignalR();
		}
	}

	private async initializeSignalR() {
		try {
			// Dynamic import to ensure client-side only
			this.signalR = await import('@microsoft/signalr');
			this.setupConnection();
		} catch (error) {
			console.error('Failed to initialize SignalR:', error);
		}
	}

	private setupConnection() {
		if (!this.signalR || typeof window === 'undefined') {
			console.warn('SignalR not available or not on client side');
			return;
		}

		const apiUrl =
			process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7298/api/v1';
		const hubUrl = `${apiUrl.replace('/api/v1', '')}/biddingHub`;

		this.connection = new this.signalR.HubConnectionBuilder()
			.withUrl(hubUrl, {
				accessTokenFactory: () => {
					if (typeof window !== 'undefined') {
						return localStorage.getItem('accessToken') || '';
					}
					return '';
				},
				withCredentials: false,
			})
			.withAutomaticReconnect({
				nextRetryDelayInMilliseconds: (retryContext) => {
					// Exponential backoff: 0, 2, 10, 30 seconds
					const delays = [0, 2000, 10000, 30000];
					return delays[retryContext.previousRetryCount] || 30000;
				},
			})
			.configureLogging(this.signalR.LogLevel.Information)
			.build();

		this.setupEventHandlers();
		this.setupConnectionEvents();
	}

	private setupEventHandlers() {
		if (!this.connection) return;

		// Handle incoming bids from other users
		this.connection.on('BidPlaced', (bid: BidDto) => {
			console.log('🔥 New bid received:', bid);
			this.eventHandlers.BidPlaced?.(bid);
		});

		// Handle confirmation of your own bid
		this.connection.on('BidConfirmed', (bid: BidDto) => {
			console.log('✅ Bid confirmed:', bid);
			this.eventHandlers.BidConfirmed?.(bid);
		});

		// Handle auction statistics updates
		this.connection.on('AuctionStatsUpdated', (stats: AuctionStats) => {
			console.log('📊 Auction stats updated:', stats);
			this.eventHandlers.AuctionStatsUpdated?.(stats);
		});

		// Handle typing indicators
		this.connection.on(
			'UserTyping',
			(userId: string, isTyping: boolean) => {
				console.log('⌨️ User typing:', userId, isTyping);
				this.eventHandlers.UserTyping?.(userId, isTyping);
			}
		);
	}

	private setupConnectionEvents() {
		if (!this.connection) return;

		this.connection.onclose((error) => {
			console.log('❌ SignalR connection closed:', error);
			this.isConnecting = false;
		});

		this.connection.onreconnecting((error) => {
			console.log('🔄 SignalR reconnecting:', error);
			this.isConnecting = true;
		});

		this.connection.onreconnected((connectionId) => {
			console.log('✅ SignalR reconnected:', connectionId);
			this.isConnecting = false;
			this.reconnectAttempts = 0;

			// Rejoin auction room if we were in one
			if (this.currentAuctionId) {
				this.joinAuctionRoom(this.currentAuctionId);
			}
		});
	}

	async connect(): Promise<boolean> {
		if (!this.signalR || typeof window === 'undefined') {
			console.warn('SignalR not available or not on client side');
			return false;
		}

		if (!this.connection) {
			this.setupConnection();
		}

		if (
			this.connection?.state === this.signalR.HubConnectionState.Connected
		) {
			return true;
		}

		if (this.isConnecting) {
			return false;
		}

		try {
			this.isConnecting = true;
			await this.connection?.start();
			console.log('✅ SignalR connected successfully');
			this.reconnectAttempts = 0;
			return true;
		} catch (error) {
			console.error('❌ SignalR connection failed:', error);
			this.isConnecting = false;
			this.reconnectAttempts++;

			if (this.reconnectAttempts < this.maxReconnectAttempts) {
				console.log(
					`🔄 Retrying connection (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
				);
				setTimeout(() => this.connect(), 2000 * this.reconnectAttempts);
			}

			return false;
		}
	}

	async disconnect(): Promise<void> {
		if (this.currentAuctionId) {
			await this.leaveAuctionRoom(this.currentAuctionId);
		}

		try {
			await this.connection?.stop();
			console.log('🔌 SignalR disconnected');
		} catch (error) {
			console.error('❌ Error disconnecting SignalR:', error);
		}
	}

	async joinAuctionRoom(auctionId: string): Promise<boolean> {
		if (
			!this.signalR ||
			!this.connection ||
			this.connection.state !== this.signalR.HubConnectionState.Connected
		) {
			console.warn('⚠️ Cannot join auction room - not connected');
			return false;
		}

		try {
			await this.connection.invoke('JoinAuctionRoom', auctionId);
			this.currentAuctionId = auctionId;
			console.log(`🏠 Joined auction room: ${auctionId}`);
			return true;
		} catch (error) {
			console.error('❌ Error joining auction room:', error);
			return false;
		}
	}

	async leaveAuctionRoom(auctionId: string): Promise<boolean> {
		if (
			!this.signalR ||
			!this.connection ||
			this.connection.state !== this.signalR.HubConnectionState.Connected
		) {
			return false;
		}

		try {
			await this.connection.invoke('LeaveAuctionRoom', auctionId);
			if (this.currentAuctionId === auctionId) {
				this.currentAuctionId = null;
			}
			console.log(`🚪 Left auction room: ${auctionId}`);
			return true;
		} catch (error) {
			console.error('❌ Error leaving auction room:', error);
			return false;
		}
	}

	async sendTypingIndicator(
		auctionId: string,
		isTyping: boolean
	): Promise<void> {
		if (
			!this.signalR ||
			!this.connection ||
			this.connection.state !== this.signalR.HubConnectionState.Connected
		) {
			return;
		}

		try {
			await this.connection.invoke(
				'SendTypingIndicator',
				auctionId,
				isTyping
			);
		} catch (error) {
			console.error('❌ Error sending typing indicator:', error);
		}
	}

	// Event handler registration
	on<K extends keyof SignalRBidEvents>(
		event: K,
		handler: SignalRBidEvents[K]
	): void {
		this.eventHandlers[event] = handler;
	}

	off<K extends keyof SignalRBidEvents>(event: K): void {
		delete this.eventHandlers[event];
	}

	// Connection status
	get isConnected(): boolean {
		return (
			this.signalR &&
			this.connection?.state === this.signalR.HubConnectionState.Connected
		);
	}

	get connectionId(): string | null {
		return this.connection?.connectionId || null;
	}

	get connectionState(): any {
		if (!this.signalR) return 'Disconnected';
		return (
			this.connection?.state ||
			this.signalR.HubConnectionState.Disconnected
		);
	}
}

// Singleton instance
export const biddingSignalRService = new BiddingSignalRService();
