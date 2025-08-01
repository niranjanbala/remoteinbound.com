'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Users, 
  Search, 
  Filter,
  Tag,
  ArrowRight,
  Play
} from 'lucide-react';
import { Event } from '@/types';
import { formatDate, formatTime, getTimeUntilDate } from '@/lib/utils';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'live' | 'ended'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    // Load events from database or API
    // For now, initialize with empty array - events will be loaded from database
    setEvents([]);
    setFilteredEvents([]);
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(event => event.status === selectedStatus);
    }

    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(event => event.tags.includes(selectedTag));
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedStatus, selectedTag]);

  const allTags = Array.from(new Set(events.flatMap(event => event.tags)));

  const getStatusBadge = (status: Event['status']) => {
    switch (status) {
      case 'live':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            LIVE
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            UPCOMING
          </span>
        );
      case 'ended':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            ENDED
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-orange-500">
                Remote Inbound
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/events" className="text-orange-500 font-medium">
                Events
              </Link>
              <Link href="/speakers" className="text-gray-700 hover:text-orange-500 font-medium">
                Speakers
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-700 hover:text-orange-500 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors font-medium"
              >
                Join Free
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
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Remote Inbound 2025 Sessions
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover amazing sessions from HubSpot fans sharing their expertise, strategies, and innovations
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search sessions, topics, or speakers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
              
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'upcoming' | 'live' | 'ended')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Sessions</option>
                <option value="live">Live Now</option>
                <option value="upcoming">Upcoming</option>
                <option value="ended">Past Sessions</option>
              </select>

              {/* Tag Filter */}
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Topics</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredEvents.length} of {events.length} sessions
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sessions Coming Soon</h3>
              <p className="text-gray-600 mb-8">We're curating amazing sessions from HubSpot fans around the world. Check back soon for updates!</p>
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                <Calendar className="w-4 h-4 mr-2" />
                September 3-5, 2025 • First Edition
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Event Image */}
                  <div className="h-48 bg-gradient-to-r from-orange-500 to-orange-600 relative">
                    <div className="absolute top-4 left-4">
                      {getStatusBadge(event.status)}
                    </div>
                    <div className="absolute top-4 right-4">
                      {event.status === 'live' && (
                        <button className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 hover:bg-white/30 transition-colors">
                          <Play className="w-4 h-4" />
                          <span>Watch</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{formatTime(event.startDate)} {event.timezone}</span>
                        {event.status === 'upcoming' && (
                          <span className="ml-2 text-orange-600 font-medium">
                            ({getTimeUntilDate(event.startDate)})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{event.currentAttendees.toLocaleString()} attendees</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {event.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{event.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/events/${event.id}`}
                      className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors text-center block font-medium"
                    >
                      {event.status === 'live' ? 'Join Now' : event.status === 'upcoming' ? 'Register Free' : 'View Details'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Want to Share Your HubSpot Expertise?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join fellow HubSpot fans in sharing knowledge and building our community
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-orange-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <span>Join the Community</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/speakers"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors"
            >
              Meet Our Speakers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}