'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Star, 
  MessageCircle, 
  Flag, 
  Shield, 
  Calendar, 
  MapPin, 
  Award,
  Heart
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserProfileHeaderProps {
  user: {
    id: string
    username: string
    displayName?: string
    avatar?: string
    rating: number
    totalReviews: number
    totalSales: number
    totalPurchases: number
    memberSince: string
    location?: string
    bio?: string
    isVerified?: boolean
    badges?: string[]
    lastActive?: string
  }
  isOwnProfile?: boolean
  className?: string
}

// Mock user data
const mockUser = {
  id: '1',
  username: 'CollectorPro92',
  displayName: 'Mike Chen',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  rating: 4.9,
  totalReviews: 247,
  totalSales: 156,
  totalPurchases: 89,
  memberSince: '2019-03-15',
  location: 'San Francisco, CA',
  bio: 'Passionate collector of vintage comics and action figures. Specializing in Marvel and DC collectibles from the 80s and 90s. All items carefully stored and authenticated.',
  isVerified: true,
  badges: ['Power Seller', 'Top Rated', 'Fast Shipper'],
  lastActive: '2024-01-15T10:30:00Z'
}

export function UserProfileHeader({ 
  user = mockUser, 
  isOwnProfile = false, 
  className 
}: UserProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const memberSinceDate = new Date(user.memberSince)
  const lastActiveDate = user.lastActive ? new Date(user.lastActive) : null
  const yearsActive = new Date().getFullYear() - memberSinceDate.getFullYear()

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // TODO: Implement follow/unfollow API call
  }

  const handleMessage = () => {
    // TODO: Implement messaging functionality
    console.log('Send message to user:', user.id)
  }

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log('Report user:', user.id)
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-500">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {user.displayName || user.username}
                </h1>
                {user.isVerified && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-600 mb-2">@{user.username}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < Math.floor(user.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                <span className="font-semibold">{user.rating}</span>
                <span className="text-gray-600">({user.totalReviews} reviews)</span>
              </div>

              {/* Badges */}
              {user.badges && user.badges.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {user.badges.map((badge) => (
                    <Badge key={badge} variant="outline" className="text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {memberSinceDate.getFullYear()}</span>
                </div>
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {lastActiveDate && (
                  <div className="flex items-center gap-1">
                    <span>Last active {lastActiveDate.toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats and Actions */}
          <div className="lg:w-80 flex flex-col gap-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user.totalSales}</div>
                <div className="text-sm text-gray-600">Sales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{user.totalPurchases}</div>
                <div className="text-sm text-gray-600">Purchases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{yearsActive}+</div>
                <div className="text-sm text-gray-600">Years</div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            {!isOwnProfile && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleFollow} className="flex-1">
                  <Heart className={cn('w-4 h-4 mr-2', isFollowing && 'fill-current')} />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button variant="outline" onClick={handleMessage} className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReport}>
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            )}

            {isOwnProfile && (
              <div className="flex gap-2">
                <Button className="flex-1">
                  Edit Profile
                </Button>
                <Button variant="outline" className="flex-1">
                  Settings
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <>
            <Separator className="my-6" />
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
