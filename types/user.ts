// User and authentication types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isVerified: boolean;
  rating: UserRating;
  joinDate: Date;
  lastActive: Date;
  preferences: UserPreferences;
}

export interface UserRating {
  positive: number;
  neutral: number;
  negative: number;
  totalFeedback: number;
  percentage: number;
}

export interface UserPreferences {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  bidding: BiddingSettings;
}

export interface NotificationSettings {
  email: {
    outbid: boolean;
    auctionEnding: boolean;
    auctionWon: boolean;
    watchlistUpdates: boolean;
    messages: boolean;
  };
  push: {
    outbid: boolean;
    auctionEnding: boolean;
    auctionWon: boolean;
  };
}

export interface PrivacySettings {
  showBiddingHistory: boolean;
  showWatchlist: boolean;
  allowMessages: boolean;
}

export interface BiddingSettings {
  autoBidEnabled: boolean;
  maxAutoBidAmount: number;
  bidIncrements: number[];
}

// Authentication types
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

// Placeholder for additional user-related types
export interface UserProfile {
  // TODO: Define user profile types
}

export interface UserActivity {
  // TODO: Define user activity types
}
