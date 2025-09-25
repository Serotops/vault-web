  'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AuctionList } from '@/components/auction/auction-list'
import { Search, Star, Shield, Zap, Users, Clock, ChevronRight, Flame } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to /auctions
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/auctions');
    }
  }, [isAuthenticated, isLoading, router]);

  const [liveAuctionPulse, setLiveAuctionPulse] = useState(false)

  // Simulate live auction activity
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveAuctionPulse(true)
      setTimeout(() => setLiveAuctionPulse(false), 1000)    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const featuredCategories = [
    { name: 'Comics', href: '/categories/comics', count: '1,250+', image: '📚', trending: true },
    { name: 'Trading Cards', href: '/categories/trading-cards', count: '850+', image: '🃏', trending: true },
    { name: 'Action Figures', href: '/categories/action-figures', count: '690+', image: '🦸', trending: false },
    { name: 'Vintage Toys', href: '/categories/vintage-toys', count: '420+', image: '🧸', trending: false },
    { name: 'Gaming', href: '/categories/gaming', count: '380+', image: '🎮', trending: true },
    { name: 'Movies & TV', href: '/categories/movies-tv', count: '290+', image: '🎬', trending: false },
  ]

  const features = [
    {
      icon: Shield,
      title: 'Authenticated Items',
      description: 'Every item verified by our expert team and community.',
      accent: 'text-green-600 bg-green-50'
    },
    {
      icon: Zap,
      title: 'Live Bidding',
      description: 'Real-time auctions with instant notifications.',
      accent: 'text-yellow-600 bg-yellow-50'
    },
    {
      icon: Users,
      title: 'Collector Community',
      description: 'Connect with passionate collectors worldwide.',
      accent: 'text-purple-600 bg-purple-50'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section - More Editorial Style */}
      <section className="relative overflow-hidden bg-slate-900">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative container mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Flame className="h-4 w-4 text-orange-400" />
                  </motion.div>
                  <span className="text-sm font-medium">10,247 active auctions</span>
                </motion.div>

                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                    Where
                    <motion.span 
                      className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 1 }}
                    > collectors </motion.span>
                    find treasure
                  </h1>
                  <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
                    The underground marketplace for rare comics, vintage cards, and cult collectibles.
                    No corporate nonsense, just pure collecting passion.
                  </p>
                </motion.div>

                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8" asChild>
                    <Link href="/auctions">
                      Explore Vault
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="ghost" className="text-white border-white/30 hover:bg-white/10 text-lg px-8" asChild>
                    <Link href="/sell">
                      List Item
                    </Link>
                  </Button>
                </motion.div>                {/* Launch status */}
                <motion.div 
                  className="flex items-center gap-4 pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-green-400"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm text-slate-300">Coming Soon</span>
                  </div>
                  <div className="text-slate-300">
                    <p className="text-sm">Be among the first collectors</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Hero Visual */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
                  <div className="absolute top-4 left-4 flex gap-2">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-red-500"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-green-500"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>

                  <div className="mt-8 space-y-4">
                    <motion.div 
                      className="relative flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                      animate={liveAuctionPulse ? { 
                        scale: [1, 1.02, 1],
                        boxShadow: ["0 0 0 rgba(34, 197, 94, 0)", "0 0 20px rgba(34, 197, 94, 0.3)", "0 0 0 rgba(34, 197, 94, 0)"]
                      } : {}}
                      transition={{ duration: 1 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="text-2xl"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          🦸
                        </motion.div>
                        <div>
                          <p className="text-white font-semibold">Superman #1 (1939)</p>
                          <p className="text-slate-400 text-sm">CGC 6.0 • 2h 14m left</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <motion.p 
                          className="text-green-400 font-bold text-lg"
                          animate={liveAuctionPulse ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          $45,000
                        </motion.p>
                        <p className="text-slate-400 text-sm">23 bids</p>
                      </div>
                      {liveAuctionPulse && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.5, 0] }}
                          transition={{ duration: 1 }}
                        />
                      )}
                    </motion.div>

                    <motion.div 
                      className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="text-2xl"
                          whileHover={{ scale: 1.2, rotate: -5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          🃏
                        </motion.div>
                        <div>
                          <p className="text-white font-semibold">Charizard 1st Edition</p>
                          <p className="text-slate-400 text-sm">PSA 10 • 45m left</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold text-lg">$12,500</p>
                        <p className="text-slate-400 text-sm">67 bids</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="text-center pt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.6, duration: 0.6 }}
                    >
                      <Button variant="ghost" className="text-slate-400 hover:text-white" asChild>
                        <Link href="/auctions">
                          View all live auctions
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>              </motion.div>
            </div>
          </div>
        </div>
      </section>      {/* Featured Categories */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-3 text-base font-medium">
                ✨ Popular Collections
              </Badge>
            </motion.div>
            
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight">
              Explore by
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                Category
              </span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              From vintage comics to modern gaming collectibles—find your next treasure
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredCategories.map((category, index) => (              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.15, 
                  duration: 0.7,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -4 }}
                className="group"
              ><Link href={category.href}>
                  <div className="relative h-80 bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50 overflow-hidden transition-all duration-300 ease-out group-hover:shadow-xl group-hover:border-blue-300/50">
                    {/* Category Icon with Trending Badge Overlay */}
                    <motion.div 
                      className="relative z-10 text-center mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >                      <div className="relative inline-block">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-50 rounded-2xl mb-4 shadow-inner">
                          <span className="text-4xl filter drop-shadow-sm">{category.image}</span>
                        </div>
                        
                        {/* Trending Badge Overlapping the Icon */}
                        {category.trending && (
                          <motion.div 
                            className="absolute -top-2 -right-2 z-20"
                            initial={{ rotate: -12, scale: 0 }}
                            animate={{ 
                              rotate: [-12, -8, -12],
                              scale: [0.8, 1, 0.8]
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-bold shadow-lg border-2 border-white">
                              <Flame className="h-3 w-3" />
                              HOT
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    {/* Category Info */}
                    <div className="relative z-10 text-center">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {category.name}
                      </h3>
                      
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-1 w-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                        <span className="text-lg font-semibold text-slate-600">{category.count}</span>
                        <div className="h-1 w-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                      </div>

                      <p className="text-slate-500 text-sm leading-relaxed">
                        {index === 0 && "Rare issues, vintage editions, and first prints"}
                        {index === 1 && "PSA graded cards, rookie cards, and vintage sets"}
                        {index === 2 && "Collectible figures, statues, and character models"}
                        {index === 3 && "Classic toys, vintage games, and retro collectibles"}
                        {index === 4 && "Consoles, games, and gaming memorabilia"}
                        {index === 5 && "Movie props, posters, and TV show collectibles"}
                      </p>                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* View All Categories Button */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300"
                asChild
              >
                <Link href="/categories">
                  View All Categories
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">🔥 Ending Soon</h2>
              <p className="text-xl text-slate-600">Don't miss these high-value auctions</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="lg" asChild>
                <Link href="/auctions?sort=ending-soon">
                  <Clock className="mr-2 h-5 w-5" />
                  View All Live
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <AuctionList 
              limit={8} 
              showFilters={false}
              featured={true}
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-white/10 text-white border-white/20">
              ⚡ Platform Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Built for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400"> Collectors</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Every feature designed with collector trust, security, and experience in mind
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title} 
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <div className="relative p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all duration-300 h-full">
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${feature.accent}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    layoutId={`feature-bg-${index}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>      {/* CTA Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Main CTA Card */}
            <div className="relative bg-white rounded-3xl p-12 lg:p-16 shadow-2xl border border-slate-200 overflow-hidden">
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50 to-purple-50 rounded-full transform translate-x-48 -translate-y-48 opacity-60" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-50 to-pink-50 rounded-full transform -translate-x-32 translate-y-32 opacity-60" />
              
              <div className="relative text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <Badge className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-3 text-base font-medium">
                    🚀 Join the Vault
                  </Badge>
                  
                  <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
                    Ready to Start
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                      Collecting?
                    </span>
                  </h2>
                  
                  <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                    Join thousands of collectors discovering rare treasures, authentic pieces, and their next favorite addition to the collection.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-12 py-4 rounded-2xl shadow-lg" 
                      asChild
                    >
                      <Link href="/auth/register">
                        Create Free Account
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600 text-lg px-12 py-4 rounded-2xl"
                      asChild
                    >
                      <Link href="/auctions">
                        Browse Auctions
                        <Search className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>                {/* Stats Grid */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <div className="text-center p-6 bg-slate-50 rounded-2xl">
                    <div className="text-4xl font-bold text-slate-900 mb-2">
                      15K+
                    </div>
                    <p className="text-slate-600 font-medium">Active Collectors</p>
                    <p className="text-slate-500 text-sm mt-1">Growing daily</p>
                  </div>
                  
                  <div className="text-center p-6 bg-slate-50 rounded-2xl">
                    <div className="text-4xl font-bold text-slate-900 mb-2">
                      2.5M+
                    </div>
                    <p className="text-slate-600 font-medium">Items Traded</p>
                    <p className="text-slate-500 text-sm mt-1">All authenticated</p>
                  </div>
                  
                  <div className="text-center p-6 bg-slate-50 rounded-2xl">
                    <div className="text-4xl font-bold text-slate-900 mb-2">
                      4.9★
                    </div>
                    <p className="text-slate-600 font-medium">Average Rating</p>
                    <p className="text-slate-500 text-sm mt-1">From 12K+ reviews</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
