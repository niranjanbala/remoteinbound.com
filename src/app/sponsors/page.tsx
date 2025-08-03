'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { 
  ArrowRight,
  Users,
  Globe,
  Target,
  Award,
  Zap,
  Building,
  Heart,
  Star,
  CheckCircle,
  TrendingUp,
  Network,
  Megaphone,
  Eye
} from 'lucide-react';

const sponsorshipTiers = [
  {
    name: 'Platinum Partner',
    price: 'Contact Us',
    color: 'from-gray-400 to-gray-600',
    features: [
      'Premium booth placement in virtual expo',
      'Speaking opportunity (30-minute keynote)',
      'Logo on all event materials',
      'Access to attendee contact list',
      'Custom branded networking room',
      'Social media promotion package',
      'Post-event analytics report',
      'Year-round community recognition'
    ],
    popular: true
  },
  {
    name: 'Gold Partner',
    price: 'Contact Us',
    color: 'from-yellow-400 to-yellow-600',
    features: [
      'Standard booth in virtual expo',
      'Speaking opportunity (15-minute session)',
      'Logo on event website',
      'Access to attendee list (post-event)',
      'Branded virtual swag bag inclusion',
      'Social media mentions',
      'Event analytics summary'
    ],
    popular: false
  },
  {
    name: 'Silver Partner',
    price: 'Contact Us',
    color: 'from-gray-300 to-gray-500',
    features: [
      'Listing in virtual expo directory',
      'Logo on event website',
      'Social media mention',
      'Access to networking sessions',
      'Event attendance certificate',
      'Basic analytics report'
    ],
    popular: false
  },
  {
    name: 'Community Partner',
    price: 'Free',
    color: 'from-orange-400 to-orange-600',
    features: [
      'Community partner recognition',
      'Logo on community partners page',
      'Social media shout-out',
      'Access to all sessions',
      'Networking opportunities',
      'Community badge'
    ],
    popular: false
  }
];

const benefits = [
  {
    icon: Users,
    title: 'Connect with HubSpot Super Users',
    description: 'Reach thousands of passionate HubSpot professionals, decision-makers, and influencers in the inbound marketing community.'
  },
  {
    icon: Globe,
    title: 'Global Virtual Reach',
    description: 'Connect with attendees from around the world without geographical limitations. Maximize your ROI with global exposure.'
  },
  {
    icon: Target,
    title: 'Highly Targeted Audience',
    description: 'Engage with qualified prospects who are actively using HubSpot and looking for solutions to grow their businesses.'
  },
  {
    icon: Award,
    title: 'Thought Leadership',
    description: 'Position your brand as an industry leader by sharing expertise and insights with the HubSpot community.'
  },
  {
    icon: Network,
    title: 'Year-Round Community',
    description: 'Build lasting relationships that extend beyond the event through our ongoing community initiatives and networking.'
  },
  {
    icon: TrendingUp,
    title: 'Lead Generation',
    description: 'Generate high-quality leads from engaged prospects who are actively seeking solutions and partnerships.'
  }
];

const stats = [
  { number: '5,000+', label: 'Expected Attendees', icon: Users },
  { number: '50+', label: 'Expert Sessions', icon: Award },
  { number: '3 Days', label: 'of Networking', icon: Globe },
  { number: '100%', label: 'Virtual Experience', icon: Zap }
];

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Logo size="md" />
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/events" className="text-gray-700 hover:text-orange-500 font-medium">
                Sessions
              </Link>
              <Link href="/speakers" className="text-gray-700 hover:text-orange-500 font-medium">
                Speakers
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-orange-500 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors font-medium"
              >
                Register Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Orange Gradient Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-600/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Partner with <span className="text-orange-500">Remote Inbound</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Be part of what's next. From custom experiences and turnkey packages to thought leadership 
                opportunities, Remote Inbound partnerships open doors to join the next wave of leaders and 
                companies driving change. Ready to make your mark?
              </p>
              <Link
                href="/register/sponsor"
                className="inline-flex items-center bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                LEARN MORE
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>

            {/* Right Content - Hero Image Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500/20 to-purple-600/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <Building className="w-12 h-12 text-orange-400 mb-4" />
                    <h3 className="text-white font-semibold mb-2">Brand Exposure</h3>
                    <p className="text-gray-300 text-sm">Reach thousands of HubSpot professionals</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <Network className="w-12 h-12 text-orange-400 mb-4" />
                    <h3 className="text-white font-semibold mb-2">Networking</h3>
                    <p className="text-gray-300 text-sm">Connect with industry leaders</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <Megaphone className="w-12 h-12 text-orange-400 mb-4" />
                    <h3 className="text-white font-semibold mb-2">Thought Leadership</h3>
                    <p className="text-gray-300 text-sm">Share your expertise</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <TrendingUp className="w-12 h-12 text-orange-400 mb-4" />
                    <h3 className="text-white font-semibold mb-2">Lead Generation</h3>
                    <p className="text-gray-300 text-sm">Generate qualified prospects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <Icon className="w-12 h-12 text-orange-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Sponsor Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why sponsor Remote Inbound?
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Connect with the most engaged HubSpot community and position your brand 
              at the forefront of inbound marketing innovation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white/10 rounded-xl p-8 backdrop-blur-sm border border-white/20">
                  <div className="bg-orange-500/20 rounded-lg p-3 w-fit mb-6">
                    <Icon className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-purple-100 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sponsorship Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the partnership level that best fits your goals and budget. 
              All tiers include access to our engaged HubSpot community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sponsorshipTiers.map((tier, index) => (
              <div key={index} className={`relative bg-white rounded-2xl shadow-lg border-2 ${tier.popular ? 'border-orange-500' : 'border-gray-200'} overflow-hidden`}>
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 text-sm font-semibold">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${tier.color} mb-6 flex items-center justify-center`}>
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold text-orange-500 mb-6">{tier.price}</div>
                  
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href="/register/sponsor"
                    className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                      tier.popular 
                        ? 'bg-orange-500 text-white hover:bg-orange-600' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Partner with Us?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Join leading companies in supporting the HubSpot community. Let's create 
            something amazing together at Remote Inbound 2025.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register/sponsor"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-50 transition-colors inline-flex items-center justify-center"
            >
              Become a Sponsor
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="bg-orange-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-900 transition-colors inline-flex items-center justify-center"
            >
              Contact Us
              <Heart className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-orange-500 mb-4">Remote Inbound</div>
              <p className="text-gray-400 mb-4">
                The first fan-driven HubSpot community event. Created by super users, for the community.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Event</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/events" className="hover:text-white">Sessions</Link></li>
                <li><Link href="/speakers" className="hover:text-white">Speakers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register" className="hover:text-white">Register</Link></li>
                <li><Link href="/register" className="hover:text-white">Join as Fan</Link></li>
                <li><Link href="/register/sponsor" className="hover:text-white">Sponsor</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Remote Inbound. Organized by HubSpot Super Users. Not affiliated with HubSpot, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}