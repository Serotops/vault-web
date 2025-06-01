// Application constants and configuration

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7001/api',
  SIGNALR_URL: process.env.NEXT_PUBLIC_SIGNALR_HUB_URL || 'https://localhost:7001/auctionhub',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Auction Configuration
export const AUCTION_CONFIG = {
  MIN_BID_INCREMENT: 0.05,
  MAX_TITLE_LENGTH: 80,
  MAX_DESCRIPTION_LENGTH: 5000,
  MAX_IMAGES_PER_AUCTION: 12,
  MIN_AUCTION_DURATION: 1, // days
  MAX_AUCTION_DURATION: 30, // days
  AUTO_EXTEND_THRESHOLD: 300, // seconds (5 minutes)
  AUTO_EXTEND_DURATION: 600, // seconds (10 minutes)
};

// Pagination Configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  SEARCH_PAGE_SIZE: 24,
  USER_AUCTIONS_PAGE_SIZE: 10,
  NOTIFICATIONS_PAGE_SIZE: 15,
};

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_REFRESH_THRESHOLD: 300, // seconds (5 minutes before expiry)
  SESSION_TIMEOUT: 3600, // seconds (1 hour)
  REMEMBER_ME_DURATION: 2592000, // seconds (30 days)
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 900, // seconds (15 minutes)
};

// Validation Rules
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: true,
  },
  BID: {
    MIN_AMOUNT: 0.01,
    MAX_AMOUNT: 1000000,
    DECIMAL_PLACES: 2,
  },
};

// Image Configuration
export const IMAGE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  THUMBNAIL_SIZE: { width: 300, height: 300 },
  PREVIEW_SIZE: { width: 800, height: 600 },
};

// UI Configuration
export const UI_CONFIG = {
  TOAST_DURATION: 5000,
  LOADING_DELAY: 500,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 1000,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
};

// Cache Configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: 300, // seconds (5 minutes)
  USER_DATA_TTL: 600, // seconds (10 minutes)
  STATIC_DATA_TTL: 3600, // seconds (1 hour)
  SEARCH_RESULTS_TTL: 180, // seconds (3 minutes)
  AUCTION_DATA_TTL: 60, // seconds (1 minute for active auctions)
};

// Feature Flags
export const FEATURES = {
  AUTO_BID: true,
  BUY_NOW: true,
  WATCH_LIST: true,
  NOTIFICATIONS: true,
  LIVE_CHAT: false, // Coming soon
  MOBILE_APP: false, // Coming soon
  INTERNATIONAL_SHIPPING: true,
  SELLER_VERIFICATION: true,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUCTION_ENDED: 'This auction has already ended.',
  BID_TOO_LOW: 'Your bid must be higher than the current bid.',
  INSUFFICIENT_FUNDS: 'Insufficient funds for this bid.',
  RATE_LIMITED: 'Too many requests. Please wait and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_FORMAT: 'Invalid file format. Please use JPEG, PNG, or WebP.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  BID_PLACED: 'Your bid has been placed successfully!',
  AUCTION_CREATED: 'Your auction has been created successfully!',
  PROFILE_UPDATED: 'Your profile has been updated successfully!',
  PASSWORD_CHANGED: 'Your password has been changed successfully!',
  EMAIL_VERIFIED: 'Your email has been verified successfully!',
  ITEM_ADDED_TO_WATCHLIST: 'Item added to your watchlist!',
  ITEM_REMOVED_FROM_WATCHLIST: 'Item removed from your watchlist!',
  MESSAGE_SENT: 'Your message has been sent successfully!',
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  AUCTIONS: '/auctions',
  AUCTION_DETAIL: '/auctions/[id]',
  SEARCH: '/search',
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: '/categories/[slug]',
  USER_PROFILE: '/user/[id]',
  MY_PROFILE: '/profile',
  MY_AUCTIONS: '/profile/auctions',
  MY_BIDS: '/profile/bids',
  MY_WATCHLIST: '/profile/watchlist',
  MY_NOTIFICATIONS: '/profile/notifications',
  SETTINGS: '/profile/settings',
  CREATE_AUCTION: '/sell',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  TERMS: '/legal/terms',
  PRIVACY: '/legal/privacy',
  HELP: '/help',
  CONTACT: '/contact',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth-token',
  REFRESH_TOKEN: 'refresh-token',
  AUTH_USER: 'auth-user',
  SEARCH_HISTORY: 'search-history',
  THEME_PREFERENCE: 'theme-preference',
  LANGUAGE_PREFERENCE: 'language-preference',
  NOTIFICATION_SETTINGS: 'notification-settings',
  RECENTLY_VIEWED: 'recently-viewed',
} as const;

// WebSocket Events
export const SIGNALR_EVENTS = {
  BID_RECEIVED: 'BidReceived',
  AUCTION_ENDED: 'AuctionEnded',
  NOTIFICATION_RECEIVED: 'NotificationReceived',
  USER_COUNT_UPDATED: 'UserCountUpdated',
  CONNECTION_COUNT_UPDATED: 'ConnectionCountUpdated',
  AUCTION_UPDATED: 'AuctionUpdated',
} as const;
