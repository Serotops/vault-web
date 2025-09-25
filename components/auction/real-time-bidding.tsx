'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Gavel, 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  Users,
  Loader2,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { useBidding } from '@/hooks/use-bidding';
import { formatCurrency, formatTimeRemaining } from '@/lib/utils-extended';
import { cn } from '@/lib/utils';

interface RealTimeBiddingProps {
  auctionId: string;
  currentBid: number;
  minimumBidIncrement?: number;
  endTime: Date;
  className?: string;
}

export function RealTimeBidding({ 
  auctionId, 
  currentBid: initialCurrentBid, 
  minimumBidIncrement = 1,
  endTime,
  className 
}: RealTimeBiddingProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bidListRef = useRef<HTMLDivElement>(null);

  const {
    bids,
    stats,
    isLoading,
    error,
    isConnected,
    typingUsers,
    isPlacingBid,
    placeBid,
    sendTypingIndicator,
    retryConnection,
    connectionState
  } = useBidding({ auctionId });

  const currentBid = Math.max(stats.highestBid, initialCurrentBid);
  const minimumBid = currentBid + minimumBidIncrement;
  const timeRemaining = formatTimeRemaining(endTime);
  const isAuctionEnded = new Date() > endTime;

  // Auto-scroll to latest bids
  useEffect(() => {
    if (bidListRef.current && bids.length > 0) {
      bidListRef.current.scrollTop = 0;
    }
  }, [bids]);

  // Auto-fill minimum bid
  useEffect(() => {
    if (!bidAmount) {
      setBidAmount(minimumBid.toString());
    }
  }, [minimumBid, bidAmount]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < minimumBid) {
      return;
    }

    const success = await placeBid(amount);
    if (success) {
      setShowSuccess(true);
      setBidAmount((minimumBid + minimumBidIncrement).toString());
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBidAmount(e.target.value);
    sendTypingIndicator(true);
  };

  const handleInputBlur = () => {
    sendTypingIndicator(false);
  };

  const getConnectionStatusColor = () => {
    if (isConnected) return 'text-green-500';
    if (connectionState === 'Reconnecting') return 'text-yellow-500';
    return 'text-red-500';
  };

  const getConnectionStatusIcon = () => {
    if (isConnected) return <Wifi className="h-4 w-4" />;
    if (connectionState === 'Reconnecting') return <Loader2 className="h-4 w-4 animate-spin" />;
    return <WifiOff className="h-4 w-4" />;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Connection Status & Stats */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Live Auction</CardTitle>
            <div className="flex items-center gap-2">
              <div className={cn("flex items-center gap-1 text-sm", getConnectionStatusColor())}>
                {getConnectionStatusIcon()}
                <span className="hidden sm:inline">
                  {isConnected ? 'Connected' : connectionState}
                </span>
              </div>
              {!isConnected && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryConnection}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auction Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(currentBid)}
              </div>
              <div className="text-sm text-gray-500">Current Bid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.bidCount}
              </div>
              <div className="text-sm text-gray-500">Total Bids</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {timeRemaining}
              </div>
              <div className="text-sm text-gray-500">Time Left</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {typingUsers.length}
              </div>
              <div className="text-sm text-gray-500">Active Bidders</div>
            </div>
          </div>

          {/* Typing Indicators */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                {typingUsers.length === 1 
                  ? 'Someone is preparing to bid...' 
                  : `${typingUsers.length} people are preparing to bid...`
                }
              </span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bid Placement Form */}
      {!isAuctionEnded && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Place Your Bid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="bidAmount" className="text-sm font-medium">
                  Bid Amount (minimum: {formatCurrency(minimumBid)})
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    ref={inputRef}
                    id="bidAmount"
                    type="number"
                    min={minimumBid}
                    step="0.01"
                    value={bidAmount}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder={minimumBid.toString()}
                    className="pl-10"
                    disabled={isPlacingBid || !isConnected}
                    required
                  />
                </div>
                {parseFloat(bidAmount) > 0 && parseFloat(bidAmount) < minimumBid && (
                  <p className="text-sm text-red-600">
                    Bid must be at least {formatCurrency(minimumBid)}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  isPlacingBid || 
                  !isConnected || 
                  parseFloat(bidAmount) < minimumBid ||
                  isNaN(parseFloat(bidAmount))
                }
              >
                {isPlacingBid ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Placing Bid...
                  </>
                ) : (
                  <>
                    <Gavel className="h-4 w-4 mr-2" />
                    Place Bid {bidAmount ? formatCurrency(parseFloat(bidAmount)) : ''}
                  </>
                )}
              </Button>
            </form>

            {/* Success Message */}
            {showSuccess && (
              <Alert className="mt-4 border-green-200 bg-green-50">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your bid has been placed successfully!
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Auction Ended Notice */}
      {isAuctionEnded && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            This auction has ended. No more bids can be placed.
          </AlertDescription>
        </Alert>
      )}

      {/* Bid History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bid History</span>
            <Badge variant="secondary">{bids.length} bids</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && bids.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading bids...</span>
            </div>
          ) : bids.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Gavel className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bids yet. Be the first to bid!</p>
            </div>
          ) : (
            <div 
              ref={bidListRef}
              className="space-y-3 max-h-80 overflow-y-auto"
            >
              {bids.map((bid, index) => (
                <div
                  key={bid.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    index === 0 && bid.isHighestBid 
                      ? "bg-green-50 border-green-200" 
                      : "bg-gray-50 border-gray-200",
                    bid.id.startsWith('temp-') && "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      index === 0 && bid.isHighestBid
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    )}>
                      #{bids.length - index}
                    </div>
                    <div>
                      <div className="font-medium">
                        {bid.bidderName}
                        {index === 0 && bid.isHighestBid && (
                          <Badge className="ml-2 text-xs bg-green-100 text-green-700">
                            Highest
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(bid.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "font-bold",
                      index === 0 && bid.isHighestBid ? "text-green-600" : "text-gray-900"
                    )}>
                      {formatCurrency(bid.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}