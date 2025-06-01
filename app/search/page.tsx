// Search results page

import { Suspense } from 'react';
import { Metadata } from 'next';
import { SearchResults } from '@/components/search/search-results';
import { SearchFilters } from '@/components/search/search-filters';
import { SearchSort } from '@/components/search/search-sort';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    condition?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';
  
  return {
    title: query ? `Search results for "${query}" - Vault` : 'Search - Vault',
    description: query 
      ? `Find pop culture collectibles matching "${query}"`
      : 'Search for amazing pop culture collectibles',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {query ? `Search results for "${query}"` : 'Search'}
        </h1>
        {query && (
          <p className="text-gray-600">
            Finding collectibles that match your search
          </p>
        )}
      </div>      {query ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-4">              <SearchFilters 
                searchParams={params}
                onFiltersChange={(filters) => {
                  // TODO: Update URL with new filters
                  console.log('Filters changed:', filters)
                }}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Summary and Sort */}
            <div className="flex justify-between items-center mb-6">            <SearchSort
              sortBy={params.sortBy}
              sortDirection={params.sortDirection}
              onSortChange={(sortBy, sortDirection) => {
                // TODO: Update URL with new sort
                console.log('Sort changed:', { sortBy, sortDirection })
              }}
            />
          </div>

          {/* Search Results */}
          <Suspense fallback={
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }>
            <SearchResults searchParams={params} />
            </Suspense>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              {/* TODO: Replace with actual Pagination component */}
              <div className="border rounded-lg p-4">
                <span className="text-sm text-gray-500">Pagination controls</span>
              </div>
            </div>
          </main>
        </div>
      ) : (
        // No search query - show search suggestions or popular searches
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Start Your Search</h2>
            <p className="text-gray-600 mb-6">
              Enter keywords to find amazing pop culture collectibles
            </p>
            
            {/* Search Suggestions */}
            <div className="space-y-4">
              <h3 className="font-medium text-left">Popular Searches:</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'vintage comics',
                  'pokemon cards',
                  'star wars figures',
                  'marvel collectibles',
                  'retro gaming',
                  'anime figures',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    className="px-3 py-1 bg-white border rounded-full text-sm hover:bg-gray-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
