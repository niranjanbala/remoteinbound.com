'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar, Users, Tag, Youtube, CheckCircle, AlertCircle } from 'lucide-react';

interface Session {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  tags: string[];
  room?: string;
  max_attendees?: number;
  claim_status: 'available' | 'claimed' | 'confirmed' | 'completed';
  new_speaker?: {
    name: string;
    company: string;
    avatar?: string;
  };
  youtube_stream_url?: string;
  claimed_at?: string;
  confirmed_at?: string;
  duration?: number;
  time?: string;
  date?: string;
}

interface AvailableSessionsProps {
  currentUserId?: string;
  isAdmin?: boolean;
}

export function AvailableSessions({ currentUserId, isAdmin = false }: AvailableSessionsProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('available');
  const [dayFilter, setDayFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [summary, setSummary] = useState({
    available: 0,
    claimed: 0,
    confirmed: 0,
    completed: 0
  });
  const [claimingSession, setClaimingSession] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, [filter, dayFilter, topicFilter]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: filter,
        ...(currentUserId && { userId: currentUserId }),
        ...(dayFilter && { day: dayFilter }),
        ...(topicFilter && { topic: topicFilter })
      });
      
      const response = await fetch(`/api/sessions/claims?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setSessions(data.sessions);
        setSummary(data.summary);
      } else {
        console.error('Error loading sessions:', data.error);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimSession = async (sessionId: string) => {
    if (!currentUserId) {
      alert('Please log in to claim sessions');
      return;
    }

    try {
      setClaimingSession(sessionId);
      const response = await fetch(`/api/sessions/${sessionId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          speakerId: currentUserId,
          notes: 'Session claimed via web interface'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`Successfully claimed session: ${data.message}`);
        loadSessions(); // Refresh the list
      } else {
        alert(`Failed to claim session: ${data.error}`);
      }
    } catch (error) {
      console.error('Error claiming session:', error);
      alert('Failed to claim session. Please try again.');
    } finally {
      setClaimingSession(null);
    }
  };

  const releaseSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to release this session claim?')) {
      return;
    }

    try {
      const response = await fetch(`/api/sessions/${sessionId}/claim`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        loadSessions(); // Refresh the list
      } else {
        alert(`Failed to release session: ${data.error}`);
      }
    } catch (error) {
      console.error('Error releasing session:', error);
      alert('Failed to release session. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <AlertCircle className="w-4 h-4 text-green-500" />;
      case 'claimed':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'claimed':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading sessions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Day:</label>
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Days</option>
            <option value="Sep 3">Sep 3 (Day 1)</option>
            <option value="Sep 4">Sep 4 (Day 2)</option>
            <option value="Sep 5">Sep 5 (Day 3)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Topic:</label>
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Topics</option>
            <option value="Culture & Trends">Culture & Trends</option>
            <option value="Customer Success">Customer Success</option>
            <option value="GTM Data & Systems">GTM Data & Systems</option>
            <option value="HubSpot Products">HubSpot Products</option>
            <option value="Marketing">Marketing</option>
            <option value="Networking">Networking</option>
            <option value="RevOps">RevOps</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('available')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'available' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Available ({summary.available})
        </button>
        <button
          onClick={() => setFilter('claimed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'claimed' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Claimed ({summary.claimed})
        </button>
        <button
          onClick={() => setFilter('confirmed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'confirmed' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Confirmed ({summary.confirmed})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'completed' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completed ({summary.completed})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Sessions ({sessions.length})
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid gap-6">
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No sessions found</p>
            <p>Try changing the filter or check back later.</p>
          </div>
        ) : (
          sessions.map(session => (
            <div key={session.id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Session Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 pr-4">
                      {session.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(session.claim_status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.claim_status)}`}>
                        {session.claim_status.charAt(0).toUpperCase() + session.claim_status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Session Description */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {session.description}
                  </p>
                  
                  {/* Session Meta */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{session.time}</span>
                      {session.duration && <span>({session.duration}min)</span>}
                    </div>
                    {session.room && (
                      <div className="flex items-center gap-1">
                        <span>📍 {session.room}</span>
                      </div>
                    )}
                    {session.max_attendees && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Max {session.max_attendees}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {session.tags && session.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {session.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Speaker Info */}
                  {session.new_speaker && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                      {session.new_speaker.avatar && (
                        <img 
                          src={session.new_speaker.avatar} 
                          alt={session.new_speaker.name}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{session.new_speaker.name}</p>
                        <p className="text-sm text-gray-600">{session.new_speaker.company}</p>
                      </div>
                      {session.youtube_stream_url && (
                        <div className="ml-auto">
                          <a 
                            href={session.youtube_stream_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors"
                          >
                            <Youtube className="w-4 h-4" />
                            YouTube
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                {session.claim_status === 'available' && currentUserId && (
                  <button
                    onClick={() => claimSession(session.id)}
                    disabled={claimingSession === session.id}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {claimingSession === session.id ? 'Claiming...' : 'Claim Session'}
                  </button>
                )}
                
                {session.claim_status === 'claimed' && isAdmin && (
                  <button
                    onClick={() => releaseSession(session.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Release Claim
                  </button>
                )}

                <button
                  onClick={() => window.open(`/sessions/${session.id}`, '_blank')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}