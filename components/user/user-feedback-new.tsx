'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Shield, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserFeedbackProps {
  userId: string
  className?: string
}

interface Feedback {
  id: string
  type: 'buyer' | 'seller'
  rating: number
  comment: string
  date: string
  reviewer: {
    id: string
    username: string
    avatar?: string
    isVerified?: boolean
  }
  transaction: {
    id: string
    itemTitle: string
    amount: number
  }
  helpful: number
  reported: boolean
}

// Mock feedback data
const mockFeedback: Feedback[] = [
  {
    id: '1',
    type: 'seller',
    rating: 5,
    comment: 'Excellent seller! Item was exactly as described and shipped quickly. Great communication throughout.',
    date: '2024-01-15T10:30:00Z',
    reviewer: {
      id: 'buyer1',
      username: 'comic_fan_87',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      isVerified: true
    },
    transaction: {
      id: 'tx1',
      itemTitle: 'Amazing Spider-Man #1 CGC 9.8',
      amount: 2500.00
    },
    helpful: 12,
    reported: false
  },
  {
    id: '2',
    type: 'seller',
    rating: 4,
    comment: 'Good experience overall. Item arrived safely and was well packaged. Minor delay in shipping but seller communicated well.',
    date: '2024-01-10T14:20:00Z',
    reviewer: {
      id: 'buyer2',
      username: 'vintage_collector',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isVerified: false
    },
    transaction: {
      id: 'tx2',
      itemTitle: 'Batman: The Dark Knight Returns #1',
      amount: 450.00
    },
    helpful: 8,
    reported: false
  },
  {
    id: '3',
    type: 'buyer',
    rating: 5,
    comment: 'Great buyer! Fast payment and excellent communication. Would definitely do business again.',
    date: '2024-01-08T09:15:00Z',
    reviewer: {
      id: 'seller1',
      username: 'rare_finds_shop',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isVerified: true
    },
    transaction: {
      id: 'tx3',
      itemTitle: 'Vintage Star Wars Action Figure Set',
      amount: 890.00
    },
    helpful: 5,
    reported: false
  }
]

export function UserFeedback({ userId: _userId, className }: UserFeedbackProps) {
  const [sortBy, setSortBy] = useState('newest')
  const [filterRating, setFilterRating] = useState('all')

  // Calculate rating statistics
  const totalReviews = mockFeedback.length
  const averageRating = mockFeedback.reduce((sum, f) => sum + f.rating, 0) / totalReviews
  const ratingBreakdown = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: mockFeedback.filter(f => f.rating === rating).length,
    percentage: (mockFeedback.filter(f => f.rating === rating).length / totalReviews) * 100
  }))

  const sellerFeedback = mockFeedback.filter(f => f.type === 'seller')
  const buyerFeedback = mockFeedback.filter(f => f.type === 'buyer')

  // Filter and sort feedback
  const filterFeedback = (feedback: Feedback[]) => {
    let filtered = feedback
    
    if (filterRating !== 'all') {
      const rating = parseInt(filterRating)
      filtered = filtered.filter(f => f.rating === rating)
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        case 'helpful':
          return b.helpful - a.helpful
        default:
          return 0
      }
    })
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Rating Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-5 h-5',
                      i < Math.floor(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <p className="text-gray-600">{totalReviews} reviews</p>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {ratingBreakdown.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">
              All ({totalReviews})
            </TabsTrigger>
            <TabsTrigger value="as-seller">
              As Seller ({sellerFeedback.length})
            </TabsTrigger>
            <TabsTrigger value="as-buyer">
              As Buyer ({buyerFeedback.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
                <SelectItem value="lowest">Lowest Rating</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all">
          <FeedbackList feedback={filterFeedback(mockFeedback)} />
        </TabsContent>

        <TabsContent value="as-seller">
          <FeedbackList feedback={filterFeedback(sellerFeedback)} />
        </TabsContent>

        <TabsContent value="as-buyer">
          <FeedbackList feedback={filterFeedback(buyerFeedback)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FeedbackList({ feedback }: { feedback: Feedback[] }) {
  const _formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const _formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (feedback.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No feedback found</h3>
        <p className="text-gray-600">No feedback matches the current filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Reviewer Info */}
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={item.reviewer.avatar} alt={item.reviewer.username} />
                  <AvatarFallback>
                    {item.reviewer.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{item.reviewer.username}</p>
                    {item.reviewer.isVerified && (
                      <Shield className="w-4 h-4 text-blue-600" />
                    )}
                    <Badge variant={item.type === 'seller' ? 'default' : 'secondary'}>
                      {item.type === 'seller' ? 'Buyer' : 'Seller'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{_formatDate(item.date)}</p>
                </div>
              </div>

              {/* Feedback Content */}
              <div className="flex-1">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-4 h-4',
                          i < item.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{item.rating}/5</span>
                </div>

                {/* Transaction Info */}
                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">{item.transaction.itemTitle}</span>
                  <span className="mx-2">•</span>
                  <span>{_formatCurrency(item.transaction.amount)}</span>
                </div>

                {/* Comment */}
                <p className="text-gray-900 mb-4">{item.comment}</p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Helpful ({item.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      Not helpful
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <Flag className="w-4 h-4 mr-1" />
                    Report
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
