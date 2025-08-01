'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { 
  ArrowRight,
  Users,
  Award,
  Calendar,
  MapPin,
  Star,
  Play,
  ChevronLeft,
  ChevronRight,
  Mic,
  BookOpen,
  TrendingUp,
  Heart,
  Building,
  Globe
} from 'lucide-react';
import { useState } from 'react';

const featuredSpeakers = [
  {
    name: 'Sarah Chen',
    title: 'VP of Growth Marketing',
    company: 'TechFlow Solutions',
    image: '/api/placeholder/300/300',
    expertise: ['Growth Marketing', 'HubSpot Automation', 'Lead Generation'],
    session: 'Scaling Growth with HubSpot: From Startup to Enterprise',
    bio: 'Sarah has scaled multiple companies from 6 to 8 figures using HubSpot as the central growth engine.',
    featured: true
  },
  {
    name: 'Marcus Rodriguez',
    title: 'HubSpot Solutions Architect',
    company: 'Digital Dynamics',
    image: '/api/placeholder/300/300',
    expertise: ['HubSpot Implementation', 'Sales Automation', 'CRM Strategy'],
    session: 'Advanced HubSpot Workflows: Beyond the Basics',
    bio: 'Marcus is a certified HubSpot trainer with over 500 successful implementations.',
    featured: true
  },
  {
    name: 'Dr. Emily Watson',
    title: 'Chief Marketing Officer',
    company: 'HealthTech Innovations',
    image: '/api/placeholder/300/300',
    expertise: ['Content Strategy', 'Inbound Marketing', 'B2B Healthcare'],
    session: 'Content That Converts: Healthcare Marketing with HubSpot',
    bio: 'Emily transformed healthcare marketing at 3 Fortune 500 companies using inbound methodology.',
    featured: true
  },
  {
    name: 'James Park',
    title: 'Revenue Operations Director',
    company: 'SaaS Unicorn Inc',
    image: '/api/placeholder/300/300',
    expertise: ['Revenue Operations', 'Sales Analytics', 'HubSpot Reporting'],
    session: 'Building a Revenue Machine with HubSpot Operations Hub',
    bio: 'James built the RevOps function that helped scale ARR from $10M to $100M.',
    featured: true
  }
];

const allSpeakers = [
  ...featuredSpeakers,
  {
    name: 'Lisa Thompson',
    title: 'Senior Marketing Manager',
    company: 'E-commerce Plus',
    image: '/api/placeholder/300/300',
    expertise: ['E-commerce Marketing', 'Customer Journey', 'Attribution'],
    session: 'E-commerce Attribution: Tracking the Full Customer Journey',
    bio: 'Lisa specializes in complex e-commerce attribution models using HubSpot.',
    featured: false
  },
  {
    name: 'David Kumar',
    title: 'Sales Enablement Lead',
    company: 'Enterprise Solutions Co',
    image: '/api/placeholder/300/300',
    expertise: ['Sales Enablement', 'Training', 'HubSpot Sales Hub'],
    session: 'Enabling Sales Teams for HubSpot Success',
    bio: 'David has trained over 1000 sales professionals on HubSpot best practices.',
    featured: false
  },
  {
    name: 'Rachel Green',
    title: 'Customer Success Director',
    company: 'Growth Partners',
    image: '/api/placeholder/300/300',
    expertise: ['Customer Success', 'Retention', 'Service Hub'],
    session: 'Customer Success Strategies with HubSpot Service Hub',
    bio: 'Rachel increased customer retention by 40% using HubSpot Service Hub.',
    featured: false
  },
  {
    name: 'Alex Johnson',
    title: 'Marketing Automation Specialist',
    company: 'AutoFlow Agency',
    image: '/api/placeholder/300/300',
    expertise: ['Marketing Automation', 'Lead Nurturing', 'Workflows'],
    session: 'Advanced Lead Nurturing with HubSpot Workflows',
    bio: 'Alex creates complex automation sequences that convert 3x better than industry average.',
    featured: false
  }
];

const categories = [
  { name: 'All Speakers', count: allSpeakers.length, active: true },
  { name: 'Featured', count: featuredSpeakers.length, active: false },
  { name: 'Growth Marketing', count: 3, active: false },
  { name: 'Sales & RevOps', count: 2, active: false },
  { name: 'Customer Success', count: 2, active: false }
];

