'use client'

import { useState } from 'react'
import { AuctionCard } from '@/components/auction/auction-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Auction } from '@/types/auction'

interface UserAuctionsProps {
  userId: string
  isOwnProfile?: boolean
  className?: string
}

// Mock auction data
const mockAuctions: Auction[] = [
  {
    id: '1',
    title: 'Amazing Spider-Man #1 CGC 9.8',
    description: 'Pristine condition Amazing Spider-Man #1',
    currentBid: 2500.00,
    buyNowPrice: 3500.00,
    startingBid: 1000.00,
    bidCount: 15,
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    sellerId: 'seller1',
    category: 'comics',
    condition: 'near-mint',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=150&h=150&fit=crop',
        order: 0,
        alt: 'Amazing Spider-Man #1 CGC 9.8'
      }
    ],
    status: 'active',
    watchers: 12,
    shippingInfo: {
      domestic: 15.00,
      international: 35.00,
      handlingTime: '1-2 business days',
      shipsTo: ['US', 'CA', 'UK']
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: '2',
    title: 'Batman: The Dark Knight Returns #1',
    description: 'First print Batman DKR #1',
    currentBid: 450.00,
    buyNowPrice: 650.00,
    startingBid: 200.00,
    bidCount: 8,
    startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    sellerId: 'seller1',
    category: 'comics',
    condition: 'very-fine',
    images: [
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=400&h=400&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=150&h=150&fit=crop',
        order: 0,
        alt: 'Batman: The Dark Knight Returns #1'
      }
    ],
    status: 'sold',
    watchers: 5,
    shippingInfo: {
      domestic: 12.00,
      international: 28.00,
      handlingTime: '1-2 business days',
      shipsTo: ['US', 'CA']
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
]

export function UserAuctions({ userId: _userId, isOwnProfile = false, className }: UserAuctionsProps) {
  const [sortBy, setSortBy] = useState('newest')
  const [filterStatus, setFilterStatus] = useState('all')

  // Filter auctions based on status
  const filteredAuctions = mockAuctions.filter(auction => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'active') return auction.status === 'active'
    if (filterStatus === 'sold') return auction.status === 'sold'
    if (filterStatus === 'unsold') return auction.status === 'ended'
    return true
  })

  // Sort auctions
  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
      case 'oldest':
        return new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
      case 'price-high':
        return b.currentBid - a.currentBid
      case 'price-low':
        return a.currentBid - b.currentBid
      case 'most-bids':
        return b.bidCount - a.bidCount
      default:
        return 0
    }
  })

  const _getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'sold':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'ended':
        return <XCircle className="w-4 h-4 text-gray-600" />
      default:
        return <Package className="w-4 h-4 text-gray-600" />
    }
  }

  const _getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-700'
      case 'sold':
        return 'bg-green-100 text-green-700'
      case 'ended':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const activeCount = mockAuctions.filter(a => a.status === 'active').length
  const soldCount = mockAuctions.filter(a => a.status === 'sold').length
  const endedCount = mockAuctions.filter(a => a.status === 'ended').length

  return (
    <div className={cn('space-y-6', className)}>
      {isOwnProfile ? (
        <Tabs defaultValue="active" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="active" className="relative">
                Active
                {activeCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 min-w-5 text-xs">
                    {activeCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="sold" className="relative">
                Sold
                {soldCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 min-w-5 text-xs">
                    {soldCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="ended" className="relative">
                Ended
                {endedCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 min-w-5 text-xs">
                    {endedCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="drafts">
                Drafts
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-high">Highest Price</SelectItem>
                  <SelectItem value="price-low">Lowest Price</SelectItem>
                  <SelectItem value="most-bids">Most Bids</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="active">
            <AuctionGrid auctions={sortedAuctions.filter(a => a.status === 'active')} />
          </TabsContent>

          <TabsContent value="sold">
            <AuctionGrid auctions={sortedAuctions.filter(a => a.status === 'sold')} />
          </TabsContent>

          <TabsContent value="ended">
            <AuctionGrid auctions={sortedAuctions.filter(a => a.status === 'ended')} />
          </TabsContent>

          <TabsContent value="drafts">
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No draft auctions</h3>
              <p className="text-gray-600 mb-6">Start creating your next auction listing</p>
              <Button>Create New Auction</Button>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Auctions ({mockAuctions.length})</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="unsold">Ended</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-high">Highest Price</SelectItem>
                    <SelectItem value="price-low">Lowest Price</SelectItem>
                    <SelectItem value="most-bids">Most Bids</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AuctionGrid auctions={sortedAuctions} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function AuctionGrid({ auctions }: { auctions: Auction[] }) {
  if (auctions.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No auctions found</h3>
        <p className="text-gray-600">No auctions match the current filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {auctions.map((auction) => (
        <div key={auction.id} className="relative">
          <AuctionCard auction={auction} />
          <Badge 
            className={cn(
              'absolute top-2 right-2 flex items-center gap-1',
              auction.status === 'active' ? 'bg-blue-100 text-blue-700' :
              auction.status === 'sold' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            )}
          >
            {auction.status === 'active' && <Clock className="w-3 h-3" />}
            {auction.status === 'sold' && <CheckCircle className="w-3 h-3" />}
            {auction.status === 'ended' && <XCircle className="w-3 h-3" />}
            {auction.status === 'active' ? 'Active' : 
             auction.status === 'sold' ? 'Sold' : 'Ended'}
          </Badge>
        </div>
      ))}
    </div>
  )
}
