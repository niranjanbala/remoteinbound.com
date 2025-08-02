export interface User {
  id: string;
  email: string;
  fullName: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  avatar?: string;
  role?: 'fan' | 'partner' | 'sponsor' | 'admin';
  createdAt: string;
  updatedAt: string;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  // Unified fan profile with optional speaking preferences
  fanProfile?: {
    bio?: string;
    interestedInSpeaking: boolean;
    speakingExperience?: 'none' | 'beginner' | 'intermediate' | 'expert';
    expertise?: string[];
    sessionTopics?: string[];
    social?: {
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
    availableForNetworking: boolean;
    hubspotExperience: string[];
    interests: string[];
  };
  // Additional fields for partners
  partnerProfile?: {
    companyDescription: string;
    partnershipType: 'technology' | 'service' | 'integration' | 'community';
    website: string;
    logo?: string;
    offerings: string[];
    interestedInSpeaking: boolean;
  };
  // Additional fields for sponsors
  sponsorProfile?: {
    companyDescription: string;
    sponsorshipTier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'community';
    website: string;
    logo?: string;
    marketingGoals: string[];
    boothRequirements?: string;
    interestedInSpeaking: boolean;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  timezone: string;
  status: 'upcoming' | 'live' | 'ended';
  coverImage?: string;
  maxAttendees?: number;
  currentAttendees: number;
  tags: string[];
  organizer: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar?: string;
  social: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  sessions: string[];
}

export interface Session {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  type: 'keynote' | 'workshop' | 'panel' | 'networking' | 'break';
  speakerIds: string[];
  streamUrl?: string;
  recordingUrl?: string;
  maxAttendees?: number;
  currentAttendees: number;
  tags: string[];
  resources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'video' | 'image';
  url: string;
  description?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  sessionId?: string;
  type: 'message' | 'question' | 'announcement';
}

export interface NetworkingConnection {
  id: string;
  userId1: string;
  userId2: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  message?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Partner {
  id: string;
  userId: string;
  companyName: string;
  companyDescription: string;
  partnershipType: 'technology' | 'service' | 'integration' | 'community';
  website: string;
  logo?: string;
  offerings: string[];
  contactPerson: {
    name: string;
    email: string;
    title: string;
  };
  status: 'pending' | 'approved' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Sponsor {
  id: string;
  userId: string;
  companyName: string;
  companyDescription: string;
  sponsorshipTier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'community';
  website: string;
  logo?: string;
  marketingGoals: string[];
  boothRequirements?: string;
  contactPerson: {
    name: string;
    email: string;
    title: string;
  };
  status: 'pending' | 'approved' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}