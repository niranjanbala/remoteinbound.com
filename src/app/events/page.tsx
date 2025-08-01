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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">RemoteInbound</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/events" className="text-blue-600 font-medium">
                Events
              </Link>
              <Link href="/speakers" className="text-gray-600 hover:text-gray-900 transition-colors">
                Speakers
              </Link>
              <Link href="/schedule" className="text-gray-600 hover:text-gray-900 transition-colors">
                Schedule
              </Link>
              <Link href="/networking" className="text-gray-600 hover:text-gray-900 transition-colors">
                Networking
              </Link>
            </nav>

            <Link
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Join Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals in virtual conferences, workshops, and networking events from around the world
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events, topics, or speakers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Events</option>
                <option value="live">Live Now</option>
                <option value="upcoming">Upcoming</option>
                <option value="ended">Past Events</option>
              </select>

              {/* Tag Filter */}
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Topics</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredEvents.length} of {events.length} events
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Event Image */}
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
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
                          <span className="ml-2 text-blue-600 font-medium">
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
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
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
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block font-medium"
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
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Host Your Own Event?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Create engaging virtual experiences that connect people from around the world
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create-event"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <span>Create Event</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/demo"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}