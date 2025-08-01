'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { userStorage } from '@/lib/storage';
import { userService } from '@/lib/database';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = userStorage.getCurrentUser();
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Try to find user in database first
      const user = await userService.getByEmail(formData.email.toLowerCase().trim());
      
      if (user) {
        // For demo purposes, we'll accept any password since we don't store passwords
        // In a real app, you'd use proper authentication with hashed passwords
        userStorage.setCurrentUser(user);
        router.push('/dashboard');
      } else {
        // Fallback to local storage for existing users
        const localUsers = userStorage.getAllUsers();
        const localUser = localUsers.find(u => 
          u.email.toLowerCase() === formData.email.toLowerCase()
        );
        
        if (localUser) {
          userStorage.setCurrentUser(localUser);
          router.push('/dashboard');
        } else {
          setErrors({ email: 'No account found with this email address.' });
        }
      }

    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to local storage if database fails
      try {
        const localUsers = userStorage.getAllUsers();
        const localUser = localUsers.find(u => 
          u.email.toLowerCase() === formData.email.toLowerCase()
        );
        
        if (localUser) {
          userStorage.setCurrentUser(localUser);
          router.push('/dashboard');
        } else {
          setErrors({ general: 'Login failed. Please check your credentials.' });
        }
      } catch (fallbackError) {
        setErrors({ general: 'Login failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-orange-500">
              Remote Inbound
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Don't have an account?</span>
              <Link
                href="/register"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Login Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back to Remote Inbound
              </h2>
              <p className="text-gray-600">
                Sign in to access your dashboard and join the fan-driven HubSpot community
              </p>
            </div>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In to Remote Inbound'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/register"
                className="text-orange-600 hover:text-orange-700 text-sm"
              >
                Don't have an account? Join the community here
              </Link>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-900 mb-1">Demo Mode</h3>
                <p className="text-sm text-orange-700">
                  For demo purposes, you can sign in with any registered email address and any password. 
                  In production, this would use secure authentication with the Remote Inbound community platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}