'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Filter,
  Building,
  ExternalLink,
  Twitter,
  Linkedin,
  Globe,
  Calendar,
  Star,
  Award,
  BookOpen,
  Heart
} from 'lucide-react';
import { Speaker } from '@/types';

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [filteredSpeakers, setFilteredSpeakers] = useState<Speaker[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');

  useEffect(() => {
    // Load speakers from database or API
    // For now, initialize with empty array - speakers will be loaded from database
    setSpeakers([]);
    setFilteredSpeakers([]);
  }, []);

  useEffect(() => {
    let filtered = speakers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(speaker =>
        speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        speaker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        speaker.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        speaker.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by company
    if (selectedCompany !== 'all') {
      filtered = filtered.filter(speaker => speaker.company === selectedCompany);
    }

    // Filter by expertise (based on title keywords)
    if (selectedExpertise !== 'all') {
      filtered = filtered.filter(speaker => 
        speaker.title.toLowerCase().includes(selectedExpertise.toLowerCase())
      );
    }

    setFilteredSpeakers(filtered);
  }, [speakers, searchTerm, selectedCompany, selectedExpertise]);

  const allCompanies = Array.from(new Set(speakers.map(speaker => speaker.company)));
  const expertiseAreas = ['Marketing', 'Sales', 'Customer Success', 'Operations', 'RevOps', 'Growth'];

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'website':
        return <Globe className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
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
              <Link href="/events" className="text-gray-700 hover:text-orange-500 font-medium">
                Events
              </Link>
              <Link href="/speakers" className="text-orange-500 font-medium">
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
            Meet Our HubSpot Fan Speakers
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Learn from passionate HubSpot users who are sharing their real-world expertise and innovative strategies
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search speakers by name, company, or expertise..."
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
              
              {/* Company Filter */}
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Companies</option>
                {allCompanies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>

              {/* Expertise Filter */}
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Expertise</option>
                {expertiseAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredSpeakers.length} of {speakers.length} speakers
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredSpeakers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Speakers Coming Soon</h3>
              <p className="text-gray-600 mb-8">We're curating amazing HubSpot fan speakers from around the world. Check back soon for updates!</p>
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  <Heart className="w-4 h-4 mr-2" />
                  100% Fan-Driven Speakers
                </div>
                <div className="block">
                  <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    <Calendar className="w-4 h-4 mr-2" />
                    September 3-5, 2025 • First Edition
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredSpeakers.map((speaker) => (
                <div key={speaker.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Speaker Avatar */}
                  <div className="p-6 text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {speaker.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {speaker.name}
                    </h3>
                    <p className="text-orange-600 font-medium mb-1">
                      {speaker.title}
                    </p>
                    <div className="flex items-center justify-center text-gray-600 text-sm mb-4">
                      <Building className="w-4 h-4 mr-1" />
                      <span>{speaker.company}</span>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {speaker.bio}
                    </p>

                    {/* Social Links */}
                    <div className="flex justify-center space-x-3 mb-4">
                      {Object.entries(speaker.social).map(([platform, url]) => (
                        url && (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                          >
                            {getSocialIcon(platform)}
                          </a>
                        )
                      ))}
                    </div>

                    {/* Sessions Count */}
                    <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{speaker.sessions.length} session{speaker.sessions.length !== 1 ? 's' : ''}</span>
                    </div>

                    {/* View Profile Button */}
                    <Link
                      href={`/speakers/${speaker.id}`}
                      className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-center block font-medium"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              HubSpot Fan Speaker Highlights
            </h2>
            <p className="text-xl text-gray-600">
              Our speakers bring decades of combined HubSpot experience and passion for sharing knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-gray-600">Fan-Driven</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
              <div className="text-gray-600">Companies Represented</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Years Combined Experience</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">First</div>
              <div className="text-gray-600">Edition Event</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Want to Share Your HubSpot Story?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join fellow HubSpot fans in sharing your expertise with our global community
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-orange-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join the Community
            </Link>
            <Link
              href="/events"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors"
            >
              View Sessions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}