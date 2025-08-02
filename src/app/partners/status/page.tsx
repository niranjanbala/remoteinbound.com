'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { 
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  Mail,
  Globe,
  ArrowLeft,
  Users,
  Star
} from 'lucide-react';
import { userStorage } from '@/lib/storage';

interface PartnerStatus {
  id: string;
  companyName: string;
  email: string;
  website: string;
  partnershipType: string;
  status: 'pending' | 'approved' | 'active';
  appliedAt: string;
  approvedAt?: string;
}

export default function PartnerStatusPage() {
  const [partnerStatus, setPartnerStatus] = useState<PartnerStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = userStorage.getCurrentUser();
    if (currentUser && currentUser.role === 'partner' && currentUser.partnerProfile) {
      // Simulate partner status - in real app this would come from database
      const status: PartnerStatus = {
        id: currentUser.id,
        companyName: currentUser.company || 'Unknown Company',
        email: currentUser.email,
        website: currentUser.partnerProfile.website,
        partnershipType: currentUser.partnerProfile.partnershipType,
        status: 'pending', // Default status for new applications
        appliedAt: currentUser.createdAt,
        approvedAt: undefined
      };
      setPartnerStatus(status);
    }
    setLoading(false);
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: 'Application Under Review',
          description: 'Your mission partner application is being reviewed by our team.'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Application Approved',
          description: 'Congratulations! Your application has been approved. Welcome to the mission!'
        };
      case 'active':
        return {
          icon: Star,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Active Mission Partner',
          description: 'You are now an active mission partner helping build the HubSpot community.'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Status Unknown',
          description: 'Unable to determine your current status.'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!partnerStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center">
                <Logo size="md" />
              </Link>
              <Link
                href="/login"
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Partner Application Found</h2>
            <p className="text-gray-600 mb-6">
              You don't have a partner application on file. Ready to join the mission?
            </p>
            <Link
              href="/register/partner"
              className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Join the Mission
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(partnerStatus.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
            <Link
              href="/dashboard"
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              href="/partners"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Partners
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                Mission Partner Status
              </h1>
              <p className="text-orange-100">
                Track your journey as a Remote Inbound mission partner
              </p>
            </div>

            <div className="p-8">
              {/* Status Card */}
              <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2 rounded-xl p-6 mb-8`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
                    <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${statusInfo.color}`}>{statusInfo.title}</h3>
                    <p className="text-gray-600 mt-1">{statusInfo.description}</p>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Building className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">Company Details</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Company:</span>
                      <p className="font-medium text-gray-900">{partnerStatus.companyName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Partnership Type:</span>
                      <p className="font-medium text-gray-900 capitalize">{partnerStatus.partnershipType}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">Contact Information</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{partnerStatus.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <a 
                        href={partnerStatus.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-orange-600 hover:text-orange-700"
                      >
                        {partnerStatus.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Application Timeline</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Application Submitted</p>
                      <p className="text-sm text-gray-500">
                        {new Date(partnerStatus.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      partnerStatus.status === 'pending' ? 'bg-orange-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">Under Review</p>
                      <p className="text-sm text-gray-500">
                        {partnerStatus.status === 'pending' ? 'In progress...' : 'Completed'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      partnerStatus.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">Mission Partner Active</p>
                      <p className="text-sm text-gray-500">
                        {partnerStatus.approvedAt ? new Date(partnerStatus.approvedAt).toLocaleDateString() : 'Pending approval'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              {partnerStatus.status === 'pending' && (
                <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h4 className="font-semibold text-orange-900 mb-2">What's Next?</h4>
                  <p className="text-orange-800 text-sm mb-4">
                    Our team is reviewing your application. We'll get back to you within 48 hours with next steps.
                  </p>
                  <p className="text-orange-700 text-sm">
                    Questions? Email us at <a href="mailto:partners@remoteinbound.com" className="underline">partners@remoteinbound.com</a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}