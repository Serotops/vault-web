// Create auction/sell page

import { Metadata } from 'next';
import { Suspense } from 'react';

import { CreateAuctionForm } from '@/components/auction/create-auction-form';

export const metadata: Metadata = {
  title: 'Sell Your Collectibles - Vault',
  description: 'Create an auction to sell your pop culture collectibles to collectors worldwide.',
};

export default function SellPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sell Your Collectible</h1>
          <p className="text-gray-600">
            Create an auction to reach collectors around the world
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <div className="bg-white border rounded-lg p-8">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    1
                  </div>
                  <span className="font-medium">Item Details</span>
                </div>
                <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-xs font-semibold">
                    2
                  </div>
                  <span className="text-gray-500">Photos</span>
                </div>
                <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-xs font-semibold">
                    3
                  </div>
                  <span className="text-gray-500">Pricing</span>
                </div>
                <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-xs font-semibold">
                    4
                  </div>
                  <span className="text-gray-500">Review</span>
                </div>
              </div>
            </div>            {/* Create Auction Form */}
            <CreateAuctionForm />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
