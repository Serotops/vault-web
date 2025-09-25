// Categories page for browsing different collectible categories

import React from 'react';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { CategoryNavigation } from '@/components/categories/category-navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  BookOpen,
  Gamepad2,
  Swords,
  Music,
  Film,
  Trophy,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Star,
  Users
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Browse Categories - Vault',
  description: 'Explore different categories of pop culture collectibles available for auction.',
};

const featuredCategories = [
  {
    id: 'comics',
    name: 'Comics',
    description: 'Vintage and modern comic books, graphic novels, and manga',
    icon: BookOpen,
    itemCount: 2847,
    featured: true,
    trending: true,
    gradient: 'from-purple-600 to-blue-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  {
    id: 'trading-cards',
    name: 'Trading Cards',
    description: 'Sports cards, TCG cards, and collectible card games',
    icon: ShoppingBag,
    itemCount: 5621,
    featured: true,
    trending: false,
    gradient: 'from-emerald-600 to-teal-600',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600'
  },
  {
    id: 'action-figures',
    name: 'Action Figures',
    description: 'Collectible figures from movies, TV shows, and games',
    icon: Swords,
    itemCount: 1893,
    featured: true,
    trending: true,
    gradient: 'from-orange-600 to-red-600',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Video games, consoles, and gaming accessories',
    icon: Gamepad2,
    itemCount: 1245,
    featured: true,
    trending: false,
    gradient: 'from-indigo-600 to-purple-600',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600'
  },
  {
    id: 'movies',
    name: 'Movies & TV',
    description: 'Movie memorabilia, posters, and TV show collectibles',
    icon: Film,
    itemCount: 967,
    featured: false,
    trending: true,
    gradient: 'from-rose-600 to-pink-600',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-600'
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Vinyl records, CDs, and music memorabilia',
    icon: Music,
    itemCount: 743,
    featured: false,
    trending: false,
    gradient: 'from-violet-600 to-purple-600',
    bgColor: 'bg-violet-50',
    iconColor: 'text-violet-600'
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Sports memorabilia, autographs, and collectibles',
    icon: Trophy,
    itemCount: 1567,
    featured: false,
    trending: true,
    gradient: 'from-amber-600 to-orange-600',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600'
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Categories</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover collectibles across different categories
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">

          <Suspense fallback={
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            </div>
          }>
            {/* Main Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card key={category.id} className="group hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 ${category.bgColor} rounded-lg`}>
                          <IconComponent className={`h-6 w-6 ${category.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{category.name}</h3>
                          {category.trending && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 font-medium">
                          {category.itemCount.toLocaleString()} items
                        </span>
                        <Button variant="outline" size="sm" className="group-hover:bg-gray-900 group-hover:text-white transition-colors" asChild>
                          <Link href={`/search?category=${category.id}`}>
                            Browse
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

          </Suspense>
        </div>
      </div>
    </div>
  );
}
