'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Chrome, ArrowLeft } from 'lucide-react';

function SignInContent() {
  const [providers, setProviders] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn('email', {
        email,
        callbackUrl,
      });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="flex items-center justify-center text-orange-500 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sign in to INBOUND
          </h1>
          <p className="text-gray-600">
            Access your dashboard and manage events
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                {error === 'OAuthSignin' && 'Error occurred during sign in'}
                {error === 'OAuthCallback' && 'Error occurred during callback'}
                {error === 'OAuthCreateAccount' && 'Could not create account'}
                {error === 'EmailCreateAccount' && 'Could not create account'}
                {error === 'Callback' && 'Error occurred during callback'}
                {error === 'OAuthAccountNotLinked' && 'Account not linked'}
                {error === 'EmailSignin' && 'Check your email for sign in link'}
                {error === 'CredentialsSignin' && 'Invalid credentials'}
                {error === 'SessionRequired' && 'Please sign in to access this page'}
                {!['OAuthSignin', 'OAuthCallback', 'OAuthCreateAccount', 'EmailCreateAccount', 'Callback', 'OAuthAccountNotLinked', 'EmailSignin', 'CredentialsSignin', 'SessionRequired'].includes(error) && 'An error occurred'}
              </p>
            </div>
          )}

          <div className="space-y-6">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome className="w-5 h-5 mr-2" />
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Demo mode: Google OAuth not configured yet.
                <br />
                Click the button above to see the authentication flow.
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Loading...
            </h1>
          </div>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}