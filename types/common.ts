// API response types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: ApiError[];
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// SignalR message types
export interface SignalRMessage {
  type: string;
  payload: any;
  timestamp: Date;
}

export interface BidMessage extends SignalRMessage {
  type: 'bid';
  payload: {
    auctionId: string;
    bidAmount: number;
    bidderId: string;
    bidderName: string;
    timestamp: Date;
  };
}

export interface AuctionEndMessage extends SignalRMessage {
  type: 'auction-end';
  payload: {
    auctionId: string;
    winnerId?: string;
    winningBid?: number;
    status: string;
  };
}

export interface NotificationMessage extends SignalRMessage {
  type: 'notification';
  payload: {
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    actionUrl?: string;
  };
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;  isDirty: boolean;
  isValid: boolean;
}

// User notification interface
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

// Placeholder for additional common types
export interface SearchFilters {
  // TODO: Define search filter types
}

export interface AppConfig {
  // TODO: Define app configuration types
}
