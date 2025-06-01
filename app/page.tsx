import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AuctionList } from '@/components/auction/auction-list'
import { Search, TrendingUp, Shield, Zap, Users, Clock } from 'lucide-react'

export default function Home() {
  const featuredCategories = [
    { name: 'Comics', href: '/categories/comics', count: '1,250+', image: '📚' },
    { name: 'Trading Cards', href: '/categories/trading-cards', count: '850+', image: '🃏' },
    { name: 'Action Figures', href: '/categories/action-figures', count: '690+', image: '🦸' },
    { name: 'Vintage Toys', href: '/categories/vintage-toys', count: '420+', image: '🧸' },
    { name: 'Gaming', href: '/categories/gaming', count: '380+', image: '🎮' },
    { name: 'Movies & TV', href: '/categories/movies-tv', count: '290+', image: '🎬' },
  ]

  const features = [
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'All payments are protected with escrow services and buyer protection.'
    },
    {
      icon: Zap,
      title: 'Real-time Bidding',
      description: 'Get instant notifications and bid in real-time with our live auction system.'
    },
    {
      icon: Users,
      title: 'Verified Sellers',
      description: 'All sellers go through verification to ensure authentic and quality items.'
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Access price histories and market trends to make informed decisions.'
    }
  ]

  const stats = [
    { value: '50K+', label: 'Active Collectors' },
    { value: '10K+', label: 'Items Sold Monthly' },
    { value: '$2M+', label: 'Total Sales Volume' },
    { value: '99%', label: 'Satisfaction Rate' }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              🎉 Over 10,000 new items listed this month
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Rare Pop Culture
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Collectibles
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              The premier auction marketplace where collectors buy, sell, and discover 
              authentic comics, trading cards, action figures, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50" asChild>
                <Link href="/auctions">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Auctions
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/sell">
                  Start Selling
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our most popular collectible categories with thousands of authentic items
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 text-center"
            >
              <div className="text-4xl mb-3">{category.image}</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{category.count} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Ending Soon</h2>
            <p className="text-gray-600">Don\'t miss out on these hot auctions</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/auctions?sort=ending-soon">
              <Clock className="mr-2 h-4 w-4" />
              View All
            </Link>
          </Button>
        </div>
        
        <AuctionList 
          limit={8} 
          showFilters={false}
          featured={true}
        />
      </section>

      {/* Features Section */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Vault?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the safest, most transparent platform for collectible trading
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Collectors Worldwide</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Join thousands of collectors who trust Vault for their buying and selling needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Collecting?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join our community of collectors and discover your next treasure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
              <Link href="/auth/register">
                Create Free Account
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/auctions">
                Start Browsing
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
