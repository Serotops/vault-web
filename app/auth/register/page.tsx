import { Metadata } from 'next';
import { Suspense } from 'react';
import { RegisterForm } from '@/components/auth/register-form';
import { Badge } from '@/components/ui/badge';
import { Gavel, Shield, Users, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Create Account - Vault',
  description: 'Join Vault to start bidding on amazing pop culture collectibles.',
};

interface RegisterPageProps {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirectTo || '/';

  const benefits = [
    {
      icon: Shield,
      title: 'Secure Trading',
      description: 'All transactions protected with escrow and buyer protection'
    },
    {
      icon: Users,
      title: 'Verified Community',
      description: 'Join 50,000+ verified collectors and sellers'
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Access price histories and collectible market trends'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Panel - Benefits (Hidden on mobile) */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
          <div className="max-w-md">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Gavel className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl">Vault</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-6">
              Join the Premier Collectibles Marketplace
            </h1>
            
            <div className="space-y-6 mb-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-blue-100 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Badge className="bg-white/20 text-white border-white/30">
                50K+ Active Users
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                $2M+ Monthly Sales
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Panel - Registration Form */}
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Mobile Header */}
            <div className="text-center lg:hidden">
              <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Gavel className="h-6 w-6 text-white" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Join Vault
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Start collecting amazing items today
              </p>
            </div>

            {/* Registration Form */}
            <Suspense fallback={
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            }>
              <RegisterForm redirectTo={redirectTo} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
