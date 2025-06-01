// User profile page for viewing other users

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { UserProfileHeader } from '@/components/user/user-profile-header';
import { UserStats } from '@/components/user/user-stats';
import { UserAuctions } from '@/components/user/user-auctions';
import { UserFeedback } from '@/components/user/user-feedback';

interface UserProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: UserProfilePageProps): Promise<Metadata> {
  const { id: _id } = await params;
  // TODO: Fetch user data for metadata
  // const user = await getUser(id);
  
  return {
    title: `User Profile - Vault`,
    description: 'View user profile, auctions, and feedback on Vault.',
  };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params;
  
  // TODO: Implement proper user data fetching with id
  // For now, using mock data
  // TODO: Add proper user ID validation
  if (!id || id.length < 1) {
    notFound();
  }
  // Mock user data - replace with actual API call
  const mockUser = {
    id: id,
    username: `user_${id}`,
    displayName: `User ${id}`,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    totalReviews: 156,
    totalSales: 89,
    totalPurchases: 67,
    memberSince: '2022-03-15',
    location: 'New York, USA',
    bio: 'Passionate collector of vintage comics and rare action figures. Always looking for unique pieces to add to my collection.',
    isVerified: true,
    badges: ['Top Seller', 'Verified Collector'],
    lastActive: '2024-01-15T10:30:00Z'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }>        {/* User Profile Header */}
        <section className="mb-8">
          <UserProfileHeader user={mockUser} />
        </section>        {/* User Stats */}
        <section className="mb-8">
          <UserStats userId={id} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <UserAuctions userId={id} />
          </div>

          {/* Sidebar */}
          <div>
            <UserFeedback userId={id} />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
