'use client';

import React, { useState, useEffect } from 'react';

interface RemoteSpeaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar?: string;
  profile_image?: string;
  social_twitter?: string;
  social_linkedin?: string;
  social_website?: string;
  sessions: string[];
  external_id?: string;
  session_count?: number;
  session_titles?: string[];
  created_at: string;
  updated_at: string;
}

interface RemoteSpeakersResponse {
  speakers: RemoteSpeaker[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function RemoteSpeakers() {
  const [speakers, setSpeakers] = useState<RemoteSpeaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [dayFilter, setDayFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [includeDetails, setIncludeDetails] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [syncing, setSyncing] = useState(false);

  // Get unique companies for filter
  const companies = Array.from(new Set(speakers.map(speaker => speaker.company))).sort();

  const fetchSpeakers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        include_details: includeDetails.toString()
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCompany) params.append('company', selectedCompany);

      const response = await fetch(`/api/remote-speakers?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch remote speakers');
      }

      const data: RemoteSpeakersResponse = await response.json();
      setSpeakers(data.speakers);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSpeakers([]);
    } finally {
      setLoading(false);
    }
  };

  const syncAllSpeakers = async () => {
    try {
      setSyncing(true);
      const response = await fetch('/api/remote-speakers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync_all' })
      });

      if (!response.ok) {
        throw new Error('Failed to sync speakers');
      }

      const result = await response.json();
      alert(`Successfully synced ${result.synced_count} speakers to remote_speakers table`);
      fetchSpeakers(); // Refresh the list
    } catch (err) {
      alert(`Error syncing speakers: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSyncing(false);
    }
  };

  const syncSingleSpeaker = async (speakerId: string) => {
    try {
      const response = await fetch('/api/remote-speakers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'sync_one',
          speaker_id: speakerId 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to sync speaker');
      }

      alert('Speaker synced successfully');
      fetchSpeakers(); // Refresh the list
    } catch (err) {
      alert(`Error syncing speaker: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const deleteSpeaker = async (speakerId: string) => {
    if (!confirm('Are you sure you want to delete this remote speaker?')) {
      return;
    }

    try {
      const response = await fetch(`/api/remote-speakers?id=${speakerId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete speaker');
      }

      alert('Speaker deleted successfully');
      fetchSpeakers(); // Refresh the list
    } catch (err) {
      alert(`Error deleting speaker: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, [currentPage, searchTerm, selectedCompany, dayFilter, includeDetails]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSpeakers();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading && speakers.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading remote speakers...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Remote Speakers Management</h1>
          <div className="flex gap-2">
            <button
              onClick={syncAllSpeakers}
              disabled={syncing}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {syncing ? 'Syncing...' : 'Sync All Speakers'}
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search speakers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-2 w-64"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Companies</option>
            {companies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>

          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Days</option>
            <option value="Sep 3">Sep 3 (Day 1)</option>
            <option value="Sep 4">Sep 4 (Day 2)</option>
            <option value="Sep 5">Sep 5 (Day 3)</option>
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeDetails}
              onChange={(e) => setIncludeDetails(e.target.checked)}
            />
            Include Session Details
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Speakers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {speakers.map((speaker) => (
          <div key={speaker.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              {(speaker.avatar || speaker.profile_image) && (
                <img
                  src={speaker.avatar || speaker.profile_image}
                  alt={speaker.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{speaker.name}</h3>
                <p className="text-gray-600">{speaker.title}</p>
                <p className="text-sm text-gray-500">{speaker.company}</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3 line-clamp-3">{speaker.bio}</p>

            {includeDetails && (
              <div className="mb-3">
                <p className="text-sm font-medium">Sessions: {speaker.session_count || 0}</p>
                {speaker.session_titles && speaker.session_titles.length > 0 && (
                  <div className="text-xs text-gray-600 mt-1">
                    {speaker.session_titles.slice(0, 2).map((title, index) => (
                      <div key={index} className="truncate">• {title}</div>
                    ))}
                    {speaker.session_titles.length > 2 && (
                      <div className="text-gray-500">... and {speaker.session_titles.length - 2} more</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Social Links */}
            <div className="flex gap-2 mb-3">
              {speaker.social_linkedin && (
                <a
                  href={speaker.social_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  LinkedIn
                </a>
              )}
              {speaker.social_twitter && (
                <a
                  href={speaker.social_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-600 text-sm"
                >
                  Twitter
                </a>
              )}
              {speaker.social_website && (
                <a
                  href={speaker.social_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  Website
                </a>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => syncSingleSpeaker(speaker.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Sync
              </button>
              <button
                onClick={() => deleteSpeaker(speaker.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            {speaker.external_id && (
              <div className="text-xs text-gray-400 mt-2">
                ID: {speaker.external_id}
              </div>
            )}
          </div>
        ))}
      </div>

      {speakers.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No remote speakers found. Try adjusting your search criteria or sync speakers from the main speakers table.
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          <span className="px-4 py-2">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}