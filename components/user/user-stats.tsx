'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Star, 
  Clock,
  Award,
  Target,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserStatsProps {
  userId: string
  className?: string
}

// Mock user statistics
const mockStats = {
  totalRevenue: 45320.50,
  totalSales: 156,
  totalPurchases: 89,
  totalBids: 342,
  winRate: 78,
  averageSalePrice: 290.65,
  averagePurchasePrice: 245.30,
  quickShipRate: 95,
  responseTime: '< 2 hours',
  completionRate: 99.2,
  repeatCustomers: 34,
  currentStreak: 23,
  achievements: [
    { name: 'Power Seller', icon: Award, description: '100+ successful sales' },
    { name: 'Fast Shipper', icon: Zap, description: '95%+ items shipped within 24h' },
    { name: 'Top Rated', icon: Star, description: '4.8+ average rating' },
    { name: 'Perfect Month', icon: Target, description: '100% feedback in a month' }
  ],
  categoryBreakdown: [
    { category: 'Comics', sales: 67, percentage: 43 },
    { category: 'Action Figures', sales: 34, percentage: 22 },
    { category: 'Trading Cards', sales: 28, percentage: 18 },
    { category: 'Posters', sales: 15, percentage: 10 },
    { category: 'Other', sales: 12, percentage: 7 }
  ],
  monthlyTrend: [
    { month: 'Jan', sales: 12, revenue: 3480 },
    { month: 'Feb', sales: 15, revenue: 4250 },
    { month: 'Mar', sales: 18, revenue: 5120 },
    { month: 'Apr', sales: 14, revenue: 3890 },
    { month: 'May', sales: 22, revenue: 6340 },
    { month: 'Jun', sales: 19, revenue: 5580 }
  ]
}

export function UserStats({ userId: _userId, className }: UserStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value}%`
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold">{formatCurrency(mockStats.totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-xl font-bold">{mockStats.totalSales}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Win Rate</p>
                <p className="text-xl font-bold">{formatPercentage(mockStats.winRate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Response Time</p>
                <p className="text-xl font-bold">{mockStats.responseTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm text-gray-600">{mockStats.completionRate}%</span>
              </div>
              <Progress value={mockStats.completionRate} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Quick Ship Rate</span>
                <span className="text-sm text-gray-600">{mockStats.quickShipRate}%</span>
              </div>
              <Progress value={mockStats.quickShipRate} className="h-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{mockStats.averageSalePrice.toFixed(0)}</p>
              <p className="text-sm text-gray-600">Avg Sale Price</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{mockStats.repeatCustomers}</p>
              <p className="text-sm text-gray-600">Repeat Customers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{mockStats.currentStreak}</p>
              <p className="text-sm text-gray-600">Current Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{mockStats.totalBids}</p>
              <p className="text-sm text-gray-600">Total Bids</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockStats.achievements.map((achievement) => (
              <div key={achievement.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <achievement.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">{achievement.name}</p>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStats.categoryBreakdown.map((category) => (
              <div key={category.category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{category.category}</span>
                  <span className="text-sm text-gray-600">
                    {category.sales} sales ({category.percentage}%)
                  </span>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Trends */}
      <Card>
        <CardHeader>
          <CardTitle>6-Month Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStats.monthlyTrend.map((month) => (
              <div key={month.month} className="flex items-center justify-between py-2">
                <span className="font-medium">{month.month}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">{month.sales} sales</span>
                  <span className="font-semibold">{formatCurrency(month.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
