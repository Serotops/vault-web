import { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { Gavel } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Gavel className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back to Vault
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue bidding on amazing collectibles
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-600">
              {error === 'CredentialsSignin' && 'Invalid email or password.'}
              {error === 'OAuthAccountNotLinked' && 'Account exists with different credentials.'}
              {error === 'default' && 'An error occurred during sign in.'}
            </div>
          </div>
        )}

        {/* Login Form */}
        <Suspense fallback={
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        }>
          <LoginForm redirectTo={redirectTo} />
        </Suspense>        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
