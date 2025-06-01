// Custom hooks for UI state management and common functionality

import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce, throttle } from '@/lib/utils-extended';

// Hook for managing search functionality with debouncing
export const useSearch = (initialQuery = '', delay = 300) => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Create debounced function using useCallback to prevent recreation
  const debouncedSetQuery = useCallback(
    debounce((value: string) => setDebouncedQuery(value), delay),
    [delay]
  );

  useEffect(() => {
    debouncedSetQuery(query);
    
    // Cleanup function to cancel pending debounced calls
    return () => {
      debouncedSetQuery.cancel?.();
    };
  }, [query, debouncedSetQuery]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  return {
    query,
    debouncedQuery,
    setQuery,
    clearSearch,
    isSearching: query !== debouncedQuery,
  };
};

// Hook for managing pagination state
export const usePagination = (initialPage = 1, initialPageSize = 20) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, page));
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const previousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    goToPage,
    nextPage,
    previousPage,
    resetPagination,
  };
};

// Hook for managing sort state
export const useSort = (initialField?: string, initialDirection: 'asc' | 'desc' = 'asc') => {
  const [sortField, setSortField] = useState<string | undefined>(initialField);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialDirection);

  const handleSort = useCallback((field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with default direction
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const clearSort = useCallback(() => {
    setSortField(undefined);
    setSortDirection('asc');
  }, []);

  return {
    sortField,
    sortDirection,
    handleSort,
    setSortField,
    setSortDirection,
    clearSort,
  };
};

// Hook for managing filter state
export const useFilters = <T extends Record<string, any>>(initialFilters: T) => {
  const [filters, setFilters] = useState<T>(initialFilters);

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<T>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilter = useCallback(<K extends keyof T>(key: K) => {
    setFilters(prev => {
      const { [key]: _, ...rest } = prev;
      return rest as T;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const hasActiveFilters = useCallback(() => {
    return Object.keys(filters).some(key => {
      const value = filters[key];
      const initialValue = initialFilters[key];
      return value !== initialValue && value !== undefined && value !== '' && value !== null;
    });
  }, [filters, initialFilters]);

  return {
    filters,
    updateFilter,
    updateFilters,
    clearFilter,
    clearAllFilters,
    hasActiveFilters: hasActiveFilters(),
  };
};

// Hook for managing modal/dialog state
export const useModal = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};

// Hook for managing loading states
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);

  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    try {
      startLoading();
      return await asyncFn();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
};

// Hook for managing countdown timers
export const useCountdown = (targetDate: Date | null) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateTimeLeft = useCallback(() => {
    if (!targetDate) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isExpired: false };
  }, [targetDate]);

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      return;
    }

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    // Set up interval
    intervalRef.current = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Clear interval if expired
      if (newTimeLeft.isExpired && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [targetDate, calculateTimeLeft]);

  return timeLeft;
};

// Hook for managing local storage with serialization
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
  };
};

// Hook for managing window size
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 100);

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
