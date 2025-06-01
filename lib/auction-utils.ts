// Utility functions for auction-related operations

import { Auction, AuctionStatus, ItemCondition } from '@/types';

export const auctionUtils = {
  // Calculate time remaining for an auction
  getTimeRemaining: (endTime: Date): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  } => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isExpired: false };
  },

  // Format time remaining as string
  formatTimeRemaining: (endTime: Date): string => {
    const { days, hours, minutes, seconds, isExpired } = auctionUtils.getTimeRemaining(endTime);
    
    if (isExpired) return 'Auction ended';
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  },

  // Check if auction is active
  isAuctionActive: (auction: Auction): boolean => {
    const now = new Date();
    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);
    
    return auction.status === 'active' && now >= start && now <= end;
  },

  // Check if auction is ending soon (within 1 hour)
  isAuctionEndingSoon: (auction: Auction): boolean => {
    const now = new Date().getTime();
    const end = new Date(auction.endTime).getTime();
    const oneHour = 60 * 60 * 1000;
    
    return (end - now) <= oneHour && (end - now) > 0;
  },

  // Calculate next minimum bid
  getMinimumBid: (currentBid: number): number => {
    // Standard eBay-like bid increments
    if (currentBid < 1) return 0.05;
    if (currentBid < 5) return currentBid + 0.25;
    if (currentBid < 25) return currentBid + 0.50;
    if (currentBid < 100) return currentBid + 1;
    if (currentBid < 250) return currentBid + 2.50;
    if (currentBid < 500) return currentBid + 5;
    if (currentBid < 1000) return currentBid + 10;
    if (currentBid < 2500) return currentBid + 25;
    if (currentBid < 5000) return currentBid + 50;
    return currentBid + 100;
  },

  // Format currency
  formatCurrency: (amount: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  // Get condition color for UI
  getConditionColor: (condition: ItemCondition): string => {
    const colors = {
      'mint': 'text-green-600',
      'near-mint': 'text-green-500',
      'very-fine': 'text-blue-500',
      'fine': 'text-blue-400',
      'very-good': 'text-yellow-500',
      'good': 'text-yellow-600',
      'fair': 'text-orange-500',
      'poor': 'text-red-500',
    };
    return colors[condition] || 'text-gray-500';
  },

  // Get status color for UI
  getStatusColor: (status: AuctionStatus): string => {
    const colors = {
      'draft': 'text-gray-500',
      'scheduled': 'text-blue-500',
      'active': 'text-green-500',
      'ended': 'text-gray-600',
      'cancelled': 'text-red-500',
      'sold': 'text-purple-500',
    };
    return colors[status] || 'text-gray-500';
  },

  // Calculate auction progress percentage
  getAuctionProgress: (auction: Auction): number => {
    const now = new Date().getTime();
    const start = new Date(auction.startTime).getTime();
    const end = new Date(auction.endTime).getTime();
    
    if (now <= start) return 0;
    if (now >= end) return 100;
    
    return Math.round(((now - start) / (end - start)) * 100);
  },

  // Generate auction URL slug
  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  },
};
