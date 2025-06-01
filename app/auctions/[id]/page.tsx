import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AuctionDetail } from '@/components/auction/auction-detail';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AuctionPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: AuctionPageProps): Promise<Metadata> {
  const { id } = await params;
  // TODO: Fetch auction data for metadata
  // const auction = await getAuction(id);
  
  return {
    title: `Auction ${id} - Pop Culture Collectibles | Vault`,
    description: 'View auction details, place bids, and track this collectible auction.',
    openGraph: {
      title: `Auction ${id} - Pop Culture Collectibles`,
      description: 'View auction details, place bids, and track this collectible auction.',
      // images: auction?.images?.map(img => img.url) || [],
    },
  };
}

// Mock data for demonstration - replace with actual API call
async function getAuctionData(id: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    auction: {
      id,
      title: "Amazing Spider-Man #1 (1963) CGC 9.2",
      description: "Incredible condition copy of the first appearance of Spider-Man in his own title. This is a key issue for any Marvel collector. The comic has been professionally graded by CGC and comes with their certification. No restoration or pressing. Clean white pages.\n\nThis auction includes:\n- Comic book in CGC 9.2 condition\n- Original CGC case and label\n- Certificate of authenticity\n\nShipping is carefully handled with full insurance and tracking. I've been selling comics for over 10 years with 100% positive feedback.",
      category: "comics" as const,
      condition: "near-mint" as const,
      startingBid: 5000,
      currentBid: 12500,
      buyNowPrice: 15000,
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      sellerId: "seller123",
      status: "active" as const,
      images: [
        {
          id: "img1",
          url: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=800",
          thumbnailUrl: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=200",
          order: 0,
          alt: "Amazing Spider-Man #1 front cover"
        },
        {
          id: "img2", 
          url: "https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=800",
          thumbnailUrl: "https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=200",
          order: 1,
          alt: "Amazing Spider-Man #1 back cover"
        }
      ],
      bidCount: 24,
      watchers: 156,
      shippingInfo: {
        domestic: 25,
        international: 75,
        handlingTime: "1-2 business days",
        shipsTo: ["United States", "Canada", "United Kingdom", "Australia"]
      },
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },    seller: {
      id: "seller123",
      username: "ComicCollector99",
      email: "seller@example.com",
      firstName: "John",
      lastName: "Smith",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      isVerified: true,
      rating: {
        positive: 487,
        neutral: 12,
        negative: 3,
        totalFeedback: 502,
        percentage: 97.0
      },
      joinDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      preferences: {
        notifications: {          email: {
            newBids: true,
            outbid: true,
            auctionEnding: true,
            auctionWon: true,
            paymentReminder: true,
            watchlistUpdates: true,
            messages: true
          },
          push: {
            newBids: false,
            outbid: true,
            auctionEnding: true,
            auctionWon: true,
            paymentReminder: false,
            messages: false
          },
          sms: {
            auctionEnding: false,
            auctionWon: false,
            paymentReminder: false
          }
        },        privacy: {
          showEmail: false,
          showRealName: false,
          showBidHistory: true,
          showBiddingHistory: true,
          showWatchlist: false,
          allowMessages: true
        },        bidding: {
          autoBidEnabled: true,
          maxAutoBidAmount: 1000,
          bidIncrements: [25, 50, 100, 250, 500]
        }
      }
    },
    bids: [
      {
        id: "bid1",
        auctionId: id,
        bidderId: "bidder1",
        amount: 12500,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isAutoBid: false
      },
      {
        id: "bid2",
        auctionId: id,
        bidderId: "bidder2", 
        amount: 12000,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isAutoBid: true,
        maxBidAmount: 13000
      },
      {
        id: "bid3",
        auctionId: id,
        bidderId: "bidder3",
        amount: 11500,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isAutoBid: false
      }
    ]
  };
}

export default async function AuctionPage({ params }: AuctionPageProps) {
  const { id } = await params;
  
  if (!id || id.length < 1) {
    notFound();
  }

  try {
    const { auction, seller, bids } = await getAuctionData(id);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auctions">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Auctions
                </Link>
              </Button>
              <div className="text-sm text-gray-600">
                <Link href="/auctions" className="hover:text-gray-900">Auctions</Link>
                <span className="mx-2">/</span>
                <Link href={`/categories/${auction.category}`} className="hover:text-gray-900 capitalize">
                  {auction.category.replace('-', ' ')}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 truncate max-w-xs">{auction.title}</span>
              </div>
            </div>
          </div>
        </div>        <Suspense fallback={
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <AuctionDetail 
            auction={auction}
            seller={seller}
            bids={bids}
          />
        </Suspense>

        {/* Similar Auctions */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Similar Auctions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="bg-gray-200 h-32 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error loading auction:', error);
    notFound();
  }
}
