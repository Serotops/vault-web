'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Clock, Eye, Gavel } from 'lucide-react'
import { Auction } from '@/types/auction'
import { cn } from '@/lib/utils'
import { formatCurrency, formatTimeRemaining } from '@/lib/utils-extended'

interface AuctionCardProps {
  auction: Auction
  className?: string
  onWatchToggle?: (auctionId: string, isWatched: boolean) => void
  isWatched?: boolean
}

export function AuctionCard({ 
  auction, 
  className, 
  onWatchToggle,
  isWatched = false 
}: AuctionCardProps) {
  const [isWatchedState, setIsWatchedState] = useState(isWatched)
  const [isImageLoading, setIsImageLoading] = useState(true)

  const primaryImage = auction.images?.[0]
  const timeRemaining = formatTimeRemaining(auction.endTime)
  const isEndingSoon = new Date(auction.endTime).getTime() - Date.now() < 24 * 60 * 60 * 1000

  const handleWatchToggle = () => {
    const newWatchedState = !isWatchedState
    setIsWatchedState(newWatchedState)
    onWatchToggle?.(auction.id, newWatchedState)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'ending-soon':
        return 'bg-orange-100 text-orange-800'
      case 'ended':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className={cn(
      "group relative bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200",
      className
    )}>
      {/* Watch Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-white/80 hover:bg-white"
        onClick={handleWatchToggle}
      >
        <Heart 
          className={cn(
            "h-4 w-4",
            isWatchedState ? "fill-red-500 text-red-500" : "text-gray-600"
          )} 
        />
      </Button>

      {/* Image Section */}
      <Link href={`/auctions/${auction.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || auction.title}
              fill
              className={cn(
                "object-cover transition-opacity duration-200",
                isImageLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsImageLoading(false)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          
          {/* Status Badge */}
          <Badge 
            className={cn(
              "absolute top-2 left-2",
              getStatusColor(auction.status)
            )}
            variant="secondary"
          >
            {auction.status}
          </Badge>

          {/* Buy Now Badge */}
          {auction.buyNowPrice && (
            <Badge className="absolute bottom-2 left-2 bg-blue-600 text-white">
              Buy Now Available
            </Badge>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4">
        <Link href={`/auctions/${auction.id}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
            {auction.title}
          </h3>
        </Link>

        <div className="space-y-2 mb-3">
          {/* Category and Condition */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Badge variant="outline" className="text-xs">
              {auction.category}
            </Badge>
            <span>•</span>
            <span className="capitalize">{auction.condition}</span>
          </div>

          {/* Current Bid */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Bid</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(auction.currentBid)}
              </p>
            </div>
            {auction.buyNowPrice && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Buy Now</p>
                <p className="text-md font-semibold text-blue-600">
                  {formatCurrency(auction.buyNowPrice)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Gavel className="h-4 w-4" />
              <span>{auction.bidCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{auction.watchers}</span>
            </div>
          </div>
          
          <div className={cn(
            "flex items-center gap-1",
            isEndingSoon && "text-orange-600 font-medium"
          )}>
            <Clock className="h-4 w-4" />
            <span>{timeRemaining}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/auctions/${auction.id}`}>
              View Details
            </Link>
          </Button>
          {auction.status === 'active' && (
            <Button variant="outline" asChild>
              <Link href={`/auctions/${auction.id}#bid`}>
                Place Bid
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
