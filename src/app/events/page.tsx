'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { 
  Calendar,
  Clock,
  Users,
  MapPin,
  Star,
  Filter,
  Search,
  ChevronDown,
  Play,
  Bookmark,
  Share2,
  ArrowRight,
  Video,
  Mic,
  Award,
  TrendingUp,
  Heart
} from 'lucide-react';
import { useState } from 'react';

const sessions = [
  {
    id: 1,
    title: 'Scaling Growth with HubSpot: From Startup to Enterprise',
    speaker: 'Sarah Chen',
    company: 'TechFlow Solutions',
    time: '09:00 AM - 09:45 AM',
    date: '2025-09-03',
    duration: '45 min',
    type: 'Keynote',
    track: 'Growth Marketing',
    level: 'Intermediate',
    description: 'Learn how to scale your growth marketing efforts using HubSpot as your central growth engine. Sarah will share real-world strategies from scaling multiple companies from 6 to 8 figures.',
    attendees: 1250,
    featured: true,
    tags: ['Growth', 'Scaling', 'HubSpot Automation']
  },
  {
    id: 2,
    title: 'Advanced HubSpot Workflows: Beyond the Basics',
    speaker: 'Marcus Rodriguez',
    company: 'Digital Dynamics',
    time: '10:00 AM - 10:30 AM',
    date: '2025-09-03',
    duration: '30 min',
    type: 'Workshop',
    track: 'Sales Automation',
    level: 'Advanced',
    description: 'Dive deep into advanced workflow strategies that go beyond basic automation. Perfect for HubSpot power users looking to maximize their automation potential.',
    attendees: 850,
    featured: true,
    tags: ['Workflows', 'Automation', 'Advanced']
  },
  {
    id: 3,
    title: 'Content That Converts: Healthcare Marketing with HubSpot',
    speaker: 'Dr. Emily Watson',
    company: 'HealthTech Innovations',
    time: '11:00 AM - 11:30 AM',
    date: '2025-09-03',
    duration: '30 min',
    type: 'Session',
    track: 'Content Marketing',
    level: 'Beginner',
    description: 'Discover how to create compelling healthcare content that converts while maintaining compliance and building trust with your audience.',
    attendees: 650,
    featured: false,
    tags: ['Content', 'Healthcare', 'Compliance']
  },
  {
    id: 4,
    title: 'Building a Revenue Machine with HubSpot Operations Hub',
    speaker: 'James Park',
    company: 'SaaS Unicorn Inc',
    time: '02:00 PM - 02:45 PM',
    date: '2025-09-03',
    duration: '45 min',
    type: 'Deep Dive',
    track: 'Revenue Operations',
    level: 'Advanced',
    description: 'Learn how to build a scalable revenue operations function using HubSpot Operations Hub. James will share the exact playbook used to scale ARR from $10M to $100M.',
    attendees: 950,
    featured: true,
    tags: ['RevOps', 'Operations Hub', 'Scaling']
  },
  {
    id: 5,
    title: 'E-commerce Attribution: Tracking the Full Customer Journey',
    speaker: 'Lisa Thompson',
    company: 'E-commerce Plus',
    time: '03:00 PM - 03:30 PM',
    date: '2025-09-03',
    duration: '30 min',
    type: 'Session',
    track: 'Analytics',
    level: 'Intermediate',
    description: 'Master complex e-commerce attribution models and learn how to track the complete customer journey from first touch to purchase and beyond.',
    attendees: 720,
    featured: false,
    tags: ['Attribution', 'E-commerce', 'Analytics']
  },
  {
    id: 6,
    title: 'Enabling Sales Teams for HubSpot Success',
    speaker: 'David Kumar',
    company: 'Enterprise Solutions Co',
    time: '04:00 PM - 04:30 PM',
    date: '2025-09-03',
    duration: '30 min',
    type: 'Workshop',
    track: 'Sales Enablement',
    level: 'Beginner',
    description: 'Learn proven strategies for training and enabling sales teams to maximize their success with HubSpot Sales Hub.',
    attendees: 580,
    featured: false,
    tags: ['Sales Enablement', 'Training', 'Sales Hub']
  }
];

const tracks = [
  'All Tracks',
  'Growth Marketing',
  'Sales Automation',
  'Content Marketing',
  'Revenue Operations',
  'Analytics',
  'Sales Enablement'
];

const sessionTypes = [
  'All Types',
  'Keynote',
  'Workshop',
  'Session',
  'Deep Dive'
];

const levels = [
  'All Levels',
  'Beginner',
  'Intermediate',
  'Advanced'
];

