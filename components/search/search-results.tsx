'use client'

import { useState } from 'react'
import { AuctionCard } from '@/components/auction/auction-card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Grid, List, Filter, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Auction } from '@/types/auction'

interface SearchResultsProps {
  searchParams: {
    q?: string
    category?: string
    condition?: string
    minPrice?: string
    maxPrice?: string
    page?: string
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
  }
  className?: string
}

// Mock search results data
const mockSearchResults: Auction[] = [
  {
    id: '1',
    title: 'Spider-Man #1 CGC 9.8',
    description: 'Amazing Spider-Man #1 graded CGC 9.8. Near mint condition.',
    currentBid: 2500.00,
    buyNowPrice: 3500.00,
    startingBid: 1000.00,
    bidCount: 15,
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    category: 'comics' as const,
    condition: 'near-mint' as const,
    images: [
      {
        id: 'img1',
        url: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=200&h=200&fit=crop',
        order: 0,
        alt: 'Spider-Man comic cover'
      }
    ],
    sellerId: 'seller1',
    watchers: 156,
    status: 'active' as const,
    shippingInfo: {
      domestic: 15.00,
      handlingTime: '1-3 business days',
      shipsTo: ['United States', 'Canada']
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  }, {
    id: '2',
    title: 'Batman: The Dark Knight Returns #1',
    description: 'First print Batman: The Dark Knight Returns #1. Excellent condition.',
    category: 'comics',
    condition: 'very-fine',
    startingBid: 200.00,
    currentBid: 450.00,
    buyNowPrice: 650.00,
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 1.5 * 24 * 60 * 60 * 1000),
    sellerId: 'seller2',
    status: 'active',
    images: [
      {
        id: 'img2',
        url: 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=400&h=400&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=200&h=200&fit=crop',
        order: 0,
        alt: 'Batman comic cover'
      }
    ],
    bidCount: 8,
    watchers: 89,
    shippingInfo: {
      domestic: 12.00,
      international: 35.00,
      handlingTime: '1-2 business days',
      shipsTo: ['United States', 'Canada', 'United Kingdom']
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
  // Add more mock results as needed
]

export function SearchResults({ searchParams, className }: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const query = searchParams.q || ''
  const totalResults = mockSearchResults.length
  const currentPage = parseInt(searchParams.page || '1')
  const resultsPerPage = 20

  const activeFilters = [
    searchParams.category && { key: 'category', value: searchParams.category },
    searchParams.condition && { key: 'condition', value: searchParams.condition },
    (searchParams.minPrice || searchParams.maxPrice) && {
      key: 'price',
      value: `$${searchParams.minPrice || '0'} - $${searchParams.maxPrice || '∞'}`
    }
  ].filter(Boolean) as Array<{ key: string; value: string }>

  const handleRemoveFilter = (filterKey: string) => {
    // TODO: Implement filter removal logic
    console.log('Remove filter:', filterKey)
  }

  const handleClearAllFilters = () => {
    // TODO: Implement clear all filters logic
    console.log('Clear all filters')
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Results Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {totalResults.toLocaleString()} results for \"{query}\"
          </h2>
          <p className="text-gray-600 mt-1">
            Page {currentPage} of {Math.ceil(totalResults / resultsPerPage)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <Select defaultValue="relevance">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="ending-soon">Ending Soon</SelectItem>
              <SelectItem value="newly-listed">Newly Listed</SelectItem>
              <SelectItem value="most-bids">Most Bids</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter.key} variant="secondary" className="flex items-center gap-1">
              {filter.value}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveFilter(filter.key)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Search Results Grid/List */}
      {mockSearchResults.length > 0 ? (
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          )}
        >
          {mockSearchResults.map((auction) => (<AuctionCard
            key={auction.id}
            auction={auction}
          />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters
          </p>
          <Button variant="outline">
            Clear all filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {mockSearchResults.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled={currentPage === 1}>
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, Math.ceil(totalResults / resultsPerPage)) }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  className="w-10 h-10"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button variant="outline" disabled={currentPage >= Math.ceil(totalResults / resultsPerPage)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
