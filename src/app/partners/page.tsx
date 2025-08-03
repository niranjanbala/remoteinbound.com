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
  Eye,
  Code,
  Settings,
  MessageSquare,
  Handshake
} from 'lucide-react';

const partnerTypes = [
  {
    type: 'Technology Partners',
    icon: Code,
    description: 'Software integrations and tech solutions',
    color: 'from-blue-500 to-blue-600',
    partners: [
      { name: 'Mailmodo', description: 'Interactive email marketing platform', logo: '📧' },
      { name: 'WebEngage', description: 'Customer engagement platform', logo: '🎯' },
      { name: 'Amplitude', description: 'Product analytics platform', logo: '📈' },
      { name: 'Supabase', description: 'Open-source Firebase alternative', logo: '⚡' },
      { name: 'Zapier', description: 'Workflow automation platform', logo: '🔗' },
      { name: 'Hotjar', description: 'Behavior analytics platform', logo: '🔥' },
      { name: 'CleverTap', description: 'Customer engagement and retention', logo: '🎯' },
      { name: 'Typeform', description: 'Interactive form builder', logo: '📝' },
      { name: 'HeyGen', description: 'AI-powered video generation platform', logo: '🎬' },
      { name: 'YouForm', description: 'Advanced form builder with conditional logic', logo: '📋' },
      { name: 'SuperBlog', description: 'AI-powered SEO-optimized blogging platform', logo: '✍️' }
    ]
  },
  {
    type: 'Service Partners',
    icon: Settings,
    description: 'Consulting, implementation, and support services',
    color: 'from-green-500 to-green-600',
    partners: [
      { name: 'HubSpot Solutions Partners', description: 'Certified implementation experts', logo: '🎯' },
      { name: 'Marketing Agencies', description: 'Full-service marketing support', logo: '📈' },
      { name: 'Sales Consultants', description: 'Revenue optimization specialists', logo: '💼' },
      { name: 'Training Providers', description: 'HubSpot education and certification', logo: '🎓' }
    ]
  },
  {
    type: 'Integration Partners',
    icon: Network,
    description: 'API integrations and data connections',
    color: 'from-purple-500 to-purple-600',
    partners: [
      { name: 'Custom API Solutions', description: 'Bespoke integration development', logo: '⚡' },
      { name: 'Data Sync Tools', description: 'Real-time data synchronization', logo: '🔄' },
      { name: 'Analytics Platforms', description: 'Advanced reporting integrations', logo: '📊' },
      { name: 'E-commerce Connectors', description: 'Online store integrations', logo: '🛒' }
    ]
  },
  {
    type: 'Community Partners',
    icon: MessageSquare,
    description: 'Community building and engagement',
    color: 'from-orange-500 to-orange-600',
    partners: [
      { name: 'HubSpot User Groups', description: 'Local community chapters', logo: '👥' },
      { name: 'Content Creators', description: 'Educational content and resources', logo: '✍️' },
      { name: 'Event Organizers', description: 'Meetups and conferences', logo: '🎪' },
      { name: 'Thought Leaders', description: 'Industry experts and speakers', logo: '🎤' }
    ]
  }
];

const partnerBenefits = [
  {
    icon: Star,
    title: 'Featured Partner Listing',
    description: 'Showcase your services to thousands of HubSpot professionals'
  },
  {
    icon: Users,
    title: 'Community Access',
    description: 'Connect directly with engaged HubSpot users and decision-makers'
  },
  {
    icon: TrendingUp,
    title: 'Lead Generation',
    description: 'Generate qualified leads from our active community'
  },
  {
    icon: Megaphone,
    title: 'Speaking Opportunities',
    description: 'Share your expertise at Remote Inbound events'
  },
  {
    icon: Network,
    title: 'Year-Round Networking',
    description: 'Build lasting relationships beyond events'
  },
  {
    icon: Award,
    title: 'Thought Leadership',
    description: 'Position your brand as an industry expert'
  }
];

const stats = [
  { number: '164', label: 'Technology Partners', icon: Building },
  { number: '5K+', label: 'Community Members', icon: Users },
  { number: '100%', label: 'Remote & Free', icon: Heart },
  { number: '24/7', label: 'Community Support', icon: Zap }
];

export default function PartnersPage() {
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
              <Link href="/partners" className="text-orange-500 font-medium">
                Partners
              </Link>
              <Link href="/sponsors" className="text-gray-700 hover:text-orange-500 font-medium">
                Sponsors
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
                href="/register/partner"
                className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors font-medium"
              >
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Handshake className="w-10 h-10 text-orange-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="text-orange-500">Partner</span> Ecosystem
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover the amazing companies and professionals who make Remote Inbound possible. 
              From technology integrations to expert services, our partners help the HubSpot community thrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register/partner"
                className="inline-flex items-center bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Join Our Partners
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/partners/directory"
                className="inline-flex items-center bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold border-2 border-orange-500 hover:bg-orange-50 transition-colors"
              >
                View Partner Directory
                <Eye className="ml-2 w-5 h-5" />
              </Link>
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

      {/* Partner Types Section */}
      <section id="partner-types" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Partner Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse partner ecosystem spans technology, services, integrations, and community building.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {partnerTypes.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-8">
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${category.color} mb-6 flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.type}</h3>
                    <p className="text-gray-600 mb-6">{category.description}</p>
                    
                    <div className="space-y-4">
                      {category.partners.map((partner, partnerIndex) => (
                        <div key={partnerIndex} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl">{partner.logo}</div>
                          <div>
                            <div className="font-semibold text-gray-900">{partner.name}</div>
                            <div className="text-sm text-gray-600">{partner.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {category.type === 'Technology Partners' && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <Link
                          href="/partners/directory"
                          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
                        >
                          View All Technology Partners
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Partner Benefits
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Join our partner ecosystem and unlock exclusive opportunities to grow your business 
              while supporting the HubSpot community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partnerBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white/10 rounded-xl p-8 backdrop-blur-sm border border-white/20">
                  <div className="bg-orange-500/20 rounded-lg p-3 w-fit mb-6">
                    <Icon className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
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
            Join our thriving partner ecosystem and help us build the future of the HubSpot community. 
            Together, we can create amazing experiences for HubSpot fans worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register/partner"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-50 transition-colors inline-flex items-center justify-center"
            >
              Become a Partner
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
                <li><Link href="/partners" className="hover:text-white">Partners</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register" className="hover:text-white">Register</Link></li>
                <li><Link href="/register" className="hover:text-white">Join as Fan</Link></li>
                <li><Link href="/register/partner" className="hover:text-white">Partner</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://www.inbound.com/blog" target="_blank" rel="noopener noreferrer" className="hover:text-white">Blog</a></li>
                <li><a href="https://merchspot.inbound.com/Category" target="_blank" rel="noopener noreferrer" className="hover:text-white">Store</a></li>
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