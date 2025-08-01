'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Users,
  Settings,
  LogOut,
  Bell,
  Edit3,
  Eye,
  Video,
  Globe,
  ChevronRight,
  Activity,
  Award,
  BookOpen
} from 'lucide-react';
import { User as UserType, Event } from '@/types';
import { eventService, registrationService, userService } from '@/lib/database';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserType | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'profile'>('overview');

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
      return;
    }

    if (session?.user) {
      // Convert NextAuth user to our User type
      const currentUser: UserType = {
        id: session.user.id,
        email: session.user.email || '',
        fullName: session.user.name || '',
        company: undefined,
        jobTitle: undefined,
        phone: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setUser(currentUser);
      loadDashboardData(session.user.id);
    }
  }, [session, status, router]);

  const loadDashboardData = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Load user's registered events
      const registrationIds = await registrationService.getByUserId(userId);
      const userEvents = [];
      
      for (const eventId of registrationIds) {
        const event = await eventService.getById(eventId);
        if (event) {
          userEvents.push(event);
        }
      }
      
      setRegisteredEvents(userEvents);
      
      // Load upcoming events (for discovery)
      const allEvents = await eventService.getAll();
      const upcoming = allEvents
        .filter(event => event.status === 'upcoming')
        .slice(0, 3);
      
      setUpcomingEvents(upcoming);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to local storage if database fails
      const localEvents = JSON.parse(localStorage.getItem('events') || '[]');
      setUpcomingEvents(localEvents.slice(0, 3));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">RemoteInbound</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.fullName}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.fullName}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                    activeTab === 'overview' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Activity className="w-5 h-5" />
                  <span>Overview</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('events')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                    activeTab === 'events' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>My Events</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                    activeTab === 'profile' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                
                <Link
                  href="/events"
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Browse Events</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                  <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
                  <p className="text-blue-100">
                    You have {registeredEvents.length} registered events and {upcomingEvents.length} new events to explore.
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Registered Events</p>
                        <p className="text-2xl font-bold text-gray-900">{registeredEvents.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Hours Attended</p>
                        <p className="text-2xl font-bold text-gray-900">{registeredEvents.length * 2}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Certificates</p>
                        <p className="text-2xl font-bold text-gray-900">{registeredEvents.filter(e => e.status === 'ended').length}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Discover New Events</h2>
                    <Link href="/events" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View all
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Video className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{event.title}</h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(event.startDate)} • {formatTime(event.startDate)}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
                  <Link
                    href="/events"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Browse Events</span>
                  </Link>
                </div>

                {registeredEvents.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events registered yet</h3>
                    <p className="text-gray-500 mb-6">
                      Discover amazing virtual events and start your learning journey.
                    </p>
                    <Link
                      href="/events"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Browse Events</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {registeredEvents.map((event) => (
                      <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  event.status === 'upcoming' 
                                    ? 'bg-blue-100 text-blue-800'
                                    : event.status === 'live'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </span>
                                <Globe className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-500">Virtual Event</span>
                              </div>
                              
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                              
                              <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(event.startDate)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{event.currentAttendees} attendees</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              {event.status === 'live' && (
                                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
                                  <Video className="w-4 h-4" />
                                  <span>Join Live</span>
                                </button>
                              )}
                              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                    <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{user?.fullName}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{user?.email}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{user?.company || 'Not specified'}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{user?.jobTitle || 'Not specified'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive updates about your registered events</p>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                        Enabled
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Marketing Emails</h3>
                        <p className="text-sm text-gray-500">Get notified about new events and features</p>
                      </div>
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm">
                        Disabled
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}