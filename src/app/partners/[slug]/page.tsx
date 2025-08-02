'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Mail, Phone, Calendar, CheckCircle, Clock, AlertCircle, Users, Zap, Globe, UserPlus } from 'lucide-react';

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

export default function PartnerDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartner = async () => {
      try {
        // Try to load from imported data first
        const response = await fetch('/data/imported_partners.json');
        if (response.ok) {
          const partners: Partner[] = await response.json();
          const foundPartner = partners.find(p => 
            p.company.toLowerCase().replace(/\s+/g, '-') === slug
          );
          if (foundPartner) {
            setPartner(foundPartner);
            setLoading(false);
            return;
          }
        }

        // Fallback to localStorage or API
        const storedPartners = localStorage.getItem('partners');
        if (storedPartners) {
          const partners: Partner[] = JSON.parse(storedPartners);
          const foundPartner = partners.find(p => 
            p.company.toLowerCase().replace(/\s+/g, '-') === slug
          );
          if (foundPartner) {
            setPartner(foundPartner);
          }
        }
      } catch (error) {
        console.error('Error loading partner:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPartner();
  }, [slug]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
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

  const generatePrefilledRegistrationUrl = (partner: Partner) => {
    const baseUrl = '/register/partner';
    const params = new URLSearchParams({
      name: partner.fullName,
      email: partner.email,
      company: partner.company,
      jobTitle: partner.jobTitle,
      phone: partner.phone || '',
      website: partner.partnerProfile.website,
      companyDescription: partner.partnerProfile.companyDescription,
      partnershipType: partner.partnerProfile.partnershipType,
      offerings: JSON.stringify(partner.partnerProfile.offerings),
      interestedInSpeaking: partner.partnerProfile.interestedInSpeaking.toString()
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="h-12 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Link 
            href="/partners" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Partners
          </Link>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Partner Not Found</h1>
            <p className="text-gray-600 mb-6">
              The partner you're looking for doesn't exist or may have been removed.
            </p>
            <Link 
              href="/partners"
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              View All Partners
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <Link 
          href="/partners" 
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Partners
        </Link>

        {/* Partner Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{partner.company}</h1>
                <p className="text-orange-100 text-lg">{partner.partnerProfile.companyDescription}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(partner.partnerStatus.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(partner.partnerStatus.status)}`}>
                  {partner.partnerStatus.status.charAt(0).toUpperCase() + partner.partnerStatus.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Offerings */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    Services & Offerings
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {partner.partnerProfile.offerings.map((offering, index) => (
                      <span 
                        key={index}
                        className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {offering}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Partnership Details */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    Partnership Details
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Partnership Type:</span>
                      <span className="font-medium capitalize">{partner.partnerProfile.partnershipType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Speaking Interest:</span>
                      <span className={`font-medium ${partner.partnerProfile.interestedInSpeaking ? 'text-green-600' : 'text-gray-500'}`}>
                        {partner.partnerProfile.interestedInSpeaking ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applied:</span>
                      <span className="font-medium">
                        {new Date(partner.partnerStatus.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {partner.partnerStatus.approvedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved:</span>
                        <span className="font-medium">
                          {new Date(partner.partnerStatus.approvedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Contact Person</div>
                      <div className="font-medium">{partner.fullName}</div>
                      <div className="text-sm text-gray-600">{partner.jobTitle}</div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4" />
                      <a 
                        href={`mailto:${partner.email}`}
                        className="hover:text-orange-600 transition-colors"
                      >
                        {partner.email}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4" />
                      <a 
                        href={`tel:${partner.phone}`}
                        className="hover:text-orange-600 transition-colors"
                      >
                        {partner.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <Globe className="w-4 h-4" />
                      <a 
                        href={partner.partnerProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-orange-600 transition-colors flex items-center gap-1"
                      >
                        Visit Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Link
                      href={generatePrefilledRegistrationUrl(partner)}
                      className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Register as Partner
                    </Link>
                    
                    <a
                      href={`mailto:${partner.email}?subject=Remote Inbound Partnership Inquiry`}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Send Email
                    </a>
                    
                    <a
                      href={partner.partnerProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Partners */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Explore More Partners</h2>
          <div className="flex justify-center">
            <Link 
              href="/partners"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              View All Technology Partners
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}