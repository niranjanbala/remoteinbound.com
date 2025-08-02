'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Heart,
  Mic,
  Handshake,
  Award,
  ArrowRight,
  Building,
  Target
} from 'lucide-react';
import { userStorage } from '@/lib/storage';
import { userService } from '@/lib/database';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    jobTitle: '',
    agreeToTerms: false,
    subscribeNewsletter: true,
    interestedInSpeaking: false,
    bio: '',
    expertise: [] as string[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    const currentUser = userStorage.getCurrentUser();
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [router]);

  const expertiseOptions = [
    'Inbound Marketing', 'Content Marketing', 'SEO', 'Email Marketing',
    'Lead Generation', 'Marketing Automation', 'Sales Enablement',
    'CRM Management', 'Analytics & Reporting', 'HubSpot Implementation'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    if (formData.interestedInSpeaking) {
      if (!formData.bio.trim() || formData.bio.trim().length < 50) {
        newErrors.bio = 'Bio must be at least 50 characters for speakers';
      }
      if (formData.expertise.length === 0) {
        newErrors.expertise = 'Please select at least one area of expertise';
      }
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
      let newUser;
      
      try {
        const existingUser = await userService.getByEmail(formData.email.toLowerCase().trim());
        if (existingUser) {
          setErrors({ email: 'An account with this email already exists.' });
          return;
        }

        newUser = await userService.create({
          email: formData.email.toLowerCase().trim(),
          fullName: formData.name.trim(),
          company: formData.company.trim() || undefined,
          jobTitle: formData.jobTitle.trim() || undefined,
          role: 'fan',
          preferences: {
            notifications: formData.subscribeNewsletter,
            theme: 'system'
          },
          fanProfile: {
            bio: formData.bio.trim() || undefined,
            interestedInSpeaking: formData.interestedInSpeaking,
            speakingExperience: 'none',
            expertise: formData.expertise,
            sessionTopics: [],
            social: {},
            availableForNetworking: true,
            hubspotExperience: [],
            interests: []
          }
        });
      } catch (dbError) {
        console.warn('Database registration failed, using local storage fallback:', dbError);
        
        const existingUsers = JSON.parse(localStorage.getItem('remoteinbound_users') || '[]');
        const existingLocalUser = existingUsers.find((user: any) =>
          user.email.toLowerCase() === formData.email.toLowerCase().trim()
        );
        
        if (existingLocalUser) {
          setErrors({ email: 'An account with this email already exists.' });
          return;
        }
        
        newUser = {
          id: `local_${Date.now()}`,
          email: formData.email.toLowerCase().trim(),
          fullName: formData.name.trim(),
          company: formData.company.trim() || undefined,
          jobTitle: formData.jobTitle.trim() || undefined,
          role: 'fan' as const,
          preferences: {
            notifications: formData.subscribeNewsletter,
            theme: 'system' as const
          },
          fanProfile: {
            bio: formData.bio.trim() || undefined,
            interestedInSpeaking: formData.interestedInSpeaking,
            speakingExperience: 'none' as const,
            expertise: formData.expertise,
            sessionTopics: [],
            social: {},
            availableForNetworking: true,
            hubspotExperience: [],
            interests: []
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        existingUsers.push(newUser);
        localStorage.setItem('remoteinbound_users', JSON.stringify(existingUsers));
      }

      userStorage.setCurrentUser(newUser);
      setRegistrationSuccess(true);

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleExpertiseChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(value)
        ? prev.expertise.filter(v => v !== value)
        : [...prev.expertise, value]
    }));

    if (errors.expertise) {
      setErrors(prev => ({ ...prev, expertise: '' }));
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Remote Inbound!</h2>
          <p className="text-gray-600 mb-6">
            Your fan account has been created successfully. You&apos;ll be redirected to your dashboard shortly.
          </p>
          <div className="animate-spin w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Already have an account?</span>
              <Link
                href="/login"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
          {/* Registration Options */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Join Remote Inbound 2025
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 px-4 leading-relaxed">
              Register as a HubSpot Fan - attend sessions, network with the community, and optionally share your expertise
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {/* Fan Registration - Active */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-2 border-orange-400 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Register Here
                  </span>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 mt-2">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 text-center">HubSpot Fan</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 text-center leading-relaxed">
                  Join as a community member, attend sessions, network, and optionally speak
                </p>
                <div className="text-center">
                  <span className="text-xl sm:text-2xl font-bold text-green-600">FREE</span>
                </div>
              </div>

              {/* Partner Registration */}
              <Link href="/register/partner" className="block">
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-2 border-gray-200 hover:border-orange-400 transition-colors h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Handshake className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 text-center">Partner</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 text-center leading-relaxed">
                    Join our ecosystem and help fans succeed
                  </p>
                  <div className="flex items-center justify-center text-orange-600">
                    <span className="text-xs sm:text-sm font-medium">Apply Now</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </div>
                </div>
              </Link>

              {/* Sponsor Registration */}
              <Link href="/register/sponsor" className="block">
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-2 border-gray-200 hover:border-orange-400 transition-colors h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 text-center">Sponsor</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 text-center leading-relaxed">
                    Support the community and grow your business
                  </p>
                  <div className="flex items-center justify-center text-orange-600">
                    <span className="text-xs sm:text-sm font-medium">Apply Now</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Fan Registration Form */}
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Register as a HubSpot Fan
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Join the first fan-driven HubSpot community event - attend, learn, network, and optionally share your expertise
                </p>
              </div>

              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-700">{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Field */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Your company name"
                        />
                      </div>
                    </div>

                    {/* Job Title Field */}
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Target className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="jobTitle"
                          name="jobTitle"
                          type="text"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Your job title"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Password Field */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
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
                          placeholder="Create a password"
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

                    {/* Confirm Password Field */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Speaking Interest */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Speaking Interest
                  </h3>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <input
                        id="interestedInSpeaking"
                        name="interestedInSpeaking"
                        type="checkbox"
                        checked={formData.interestedInSpeaking}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="interestedInSpeaking" className="ml-3 block text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <Mic className="w-4 h-4 text-orange-600 mr-2" />
                          I'm interested in speaking at Remote Inbound
                        </div>
                      </label>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 ml-7">
                      Check this if you'd like to share your HubSpot expertise with the community. You can attend all sessions regardless of this choice.
                    </p>
                  </div>

                  {formData.interestedInSpeaking && (
                    <div className="space-y-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h4 className="text-md font-semibold text-gray-900">Speaker Information</h4>

                      {/* Bio */}
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                          Bio *
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          value={formData.bio}
                          onChange={handleInputChange}
                          className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.bio ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Tell us about yourself and your HubSpot experience (minimum 50 characters)"
                        />
                        {errors.bio && (
                          <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                        )}
                      </div>

                      {/* Expertise */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Areas of Expertise *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {expertiseOptions.map((option) => (
                            <label key={option} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.expertise.includes(option)}
                                onChange={() => handleExpertiseChange(option)}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                        {errors.expertise && (
                          <p className="mt-1 text-sm text-red-600">{errors.expertise}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Newsletter Subscription */}
                <div className="flex items-center">
                  <input
                    id="subscribeNewsletter"
                    name="subscribeNewsletter"
                    type="checkbox"
                    checked={formData.subscribeNewsletter}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="subscribeNewsletter" className="ml-2 block text-sm text-gray-700">
                    Subscribe to our newsletter for event updates
                  </label>
                </div>

                {/* Terms Agreement */}
                <div>
                  <div className="flex items-center">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className={`h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded ${
                        errors.agreeToTerms ? 'border-red-300' : ''
                      }`}
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <Link href="/terms" className="text-orange-600 hover:text-orange-700">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-orange-600 hover:text-orange-700">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
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
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Join Remote Inbound Free'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}