'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Heart, Clock, Eye, Gavel, Share2, Flag, ChevronLeft, ChevronRight, User, Package, Shield, MessageCircle, TrendingUp } from 'lucide-react'
import { Auction, Bid } from '@/types/auction'
import { User as UserType } from '@/types/user'
import { cn } from '@/lib/utils'
import { formatCurrency, formatTimeRemaining, formatDate } from '@/lib/utils-extended'
import { useSignalR } from '@/hooks/use-signalr'
import { RealTimeBidding } from './real-time-bidding'

interface AuctionDetailProps {
  auction: Auction
  seller: UserType
  bids: Bid[]
  className?: string
}

export function AuctionDetail({ auction, seller, bids, className }: AuctionDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWatched, setIsWatched] = useState(false)

  const timeRemaining = formatTimeRemaining(auction.endTime)
  const isEndingSoon = new Date(auction.endTime).getTime() - Date.now() < 24 * 60 * 60 * 1000
  const isActive = auction.status === 'active'

  const handlePreviousImage = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? (auction.images?.length || 1) - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    setCurrentImageIndex(prev =>
      prev === (auction.images?.length || 1) - 1 ? 0 : prev + 1
    )
  }

  const handleBidSubmit = async () => {
    if (!bidAmount || isSubmittingBid) return

    const amount = parseFloat(bidAmount)
    if (amount < minimumBid) {
      alert(`Minimum bid is ${formatCurrency(minimumBid)}`)
      return
    }

    setIsSubmittingBid(true)
    try {
      // TODO: Implement bid submission
      console.log('Submitting bid:', amount)
      // await submitBid(auction.id, amount)
    } catch (error) {
      console.error('Failed to submit bid:', error)
      alert('Failed to submit bid. Please try again.')
    } finally {
      setIsSubmittingBid(false)
    }
  }

  const handleBuyNow = async () => {
    if (!auction.buyNowPrice) return

    try {
      // TODO: Implement buy now
      console.log('Buy now clicked')
      // await buyNow(auction.id)
    } catch (error) {
      console.error('Failed to buy now:', error)
      alert('Failed to complete purchase. Please try again.')
    }
  }

  const handleWatchToggle = () => {
    setIsWatched(!isWatched)
    // TODO: Call API to update watch status
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'mint':
        return 'bg-green-100 text-green-800'
      case 'near-mint':
        return 'bg-emerald-100 text-emerald-800'
      case 'excellent':
        return 'bg-blue-100 text-blue-800'
      case 'very-good':
        return 'bg-yellow-100 text-yellow-800'
      case 'good':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={cn("max-w-7xl mx-auto p-6", className)}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {auction.images?.[currentImageIndex] && (
              <Image
                src={auction.images?.[currentImageIndex]?.url || ''}
                alt={auction.images?.[currentImageIndex]?.alt || auction.title}
                fill
                className="object-cover"
                priority
              />
            )}

            {(auction.images?.length || 0) > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={handlePreviousImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            {(auction.images?.length || 0) > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {currentImageIndex + 1} / {auction.images?.length || 0}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {(auction.images?.length || 0) > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {(auction.images || []).map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "relative flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden",
                    index === currentImageIndex ? "border-blue-500" : "border-gray-200"
                  )}
                >
                  <Image
                    src={image.thumbnailUrl || image.url}
                    alt={image.alt || `${auction.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Auction Info */}
        <div className="space-y-6">
          {/* Title and Actions */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{auction.title}</h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleWatchToggle}>
                  <Heart className={cn("h-4 w-4", isWatched && "fill-red-500 text-red-500")} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="capitalize">
                {auction.category.replace('-', ' ')}
              </Badge>
              <Badge className={getConditionColor(auction.condition)} variant="secondary">
                {auction.condition.replace('-', ' ')}
              </Badge>
              <Badge variant={isActive ? "default" : "secondary"}>
                {auction.status}
              </Badge>
            </div>
          </div>

          {/* Pricing and Bidding */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Bid</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(auction.currentBid)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Time Remaining</p>
                <p className={cn(
                  "text-lg font-semibold",
                  isEndingSoon ? "text-orange-600" : "text-gray-900"
                )}>
                  <Clock className="inline h-4 w-4 mr-1" />
                  {timeRemaining}
                </p>
              </div>
            </div>

            {auction.buyNowPrice && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Buy It Now Price</p>
                <p className="text-xl font-bold text-blue-600 mb-3">
                  {formatCurrency(auction.buyNowPrice)}
                </p>
                <Button
                  onClick={handleBuyNow}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Buy It Now
                </Button>
              </div>
            )}

          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center mb-1">
                <Gavel className="h-4 w-4 mr-1 text-gray-600" />
              </div>
              <p className="text-lg font-semibold">{auction.bidCount}</p>
              <p className="text-sm text-gray-600">Bids</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <Eye className="h-4 w-4 mr-1 text-gray-600" />
              </div>
              <p className="text-lg font-semibold">{auction.watchers}</p>
              <p className="text-sm text-gray-600">Watchers</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <MessageCircle className="h-4 w-4 mr-1 text-gray-600" />
              </div>
              <p className="text-lg font-semibold">0</p>
              <p className="text-sm text-gray-600">Questions</p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Seller Information</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <Link href={`/user/${seller.id}`} className="font-medium hover:text-blue-600">
                  {seller.username}
                </Link>
                <p className="text-sm text-gray-600">
                  Member since {formatDate(seller.joinDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>Verified Seller</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                <span>Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{auction.description}</p>
            </div>
          </div>

        </div>

        {/* Real-Time Bidding */}
        <div className="xl:col-span-1">
          <RealTimeBidding
            auctionId={auction.id}
            currentBid={auction.currentBid}
            minimumBidIncrement={1}
            endTime={auction.endTime}
          />
        </div>
      </div>

      {/* Additional Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping and Details */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Shipping Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Domestic:</span>
                <span>{formatCurrency(auction.shippingInfo.domestic)}</span>
              </div>
              {auction.shippingInfo.international && (
                <div className="flex justify-between">
                  <span>International:</span>
                  <span>{formatCurrency(auction.shippingInfo.international)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Handling time:</span>
                <span>{auction.shippingInfo.handlingTime}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Item Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Starting bid:</span>
                <span>{formatCurrency(auction.startingBid)}</span>
              </div>
              <div className="flex justify-between">
                <span>Started:</span>
                <span>{formatDate(auction.startTime)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ends:</span>
                <span>{formatDate(auction.endTime)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Information */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Seller Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{seller.username}</p>
                  <p className="text-sm text-gray-600">Member since {formatDate(seller.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>98% positive feedback</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Seller
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Trust & Safety</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Verified seller</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-600" />
                <span>Fast shipping guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
