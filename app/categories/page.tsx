// Categories page for browsing different collectible categories

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
  TrendingUp
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
    trending: true
  },
  {
    id: 'trading-cards',
    name: 'Trading Cards',
    description: 'Sports cards, TCG cards, and collectible card games',
    icon: ShoppingBag,
    itemCount: 5621,
    featured: true,
    trending: false
  },
  {
    id: 'action-figures',
    name: 'Action Figures',
    description: 'Collectible figures from movies, TV shows, and games',
    icon: Swords,
    itemCount: 1893,
    featured: true,
    trending: true
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Video games, consoles, and gaming accessories',
    icon: Gamepad2,
    itemCount: 1245,
    featured: true,
    trending: false
  },
  {
    id: 'movies',
    name: 'Movies & TV',
    description: 'Movie memorabilia, posters, and TV show collectibles',
    icon: Film,
    itemCount: 967,
    featured: false,
    trending: true
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Vinyl records, CDs, and music memorabilia',
    icon: Music,
    itemCount: 743,
    featured: false,
    trending: false
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Sports memorabilia, autographs, and collectibles',
    icon: Trophy,
    itemCount: 1567,
    featured: false,
    trending: true
  }
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Categories</h1>
          <p className="text-gray-600">
            Discover amazing collectibles across different categories
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">            {/* Category Selector Sidebar */}
            <div className="lg:col-span-1">
              <CategoryNavigation />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Categories */}
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-2xl font-semibold">Featured Categories</h2>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Popular
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredCategories
                    .filter(cat => cat.featured)
                    .map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <Card key={category.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <IconComponent className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">{category.name}</h3>
                                  {category.trending && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                      <TrendingUp className="h-3 w-3 mr-1" />
                                      Trending
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 text-sm mb-3">
                                  {category.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">
                                    {category.itemCount.toLocaleString()} items
                                  </span>
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/search?category=${category.id}`}>
                                      Browse
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </section>

              {/* All Categories */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">All Categories</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Card key={category.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-gray-50 rounded">
                              <IconComponent className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{category.name}</h3>
                              {category.trending && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs mt-1">
                                  Trending
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            {category.itemCount.toLocaleString()} items
                          </p>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href={`/search?category=${category.id}`}>
                              View All
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>

              {/* Statistics */}
              <section className="mt-12">
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Platform Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {featuredCategories.reduce((sum, cat) => sum + cat.itemCount, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Total Items</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {featuredCategories.length}
                        </div>
                        <div className="text-sm text-gray-600">Categories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {featuredCategories.filter(cat => cat.trending).length}
                        </div>
                        <div className="text-sm text-gray-600">Trending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">24/7</div>
                        <div className="text-sm text-gray-600">Active</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
}