export default function SpeakersPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All Speakers');

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredSpeakers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredSpeakers.length) % featuredSpeakers.length);
  };

  const filteredSpeakers = selectedCategory === 'All Speakers' 
    ? allSpeakers 
    : selectedCategory === 'Featured'
    ? featuredSpeakers
    : allSpeakers.filter(speaker => 
        speaker.expertise.some(exp => 
          selectedCategory.toLowerCase().includes(exp.toLowerCase().split(' ')[0])
        )
      );

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Logo size="md" />
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/events" className="text-gray-300 hover:text-orange-400 font-medium">
                Sessions
              </Link>
              <Link href="/speakers" className="text-orange-400 font-medium">
                Speakers
              </Link>
              <Link href="/sponsors" className="text-gray-300 hover:text-orange-400 font-medium">
                Sponsors
              </Link>
              <a href="https://www.inbound.com/blog" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange-400 font-medium">
                Blog
              </a>
              <a href="https://merchspot.inbound.com/Category" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange-400 font-medium">
                Store
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-300 hover:text-orange-400 font-medium"
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
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Orange Gradient Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-600/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Meet Our <span className="text-orange-500">Speakers</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Learn from the best HubSpot practitioners, growth experts, and industry leaders 
            who are shaping the future of inbound marketing and sales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors inline-flex items-center justify-center"
            >
              Join as Fan & Speaker
              <Mic className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/events"
              className="bg-slate-800 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-700 transition-colors inline-flex items-center justify-center border border-slate-700"
            >
              View Sessions
              <Calendar className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Speakers Carousel */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Featured Speakers
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Industry leaders and HubSpot experts sharing their insights and strategies.
            </p>
          </div>
          
          {/* Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredSpeakers.map((speaker, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 lg:p-12">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Speaker Image */}
                        <div className="relative">
                          <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-purple-600/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                            <div className="w-full h-full bg-slate-600 rounded-xl flex items-center justify-center">
                              <Users className="w-24 h-24 text-slate-400" />
                            </div>
                          </div>
                          {/* Floating badges */}
                          <div className="absolute -top-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            Featured
                          </div>
                        </div>
                        
                        {/* Speaker Info */}
                        <div className="text-white">
                          <h3 className="text-3xl lg:text-4xl font-bold mb-2">{speaker.name}</h3>
                          <p className="text-xl text-orange-400 mb-2">{speaker.title}</p>
                          <p className="text-lg text-gray-300 mb-6">{speaker.company}</p>
                          
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold mb-3">Session:</h4>
                            <p className="text-gray-300 text-lg leading-relaxed">{speaker.session}</p>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold mb-3">Expertise:</h4>
                            <div className="flex flex-wrap gap-2">
                              {speaker.expertise.map((skill, skillIndex) => (
                                <span key={skillIndex} className="bg-slate-600 text-gray-300 px-3 py-1 rounded-full text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-gray-300 leading-relaxed mb-8">{speaker.bio}</p>
                          
                          <Link
                            href="/events"
                            className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                          >
                            View Session
                            <Play className="ml-2 w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {featuredSpeakers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-orange-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Speakers Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              All Speakers
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Browse our complete lineup of HubSpot experts and industry leaders.
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
          
          {/* Speakers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredSpeakers.map((speaker, index) => (
              <div key={index} className="bg-slate-800 rounded-xl overflow-hidden hover:bg-slate-700 transition-colors group">
                {/* Speaker Image */}
                <div className="aspect-square bg-slate-700 flex items-center justify-center relative">
                  <Users className="w-16 h-16 text-slate-500" />
                  {speaker.featured && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>
                
                {/* Speaker Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{speaker.name}</h3>
                  <p className="text-orange-400 font-medium mb-1">{speaker.title}</p>
                  <p className="text-gray-400 text-sm mb-4">{speaker.company}</p>
                  
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{speaker.session}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {speaker.expertise.slice(0, 2).map((skill, skillIndex) => (
                      <span key={skillIndex} className="bg-slate-700 text-gray-300 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {speaker.expertise.length > 2 && (
                      <span className="text-gray-400 text-xs px-2 py-1">
                        +{speaker.expertise.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  <Link
                    href="/events"
                    className="inline-flex items-center text-orange-400 hover:text-orange-300 font-medium text-sm group-hover:translate-x-1 transition-transform"
                  >
                    View Session
                    <ArrowRight className="ml-1 w-4 h-4" />
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
            Want to Share Your Expertise?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Join our amazing lineup of speakers and share your HubSpot knowledge 
            with the community. We're looking for practical, actionable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-50 transition-colors inline-flex items-center justify-center"
            >
              Join as Fan & Speaker
              <Mic className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/register"
              className="bg-orange-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-900 transition-colors inline-flex items-center justify-center"
            >
              Register to Attend
              <Heart className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
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
                <li><Link href="/sponsors" className="hover:text-white">Sponsors</Link></li>
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
                <li><a href="https://www.inbound.com/blog" target="_blank" rel="noopener noreferrer" className="hover:text-white">Blog</a></li>
                <li><a href="https://merchspot.inbound.com/Category" target="_blank" rel="noopener noreferrer" className="hover:text-white">Store</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Remote Inbound. Organized by HubSpot Super Users. Not affiliated with HubSpot, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}