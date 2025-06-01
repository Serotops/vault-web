'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchSortProps {
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  onSortChange?: (sortBy: string, sortDirection: 'asc' | 'desc') => void
  className?: string
}

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price', label: 'Price' },
  { value: 'endTime', label: 'Ending Soon' },
  { value: 'createdAt', label: 'Newly Listed' },
  { value: 'bidCount', label: 'Most Bids' },
  { value: 'watchers', label: 'Most Watched' },
  { value: 'seller.rating', label: 'Seller Rating' },
  { value: 'title', label: 'Title (A-Z)' }
]

export function SearchSort({ 
  sortBy = 'relevance', 
  sortDirection = 'desc', 
  onSortChange,
  className 
}: SearchSortProps) {
  const handleSortByChange = (newSortBy: string) => {
    // Default direction based on sort type
    const defaultDirection = newSortBy === 'title' ? 'asc' : 'desc'
    const direction = newSortBy === sortBy ? sortDirection : defaultDirection
    onSortChange?.(newSortBy, direction)
  }

  const handleDirectionToggle = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc'
    onSortChange?.(sortBy, newDirection)
  }

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy)
    return option ? option.label : 'Most Relevant'
  }

  const canToggleDirection = sortBy !== 'relevance'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm font-medium text-gray-700 hidden sm:block">
        Sort by:
      </span>
      
      <div className="flex items-center gap-1">
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-40">
            <SelectValue>
              {getSortLabel()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {canToggleDirection && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDirectionToggle}
            className="h-10 w-10 p-0"
            title={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortDirection === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {sortBy !== 'relevance' && (
        <div className="text-xs text-gray-500 hidden md:block">
          {sortDirection === 'asc' ? 'Low to High' : 'High to Low'}
        </div>
      )}
    </div>
  )
}
