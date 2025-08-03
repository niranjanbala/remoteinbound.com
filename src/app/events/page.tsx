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
import { useState, useEffect } from 'react';

// Types for our session data
interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar?: string;
  profile_image?: string;
}

interface Tag {
  name: string;
  category?: string;
}

interface Session {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  session_level: string;
  reservation_required: boolean;
  sponsor_name?: string;
  sponsor_logo?: string;
  room?: string;
  max_attendees?: number;
  current_attendees: number;
  speakers: Speaker[];
  tags: Tag[];
  duration?: number;
  time?: string;
  date?: string;
  type: string;
  track: string;
  featured: boolean;
  attendees: number;
}


export default function EventsPage() {
  const [selectedTrack, setSelectedTrack] = useState('All Tracks');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedTrack !== 'All Tracks') params.append('track', selectedTrack);
        if (selectedType !== 'All Types') params.append('type', selectedType);
        if (selectedLevel !== 'All Levels') params.append('level', selectedLevel);

        const response = await fetch(`/api/sessions?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }

        const data = await response.json();
        setSessions(data.sessions || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load sessions. Please try again later.');
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [searchQuery, selectedTrack, selectedType, selectedLevel]);

  // Generate dynamic filter options from loaded sessions
  const tracks = ['All Tracks', ...Array.from(new Set(sessions.map(s => s.track)))];
  const sessionTypes = ['All Types', ...Array.from(new Set(sessions.map(s => s.type)))];
  const levels = ['All Levels', ...Array.from(new Set(sessions.map(s => s.session_level)))];

  const filteredSessions = sessions.filter(session => {
    const matchesTrack = selectedTrack === 'All Tracks' || session.track === selectedTrack;
    const matchesType = selectedType === 'All Types' || session.type === selectedType;
    const matchesLevel = selectedLevel === 'All Levels' || session.session_level === selectedLevel;
    const matchesSearch = searchQuery === '' ||
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.speakers.some(speaker => speaker.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
            {loading ? (
              'Loading sessions...'
            ) : error ? (
              <span className="text-red-600">{error}</span>
            ) : (
              `Showing ${filteredSessions.length} of ${sessions.length} sessions`
            )}
          </div>
        </div>
      </section>

      {/* Sessions Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading sessions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No sessions found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedTrack('All Tracks');
                  setSelectedType('All Types');
                  setSelectedLevel('All Levels');
                  setSearchQuery('');
                }}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'calendar' ? (
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
                            <span className="font-medium">{session.time || 'Time TBA'}</span>
                          </div>
                          {session.duration && (
                            <div className="text-sm text-gray-500">{session.duration} min</div>
                          )}
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
                                    {session.speakers.length > 0 ? (
                                      <>
                                        <span className="font-medium">{session.speakers[0].name}</span>
                                        <span className="mx-2">•</span>
                                        <span>{session.speakers[0].company}</span>
                                        {session.speakers.length > 1 && (
                                          <span className="ml-2 text-sm text-gray-500">
                                            +{session.speakers.length - 1} more
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-gray-500">Speaker TBA</span>
                                    )}
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
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(session.session_level)}`}>
                                  {session.session_level}
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
                                    #{typeof tag === 'string' ? tag : tag.name}
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
                          {session.speakers.length > 0 ? (
                            <>
                              <span className="font-medium">{session.speakers[0].name}</span>
                              <span className="mx-2">•</span>
                              <span>{session.speakers[0].company}</span>
                              {session.speakers.length > 1 && (
                                <span className="ml-2 text-xs text-gray-500">
                                  +{session.speakers.length - 1} more
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-500">Speaker TBA</span>
                          )}
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
                      <span>{session.time || 'Time TBA'}</span>
                      {session.duration && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{session.duration} min</span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getTypeColor(session.type)}`}>
                        {getTypeIcon(session.type)}
                        <span className="ml-1">{session.type}</span>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(session.session_level)}`}>
                        {session.session_level}
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