export default function EventsPage() {
  const [selectedTrack, setSelectedTrack] = useState('All Tracks');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const filteredSessions = sessions.filter(session => {
    const matchesTrack = selectedTrack === 'All Tracks' || session.track === selectedTrack;
    const matchesType = selectedType === 'All Types' || session.type === selectedType;
    const matchesLevel = selectedLevel === 'All Levels' || session.level === selectedLevel;
    const matchesSearch = searchQuery === '' || 
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTrack && matchesType && matchesLevel && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Keynote': return <Award className="w-4 h-4" />;
      case 'Workshop': return <Users className="w-4 h-4" />;
      case 'Deep Dive': return <TrendingUp className="w-4 h-4" />;
      default: return <Mic className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Keynote': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Workshop': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Deep Dive': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              <Link href="/events" className="text-orange-500 font-medium">
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
      <section className="bg-gradient-to-br from-orange-600 to-orange-700 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sessions & Workshops
            </h1>
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Discover actionable insights from HubSpot experts and industry leaders. 
              Choose from keynotes, workshops, and deep-dive sessions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <div className="flex items-center text-white">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="font-semibold">September 3-5, 2025</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <div className="flex items-center text-white">
                  <Video className="w-5 h-5 mr-2" />
                  <span className="font-semibold">100% Virtual Event</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search sessions, speakers, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Track Filter */}
              <div className="relative">
                <select
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {tracks.map(track => (
                    <option key={track} value={track}>{track}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {sessionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Level Filter */}
              <div className="relative">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'calendar' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredSessions.length} of {sessions.length} sessions
          </div>
        </div>
      </section>

      {/* Sessions Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {viewMode === 'calendar' ? (
            /* Calendar View */
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Calendar className="w-6 h-6 mr-3" />
                    September 3, 2025 - Day 1
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {filteredSessions.map((session) => (
                    <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Time Column */}
                        <div className="lg:w-32 flex-shrink-0">
                          <div className="flex items-center text-gray-600 mb-2">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="font-medium">{session.time}</span>
                          </div>
                          <div className="text-sm text-gray-500">{session.duration}</div>
                        </div>

                        {/* Session Content */}
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                              {/* Session Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-orange-600 cursor-pointer">
                                    {session.title}
                                  </h3>
                                  <div className="flex items-center text-gray-600 mb-2">
                                    <span className="font-medium">{session.speaker}</span>
                                    <span className="mx-2">•</span>
                                    <span>{session.company}</span>
                                  </div>
                                </div>
                                {session.featured && (
                                  <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                                    Featured
                                  </div>
                                )}
                              </div>

                              {/* Session Meta */}
                              <div className="flex flex-wrap gap-3 mb-4">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(session.type)}`}>
                                  {getTypeIcon(session.type)}
                                  <span className="ml-1">{session.type}</span>
                                </div>
                                <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                  {session.track}
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(session.level)}`}>
                                  {session.level}
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-gray-600 mb-4 leading-relaxed">
                                {session.description}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {session.tags.map((tag, index) => (
                                  <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                                    #{tag}
                                  </span>
                                ))}
                              </div>

                              {/* Session Stats & Actions */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-gray-500">
                                  <Users className="w-4 h-4 mr-1" />
                                  <span>{session.attendees.toLocaleString()} registered</span>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  <button className="text-gray-400 hover:text-orange-500 transition-colors">
                                    <Bookmark className="w-5 h-5" />
                                  </button>
                                  <button className="text-gray-400 hover:text-orange-500 transition-colors">
                                    <Share2 className="w-5 h-5" />
                                  </button>
                                  <Link
                                    href="/register"
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium inline-flex items-center"
                                  >
                                    Reserve Seat
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* List View */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSessions.map((session) => (
                <div key={session.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-orange-600 cursor-pointer">
                          {session.title}
                        </h3>
                        <div className="flex items-center text-gray-600 text-sm mb-3">
                          <span className="font-medium">{session.speaker}</span>
                          <span className="mx-2">•</span>
                          <span>{session.company}</span>
                        </div>
                      </div>
                      {session.featured && (
                        <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold">
                          Featured
                        </div>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{session.time}</span>
                      <span className="mx-2">•</span>
                      <span>{session.duration}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getTypeColor(session.type)}`}>
                        {getTypeIcon(session.type)}
                        <span className="ml-1">{session.type}</span>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(session.level)}`}>
                        {session.level}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {session.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="w-3 h-3 mr-1" />
                        <span>{session.attendees.toLocaleString()}</span>
                      </div>
                      
                      <Link
                        href="/register"
                        className="bg-orange-500 text-white px-3 py-1.5 rounded text-sm hover:bg-orange-600 transition-colors font-medium inline-flex items-center"
                      >
                        Reserve
                        <ArrowRight className="ml-1 w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Join Us?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Don't miss out on these incredible sessions. Register now and secure 
            your spot at Remote Inbound 2025.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-50 transition-colors inline-flex items-center justify-center"
            >
              Register Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/speakers"
              className="bg-orange-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-900 transition-colors inline-flex items-center justify-center"
            >
              Meet the Speakers
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