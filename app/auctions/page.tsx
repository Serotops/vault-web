import { Suspense } from 'react';
import { Metadata } from 'next';
import { AuctionList } from '@/components/auction/auction-list';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Gavel } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Auctions - Pop Culture Collectibles | Vault',
  description: 'Browse active auctions for comics, trading cards, action figures, and more pop culture collectibles.',
  openGraph: {
    title: 'Auctions - Pop Culture Collectibles',
    description: 'Browse active auctions for comics, trading cards, action figures, and more pop culture collectibles.',
  },
};

interface AuctionsPageProps {
  searchParams: Promise<{
    category?: string;
    condition?: string;
    status?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }>;
}

export default async function AuctionsPage({ searchParams }: AuctionsPageProps) {
  // TODO: Use search params to filter auctions
  const _params = await searchParams;
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Live Auctions
            </h1>
            <p className="text-gray-600">
              Discover authentic collectibles from verified sellers
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Gavel className="h-3 w-3" />
              2,847 active auctions
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              156 ending today
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Hot bidding
            </Badge>
          </div>
        </div>

        <Button asChild>
          <Link href="/sell">
            Create Auction
          </Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-4">
            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-4">Filters</h2>
              <p className="text-sm text-gray-500">
                Advanced filters coming soon
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Sort Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              Showing active auctions
            </div>
            
            <div className="border rounded-lg p-2">
              <span className="text-sm text-gray-500">Sort: Featured</span>
            </div>
          </div>

          {/* Auction List */}
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }>
            <AuctionList />
          </Suspense>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <div className="border rounded-lg p-4">
              <span className="text-sm text-gray-500">Pagination controls</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
