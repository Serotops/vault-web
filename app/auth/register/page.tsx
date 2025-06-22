import { Metadata } from 'next';
import { Suspense } from 'react';
import { RegisterForm } from '@/components/auth/register-form';
import { Badge } from '@/components/ui/badge';
import { Gavel, Shield, Users, TrendingUp, Sparkles, Star } from 'lucide-react';

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
      description: 'All transactions protected with escrow and buyer protection',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Verified Community',
      description: 'Join 50,000+ verified collectors and sellers worldwide',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Access price histories and collectible market trends',
      color: 'from-purple-400 to-pink-500'
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      
      <div className="relative flex min-h-screen">
        {/* Left Panel - Benefits (Hidden on mobile) */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-16">
          <div className="max-w-lg">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-12">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg relative">
                <Gavel className="h-7 w-7 text-white" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <span className="font-black text-3xl text-slate-900">Vault</span>
            </div>
            
            {/* Main heading */}
            <div className="mb-12">
              <h1 className="text-5xl font-black text-slate-900 mb-4 leading-tight">
                Join the Premier
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                  Collectibles
                </span>
                Marketplace
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Connect with passionate collectors worldwide and discover amazing treasures.
              </p>
            </div>
            
            {/* Benefits */}
            <div className="space-y-8 mb-12">
              {benefits.map((benefit, index) => (
                <div key={benefit.title} className="flex items-start space-x-4 group">
                  <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{benefit.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-black text-2xl text-slate-900">50K+</span>
                </div>
                <p className="text-slate-600 text-sm font-medium">Active Collectors</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-black text-2xl text-slate-900">$2M+</span>
                </div>
                <p className="text-slate-600 text-sm font-medium">Monthly Sales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Registration Form */}
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-md w-full">
            {/* Main Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 space-y-8">
              {/* Header */}
              <div className="text-center">
                {/* Mobile Logo */}
                <div className="lg:hidden mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 relative">
                  <Gavel className="h-8 w-8 text-white" />
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                  </div>
                </div>
                
                <h1 className="text-4xl font-black text-slate-900 mb-3">
                  Create Account
                </h1>
                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                  Join Vault Today
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Start your collecting journey and discover amazing treasures
                </p>
              </div>

              {/* Registration Form */}
              <Suspense fallback={
                <div className="flex justify-center py-8">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200"></div>
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                  </div>
                </div>
              }>
                <RegisterForm redirectTo={redirectTo} />
              </Suspense>

              {/* Additional Info */}
              <div className="text-center pt-4 border-t border-slate-200/50">
                <p className="text-xs text-slate-500 leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <a href="/terms" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>

            {/* Bottom link */}
            <div className="text-center mt-8">
              <p className="text-slate-500 text-sm">
                Already have an account?{' '}
                <a href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
