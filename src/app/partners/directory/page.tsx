'use client';

import { useState, useEffect } from 'react';
import { Users, Building2, Globe, Mail, Phone, ExternalLink, CheckCircle, Clock, AlertCircle, Plus, Search, Filter, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Partner {
  id: string;
  email: string;
  fullName: string;
  company: string;
  jobTitle: string;
  phone: string;
  role: string;
  preferences: {
    notifications: boolean;
    theme: string;
  };
  partnerProfile: {
    companyDescription: string;
    partnershipType: string;
    website: string;
    offerings: string[];
    interestedInSpeaking: boolean;
  };
  partnerStatus: {
    status: string;
    appliedAt: string;
    approvedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PartnerDirectoryPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const loadPartners = async () => {
      try {
        // Try to load from imported data first
        const response = await fetch('/data/imported_partners.json');
        if (response.ok) {
          const importedPartners = await response.json();
          setPartners(importedPartners);
          setLoading(false);
          return;
        }

        // Fallback to localStorage
        const storedPartners = localStorage.getItem('partners');
        if (storedPartners) {
          setPartners(JSON.parse(storedPartners));
        }
      } catch (error) {
        console.error('Error loading partners:', error);
        // Fallback to localStorage if fetch fails
        const storedPartners = localStorage.getItem('partners');
        if (storedPartners) {
          setPartners(JSON.parse(storedPartners));
        }
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, []);

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.partnerProfile.companyDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.partnerProfile.offerings.some(offering => 
                           offering.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesStatus = statusFilter === 'all' || partner.partnerStatus.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPartnerSlug = (company: string) => {
    return company.toLowerCase().replace(/\s+/g, '-');
  };

  const activePartners = partners.filter(p => p.partnerStatus.status === 'active').length;
  const approvedPartners = partners.filter(p => p.partnerStatus.status === 'approved').length;
  const pendingPartners = partners.filter(p => p.partnerStatus.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link 
            href="/partners" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 transition-colors"
          >
            ← Back to Partners Overview
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Technology Partner Directory
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our technology partners powering Remote Inbound's HubSpot community events. 
            Click on any partner to learn more about their services and offerings.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{partners.length}</div>
            <div className="text-gray-600">Total Partners</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{activePartners}</div>
            <div className="text-gray-600">Active Partners</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{approvedPartners}</div>
            <div className="text-gray-600">Approved Partners</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">{pendingPartners}</div>
            <div className="text-gray-600">Pending Review</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search partners by company, description, or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Partners Grid */}
        {filteredPartners.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No partners found' : 'No partners yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Be the first to join our technology partner program!'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Link 
                href="/register/partner"
                className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Become a Partner
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredPartners.map((partner) => (
              <Link 
                key={partner.id} 
                href={`/partners/${getPartnerSlug(partner.company)}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                          {partner.company}
                        </h3>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(partner.partnerStatus.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(partner.partnerStatus.status)}`}>
                          {partner.partnerStatus.status.charAt(0).toUpperCase() + partner.partnerStatus.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {partner.partnerProfile.companyDescription}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {partner.partnerProfile.offerings.slice(0, 3).map((offering, index) => (
                        <span 
                          key={index}
                          className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium"
                        >
                          {offering}
                        </span>
                      ))}
                      {partner.partnerProfile.offerings.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{partner.partnerProfile.offerings.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{partner.fullName}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="p-2 text-gray-400 group-hover:text-orange-600 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join the Mission</h2>
          <p className="text-xl text-orange-100 mb-6 max-w-2xl mx-auto">
            Ready to become a technology partner? Join our growing community of innovative companies 
            shaping the future of HubSpot and remote work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register/partner"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Become a Partner
            </Link>
            <Link 
              href="/partners/status"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Check Application Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}