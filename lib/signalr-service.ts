import * as signalR from '@microsoft/signalr';

export class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection() {
    const hubUrl = process.env.NEXT_PUBLIC_SIGNALR_HUB_URL || 'https://localhost:7001/auctionhub';
    
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        // TODO: Add auth token when available
        accessTokenFactory: () => this.getAuthToken() || ''
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff: 2s, 4s, 8s, 16s, 30s
          const delays = [2000, 4000, 8000, 16000, 30000];
          return delays[Math.min(retryContext.previousRetryCount, delays.length - 1)];
        }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.connection) return;

    this.connection.onreconnecting(() => {
      console.log('SignalR: Attempting to reconnect...');
    });

    this.connection.onreconnected(() => {
      console.log('SignalR: Reconnected successfully');
      this.reconnectAttempts = 0;
    });

    this.connection.onclose((error) => {
      console.log('SignalR: Connection closed', error);
      this.handleConnectionClosed();
    });
  }

  private getAuthToken(): string | null {
    // TODO: Get auth token from auth context or localStorage
    return null;
  }

  private handleConnectionClosed() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.start(), 5000 * this.reconnectAttempts);
    }
  }

  async start(): Promise<void> {
    if (!this.connection || this.isConnecting) return;

    try {
      this.isConnecting = true;
      await this.connection.start();
      console.log('SignalR: Connected successfully');
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('SignalR: Failed to start connection', error);
      this.handleConnectionClosed();
    } finally {
      this.isConnecting = false;
    }
  }

  async stop(): Promise<void> {
    if (!this.connection) return;

    try {
      await this.connection.stop();
      console.log('SignalR: Disconnected');
    } catch (error) {
      console.error('SignalR: Error during disconnect', error);
    }
  }

  // Auction-related methods
  async joinAuctionGroup(auctionId: string): Promise<void> {
    if (!this.connection) return;
    
    try {
      await this.connection.invoke('JoinAuctionGroup', auctionId);
      console.log(`SignalR: Joined auction group ${auctionId}`);
    } catch (error) {
      console.error('SignalR: Failed to join auction group', error);
    }
  }

  async leaveAuctionGroup(auctionId: string): Promise<void> {
    if (!this.connection) return;
    
    try {
      await this.connection.invoke('LeaveAuctionGroup', auctionId);
      console.log(`SignalR: Left auction group ${auctionId}`);
    } catch (error) {
      console.error('SignalR: Failed to leave auction group', error);
    }
  }

  // Event subscription methods
  onBidReceived(callback: (auctionId: string, bidData: any) => void): void {
    this.connection?.on('BidReceived', callback);
  }

  onAuctionEnded(callback: (auctionId: string, result: any) => void): void {
    this.connection?.on('AuctionEnded', callback);
  }

  onNotificationReceived(callback: (notification: any) => void): void {
    this.connection?.on('NotificationReceived', callback);
  }

  onUserCountUpdated(callback: (auctionId: string, count: number) => void): void {
    this.connection?.on('UserCountUpdated', callback);
  }

  // Cleanup method
  removeAllListeners(): void {
    this.connection?.off('BidReceived');
    this.connection?.off('AuctionEnded');
    this.connection?.off('NotificationReceived');
    this.connection?.off('UserCountUpdated');
  }

  // Connection state
  get connectionState(): signalR.HubConnectionState {
    return this.connection?.state || signalR.HubConnectionState.Disconnected;
  }

  get isConnected(): boolean {
    return this.connectionState === signalR.HubConnectionState.Connected;
  }
}

// Export singleton instance
export const signalRService = new SignalRService();
export default signalRService;
