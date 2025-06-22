import { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { Gavel, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Login - Vault',
  description: 'Sign in to your Vault account to start bidding on pop culture collectibles.',
};

interface LoginPageProps {
  searchParams: Promise<{
    redirectTo?: string;
    error?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirectTo || '/';
  const error = params.error;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      
      <div className="relative max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 relative">
              <Gavel className="h-8 w-8 text-white" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-3">
              Welcome back
            </h1>
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              to Vault
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Sign in to continue your collecting journey and discover amazing treasures
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
              <div className="text-sm text-red-700 font-medium">
                {error === 'CredentialsSignin' && '❌ Invalid email or password. Please try again.'}
                {error === 'OAuthAccountNotLinked' && '⚠️ Account exists with different credentials.'}
                {error === 'default' && '🚫 An error occurred during sign in.'}
              </div>
            </div>
          )}

          {/* Login Form */}
          <Suspense fallback={
            <div className="flex justify-center py-8">
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200"></div>
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
              </div>
            </div>
          }>
            <LoginForm redirectTo={redirectTo} />
          </Suspense>

          {/* Additional Info */}
          <div className="text-center pt-4 border-t border-slate-200/50">
            <p className="text-xs text-slate-500 leading-relaxed">
              By signing in, you agree to our{' '}
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

        {/* Bottom decoration */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            New to Vault?{' '}
            <a href="/auth/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
