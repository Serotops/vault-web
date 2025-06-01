'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Grid, List, SortAsc } from 'lucide-react'
import { AuctionCard } from './auction-card'
import { useAuctions } from '@/hooks/use-auctions'
import { AuctionCategory, AuctionStatus } from '@/types/auction'
import { cn } from '@/lib/utils'

interface AuctionFilters {
  search: string
  category: AuctionCategory | 'all'
  status: AuctionStatus | 'all'
  condition: string | 'all'
  priceRange: {
    min: number | null
    max: number | null
  }
  sortBy: 'ending-soon' | 'price-low' | 'price-high' | 'newest' | 'most-bids'
}

interface AuctionListProps {
  className?: string
  showFilters?: boolean
  limit?: number
  featured?: boolean
}

const defaultFilters: AuctionFilters = {
  search: '',
  category: 'all',
  status: 'all',
  condition: 'all',
  priceRange: { min: null, max: null },
  sortBy: 'ending-soon'
}

export function AuctionList({ 
  className, 
  showFilters = true, 
  limit,
  featured: _featured = false 
}: AuctionListProps) {
  const [filters, setFilters] = useState<AuctionFilters>(defaultFilters)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [watchedAuctions, setWatchedAuctions] = useState<Set<string>>(new Set())
  const { 
    auctions, 
    isLoading, 
    error, 
    mutate 
  } = useAuctions({
    category: filters.category !== 'all' ? filters.category : undefined,
    status: filters.status !== 'all' ? filters.status : undefined,
    condition: filters.condition !== 'all' ? filters.condition : undefined,
    search: filters.search || undefined,
    minPrice: filters.priceRange.min || undefined,
    maxPrice: filters.priceRange.max || undefined,
    sortBy: filters.sortBy,
    pageSize: limit
  })

  const handleFilterChange = (key: keyof AuctionFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleWatchToggle = async (auctionId: string, isWatched: boolean) => {
    const newWatchedAuctions = new Set(watchedAuctions)
    if (isWatched) {
      newWatchedAuctions.add(auctionId)
    } else {
      newWatchedAuctions.delete(auctionId)
    }
    setWatchedAuctions(newWatchedAuctions)
    
    // TODO: Call API to update watch status
    try {
      // await watchAuction(auctionId, isWatched)
      mutate() // Refresh the data
    } catch (error) {
      console.error('Failed to update watch status:', error)
      // Revert the state change
      setWatchedAuctions(watchedAuctions)
    }
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
  }

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value.length > 0
    if (key === 'priceRange') return value.min !== null || value.max !== null
    return value !== 'all' && value !== defaultFilters[key as keyof AuctionFilters]
  }).length

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load auctions</p>
        <Button onClick={() => mutate()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            {/* Search and View Toggle */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search auctions..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="comics">Comics</SelectItem>
                  <SelectItem value="trading-cards">Trading Cards</SelectItem>
                  <SelectItem value="action-figures">Action Figures</SelectItem>
                  <SelectItem value="collectibles">Collectibles</SelectItem>
                  <SelectItem value="vintage-toys">Vintage Toys</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="movies-tv">Movies & TV</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.condition} onValueChange={(value) => handleFilterChange('condition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="mint">Mint</SelectItem>
                  <SelectItem value="near-mint">Near Mint</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="very-good">Very Good</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger>
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="most-bids">Most Bids</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters and Clear */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                </Badge>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Section */}
      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: limit || 12 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg aspect-square animate-pulse" />
            ))}
          </div>
        ) : auctions?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No auctions found matching your criteria</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          )}>
            {auctions?.map((auction) => (
              <AuctionCard
                key={auction.id}
                auction={auction}
                onWatchToggle={handleWatchToggle}
                isWatched={watchedAuctions.has(auction.id)}
                className={viewMode === 'list' ? 'flex flex-row' : ''}
              />
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {auctions && auctions.length > 0 && !limit && (
        <div className="text-center">
          <Button variant="outline" onClick={() => {
            // TODO: Implement pagination
            console.log('Load more auctions')
          }}>
            Load More Auctions
          </Button>
        </div>
      )}
    </div>
  )
}
