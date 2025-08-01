'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Mic,
  Users,
  Globe,
  Heart,
  Building,
  FileText,
  Star,
  Calendar
} from 'lucide-react';
import { userStorage } from '@/lib/storage';
import { userService } from '@/lib/database';

export default function SpeakerRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    jobTitle: '',
    phone: '',
    bio: '',
    expertise: [] as string[],
    twitter: '',
    linkedin: '',
    website: '',
    availableForNetworking: true,
    sessionPreferences: [] as string[],
    agreeToTerms: false,
    subscribeNewsletter: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = userStorage.getCurrentUser();
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [router]);

  const expertiseOptions = [
    'HubSpot Marketing Hub',
    'HubSpot Sales Hub',
    'HubSpot Service Hub',
    'HubSpot CMS Hub',
    'HubSpot Operations Hub',
    'RevOps & Analytics',
    'Inbound Marketing',
    'Sales Enablement',
    'Customer Success',
    'Marketing Automation',
    'Lead Generation',
    'Content Marketing',
    'Social Media Marketing',
    'Email Marketing',
    'SEO & SEM',
    'CRM Management',
    'Integration & APIs',
    'Reporting & Dashboards'
  ];

  const sessionPreferenceOptions = [
    'Keynote Presentation',
    'Workshop (Hands-on)',
    'Panel Discussion',
    'Fireside Chat',
    'Lightning Talk',
    'Q&A Session',
    'Demo Session',
    'Case Study Presentation'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (formData.expertise.length === 0) newErrors.expertise = 'Please select at least one area of expertise';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';

    // Bio length validation
    if (formData.bio.length < 50) newErrors.bio = 'Bio must be at least 50 characters';
    if (formData.bio.length > 500) newErrors.bio = 'Bio must be less than 500 characters';

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
        // Check if user already exists in database
        const existingUser = await userService.getByEmail(formData.email.toLowerCase().trim());
        if (existingUser) {
          setErrors({ email: 'An account with this email already exists.' });
          return;
        }

        // Create new speaker user in database
        newUser = await userService.create({
          email: formData.email.toLowerCase().trim(),
          fullName: formData.name.trim(),
          company: formData.company.trim(),
          jobTitle: formData.jobTitle.trim(),
          phone: formData.phone.trim() || undefined,
          role: 'speaker',
          preferences: {
            notifications: formData.subscribeNewsletter,
            theme: 'system'
          },
          speakerProfile: {
            bio: formData.bio.trim(),
            expertise: formData.expertise,
            social: {
              twitter: formData.twitter.trim() || undefined,
              linkedin: formData.linkedin.trim() || undefined,
              website: formData.website.trim() || undefined,
            },
            availableForNetworking: formData.availableForNetworking,
            sessionPreferences: formData.sessionPreferences
          }
        });
      } catch (dbError) {
        console.warn('Database registration failed, using local storage fallback:', dbError);
        
        // Fallback to local storage
        newUser = {
          id: `speaker_${Date.now()}`,
          email: formData.email.toLowerCase().trim(),
          fullName: formData.name.trim(),
          company: formData.company.trim(),
          jobTitle: formData.jobTitle.trim(),
          phone: formData.phone.trim() || undefined,
          role: 'speaker' as const,
          preferences: {
            notifications: formData.subscribeNewsletter,
            theme: 'system' as const
          },
          speakerProfile: {
            bio: formData.bio.trim(),
            expertise: formData.expertise,
            social: {
              twitter: formData.twitter.trim() || undefined,
              linkedin: formData.linkedin.trim() || undefined,
              website: formData.website.trim() || undefined,
            },
            availableForNetworking: formData.availableForNetworking,
            sessionPreferences: formData.sessionPreferences
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Store in local storage
        const existingUsers = JSON.parse(localStorage.getItem('remoteinbound_users') || '[]');
        existingUsers.push(newUser);
        localStorage.setItem('remoteinbound_users', JSON.stringify(existingUsers));
      }

      // Set user as logged in
      userStorage.setCurrentUser(newUser);
      
      setRegistrationSuccess(true);

      // Redirect to dashboard after success message
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleExpertiseChange = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }));
    
    if (errors.expertise) {
      setErrors(prev => ({ ...prev, expertise: '' }));
    }
  };

  const handleSessionPreferenceChange = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      sessionPreferences: prev.sessionPreferences.includes(preference)
        ? prev.sessionPreferences.filter(p => p !== preference)
        : [...prev.sessionPreferences, preference]
    }));
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to RemoteInbound!</h2>
          <p className="text-gray-600 mb-6">
            Your speaker application has been submitted successfully. Our team will review your profile and get back to you soon.
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
            <Link href="/" className="text-2xl font-bold text-orange-500">
              RemoteInbound
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
        <div className="max-w-2xl w-full space-y-8">
          {/* Registration Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Become a RemoteInbound Speaker
              </h2>
              <p className="text-gray-600">
                Share your HubSpot expertise with our passionate fan community
              </p>
            </div>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

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
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company *
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
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.company ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Your company name"
                      />
                    </div>
                    {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
                  </div>

                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      id="jobTitle"
                      name="jobTitle"
                      type="text"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.jobTitle ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Your job title"
                    />
                    {errors.jobTitle && <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              {/* Speaker Profile */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Speaker Profile</h3>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Speaker Bio * (50-500 characters)
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
                    placeholder="Tell us about your background, experience with HubSpot, and what makes you passionate about sharing knowledge..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.bio && <p className="text-sm text-red-600">{errors.bio}</p>}
                    <p className="text-sm text-gray-500 ml-auto">{formData.bio.length}/500</p>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Areas of Expertise * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {expertiseOptions.map((expertise) => (
                      <label key={expertise} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.expertise.includes(expertise)}
                          onChange={() => handleExpertiseChange(expertise)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{expertise}</span>
                      </label>
                    ))}
                  </div>
                  {errors.expertise && <p className="mt-1 text-sm text-red-600">{errors.expertise}</p>}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Session Types (Optional)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {sessionPreferenceOptions.map((preference) => (
                      <label key={preference} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.sessionPreferences.includes(preference)}
                          onChange={() => handleSessionPreferenceChange(preference)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{preference}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links (Optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <input
                      id="twitter"
                      name="twitter"
                      type="url"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      id="linkedin"
                      name="linkedin"
                      type="url"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

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
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="availableForNetworking"
                    name="availableForNetworking"
                    type="checkbox"
                    checked={formData.availableForNetworking}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="availableForNetworking" className="ml-2 block text-sm text-gray-700">
                    I'm available for networking with attendees
                  </label>
                </div>

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
                    Subscribe to RemoteInbound updates and speaker resources
                  </label>
                </div>

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
                  {errors.agreeToTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>}
                </div>
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
                    <span>Submitting Application...</span>
                  </div>
                ) : (
                  'Apply to Speak at RemoteInbound'
                )}
              </button>
            </form>
          </div>

          {/* Benefits Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Speaker Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-gray-700">Featured speaker profile</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700">Access to speaker community</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-gray-700">Global community exposure</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-gray-700">Connect with HubSpot fans</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}