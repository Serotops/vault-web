// General utility functions and helpers

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind CSS class merging utility (already exists in utils.ts but documenting here)
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Date formatting utilities
export const dateUtils = {
	formatDate: (date: Date | string): string => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	},

	formatDateTime: (date: Date | string): string => {
		return new Date(date).toLocaleString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	},

	formatTimeAgo: (date: Date | string): string => {
		const now = new Date();
		const past = new Date(date);
		const diffInSeconds = Math.floor(
			(now.getTime() - past.getTime()) / 1000
		);

		if (diffInSeconds < 60) return 'just now';
		if (diffInSeconds < 3600)
			return `${Math.floor(diffInSeconds / 60)}m ago`;
		if (diffInSeconds < 86400)
			return `${Math.floor(diffInSeconds / 3600)}h ago`;
		if (diffInSeconds < 2592000)
			return `${Math.floor(diffInSeconds / 86400)}d ago`;
		if (diffInSeconds < 31536000)
			return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
		return `${Math.floor(diffInSeconds / 31536000)}y ago`;
	},

	isToday: (date: Date | string): boolean => {
		const today = new Date();
		const checkDate = new Date(date);
		return (
			today.getDate() === checkDate.getDate() &&
			today.getMonth() === checkDate.getMonth() &&
			today.getFullYear() === checkDate.getFullYear()
		);
	},
};

// String utilities
export const stringUtils = {
	truncate: (str: string, length: number): string => {
		if (str.length <= length) return str;
		return str.slice(0, length) + '...';
	},

	capitalizeFirst: (str: string): string => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	},

	capitalizeWords: (str: string): string => {
		return str.replace(
			/\w\S*/g,
			(txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
		);
	},

	slugify: (str: string): string => {
		return str
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
	},

	removeHtml: (str: string): string => {
		return str.replace(/<[^>]*>/g, '');
	},
};

// Number utilities
export const numberUtils = {
	formatNumber: (num: number): string => {
		return new Intl.NumberFormat('en-US').format(num);
	},

	formatCompactNumber: (num: number): string => {
		return new Intl.NumberFormat('en-US', {
			notation: 'compact',
			maximumFractionDigits: 1,
		}).format(num);
	},

	clamp: (value: number, min: number, max: number): number => {
		return Math.min(Math.max(value, min), max);
	},

	roundToDecimals: (num: number, decimals: number): number => {
		return (
			Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
		);
	},
};

// Array utilities
export const arrayUtils = {
	chunk: <T>(array: T[], size: number): T[][] => {
		const chunks: T[][] = [];
		for (let i = 0; i < array.length; i += size) {
			chunks.push(array.slice(i, i + size));
		}
		return chunks;
	},

	unique: <T>(array: T[]): T[] => {
		return [...new Set(array)];
	},

	uniqueBy: <T>(array: T[], key: keyof T): T[] => {
		const seen = new Set();
		return array.filter((item) => {
			const value = item[key];
			if (seen.has(value)) return false;
			seen.add(value);
			return true;
		});
	},

	groupBy: <T>(array: T[], key: keyof T): Record<string, T[]> => {
		return array.reduce((groups, item) => {
			const group = String(item[key]);
			groups[group] = groups[group] || [];
			groups[group].push(item);
			return groups;
		}, {} as Record<string, T[]>);
	},
};

// URL utilities
export const urlUtils = {
	buildQueryString: (params: Record<string, any>): string => {
		const searchParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				searchParams.append(key, String(value));
			}
		});
		return searchParams.toString();
	},

	parseQueryString: (search: string): Record<string, string> => {
		const params = new URLSearchParams(search);
		const result: Record<string, string> = {};
		params.forEach((value, key) => {
			result[key] = value;
		});
		return result;
	},
};

// Local storage utilities with error handling
export const storageUtils = {
	setItem: (key: string, value: any): boolean => {
		try {
			if (typeof window === 'undefined') return false;
			localStorage.setItem(key, JSON.stringify(value));
			return true;
		} catch {
			return false;
		}
	},

	getItem: <T>(key: string, defaultValue?: T): T | null => {
		try {
			if (typeof window === 'undefined') return defaultValue ?? null;
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : defaultValue ?? null;
		} catch {
			return defaultValue ?? null;
		}
	},

	removeItem: (key: string): boolean => {
		try {
			if (typeof window === 'undefined') return false;
			localStorage.removeItem(key);
			return true;
		} catch {
			return false;
		}
	},
};

// Debounce utility with cancel method
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
	let timeout: NodeJS.Timeout;

	const debouncedFunction = (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};

	debouncedFunction.cancel = () => {
		clearTimeout(timeout);
	};

	return debouncedFunction;
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle: boolean;

	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
}

// Export individual utility functions for easier imports
export const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(amount);
};

export const formatTimeRemaining = (endTime: Date | string): string => {
	const now = new Date();
	const end = new Date(endTime);
	const diff = end.getTime() - now.getTime();

	if (diff <= 0) return 'Ended';

	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

	if (days > 0) return `${days}d ${hours}h`;
	if (hours > 0) return `${hours}h ${minutes}m`;
	return `${minutes}m`;
};

export const formatDate = dateUtils.formatDate;
export const formatDateTime = dateUtils.formatDateTime;
export const formatTimeAgo = dateUtils.formatTimeAgo;
