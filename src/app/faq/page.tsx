'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { 
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  Globe,
  Heart,
  Award,
  Zap,
  HelpCircle,
  Mail,
  Clock,
  Video,
  Wifi,
  Coffee
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'registration' | 'event' | 'technical' | 'community';
}

const faqData: FAQItem[] = [
  // General Questions
  {
    id: 'what-is-remote-inbound',
    question: 'What is Remote Inbound 2025?',
    answer: 'Remote Inbound 2025 is the first-ever fan-driven virtual HubSpot community event. Created by HubSpot super users for the global HubSpot community, it features expert sessions, networking opportunities, and insights into inbound marketing, sales, and customer success.',
    category: 'general'
  },
  {
    id: 'who-organizes',
    question: 'Who organizes Remote Inbound?',
    answer: 'Remote Inbound is organized by passionate HubSpot super users and community members. While we\'re inspired by HubSpot\'s INBOUND conference, this is an independent, fan-driven initiative not officially affiliated with HubSpot, Inc.',
    category: 'general'
  },
  {
    id: 'cost',
    question: 'How much does it cost to attend?',
    answer: 'Remote Inbound 2025 is completely FREE! Our mission is to make high-quality inbound marketing education accessible to everyone in the HubSpot community, regardless of budget or location.',
    category: 'general'
  },
  {
    id: 'when-where',
    question: 'When and where is Remote Inbound 2025?',
    answer: 'Remote Inbound 2025 takes place September 3-5, 2025, entirely online. You can attend from anywhere in the world with an internet connection. All sessions will be recorded for later viewing.',
    category: 'general'
  },

  // Registration Questions
  {
    id: 'how-to-register',
    question: 'How do I register for Remote Inbound?',
    answer: 'Simply visit our registration page and choose your attendee type (Attendee, Speaker, Partner, or Sponsor). Fill out the form with your details, and you\'ll receive a confirmation email with access instructions.',
    category: 'registration'
  },
  {
    id: 'registration-types',
    question: 'What are the different registration types?',
    answer: 'We offer four registration types: Attendee (general participation), Speaker (present sessions), Partner (showcase services), and Sponsor (support the event). Each type has different benefits and requirements.',
    category: 'registration'
  },
  {
    id: 'speaker-application',
    question: 'How can I become a speaker?',
    answer: 'Apply through our Speaker Registration form. We\'re looking for HubSpot experts who can share practical insights on inbound marketing, sales automation, customer success, and HubSpot best practices. Applications are reviewed by our community panel.',
    category: 'registration'
  },
  {
    id: 'partnership-opportunities',
    question: 'What partnership opportunities are available?',
    answer: 'We offer Partner and Sponsor registrations for agencies, consultants, and companies wanting to connect with the HubSpot community. Partners can showcase services, while Sponsors support the event and gain visibility.',
    category: 'registration'
  },

  // Event Questions
  {
    id: 'session-topics',
    question: 'What topics will be covered?',
    answer: 'Sessions cover all aspects of inbound marketing: HubSpot platform mastery, marketing automation, sales enablement, customer success, content marketing, lead generation, analytics, and emerging trends in the HubSpot ecosystem.',
    category: 'event'
  },
  {
    id: 'session-format',
    question: 'What format are the sessions?',
    answer: 'We offer various formats including keynote presentations, hands-on workshops, panel discussions, Q&A sessions, and networking breaks. All sessions are interactive with opportunities for audience participation.',
    category: 'event'
  },
  {
    id: 'networking',
    question: 'How does networking work in a virtual event?',
    answer: 'We provide multiple networking opportunities including virtual breakout rooms, community chat channels, one-on-one meeting scheduling, and dedicated networking sessions between presentations.',
    category: 'event'
  },
  {
    id: 'recordings',
    question: 'Will sessions be recorded?',
    answer: 'Yes! All sessions will be recorded and made available to registered attendees for 30 days after the event. This allows you to catch up on missed sessions or revisit valuable content.',
    category: 'event'
  },

  // Technical Questions
  {
    id: 'platform',
    question: 'What platform will be used for the event?',
    answer: 'Remote Inbound uses a custom-built platform optimized for virtual events. You can access it through any modern web browser on desktop, tablet, or mobile. No special software installation required.',
    category: 'technical'
  },
  {
    id: 'technical-requirements',
    question: 'What are the technical requirements?',
    answer: 'You need a stable internet connection, a modern web browser (Chrome, Firefox, Safari, or Edge), and optionally a webcam and microphone for interactive sessions. The platform works on all devices.',
    category: 'technical'
  },
  {
    id: 'timezone',
    question: 'What timezone will sessions be in?',
    answer: 'Sessions will be scheduled across multiple timezones to accommodate our global community. We\'ll provide a detailed schedule with times in major timezones, and all sessions will be recorded for later viewing.',
    category: 'technical'
  },
  {
    id: 'mobile-access',
    question: 'Can I attend on mobile?',
    answer: 'Absolutely! Our platform is fully responsive and works great on mobile devices. You can attend sessions, participate in chat, and network from your smartphone or tablet.',
    category: 'technical'
  },

  // Community Questions
  {
    id: 'community-guidelines',
    question: 'What are the community guidelines?',
    answer: 'We maintain a respectful, inclusive environment focused on learning and sharing. Be professional, supportive of fellow attendees, stay on topic during sessions, and follow our code of conduct for all interactions.',
    category: 'community'
  },
  {
    id: 'after-event',
    question: 'How can I stay connected after the event?',
    answer: 'Join our ongoing community channels, follow speakers and attendees on social media, and watch for announcements about future Remote Inbound events. We\'re building a year-round community of HubSpot enthusiasts.',
    category: 'community'
  },
  {
    id: 'contribute',
    question: 'How can I contribute to Remote Inbound?',
    answer: 'There are many ways to contribute: apply to speak, become a partner or sponsor, help spread the word on social media, provide feedback, or volunteer to help with event organization. Every contribution helps our community grow.',
    category: 'community'
  },
  {
    id: 'contact',
    question: 'How can I contact the organizers?',
    answer: 'For questions not covered in this FAQ, reach out through our contact form, email us directly, or connect with us on social media. We\'re here to help make your Remote Inbound experience amazing.',
    category: 'community'
  }
];

const categories = [
  { id: 'all', name: 'All Questions', icon: HelpCircle },
  { id: 'general', name: 'General', icon: Globe },
  { id: 'registration', name: 'Registration', icon: Users },
  { id: 'event', name: 'Event Details', icon: Calendar },
  { id: 'technical', name: 'Technical', icon: Zap },
  { id: 'community', name: 'Community', icon: Heart }
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/events" className="text-gray-600 hover:text-orange-600 font-medium">
                Events
              </Link>
              <Link href="/speakers" className="text-gray-600 hover:text-orange-600 font-medium">
                Speakers
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-orange-600 font-medium">
                About
              </Link>
              <Link href="/faq" className="text-orange-600 font-medium">
                FAQ
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-orange-600 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Register Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <HelpCircle className="w-16 h-16 text-orange-200" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Everything you need to know about Remote Inbound 2025, the fan-driven HubSpot community event.
            Can't find what you're looking for? We're here to help!
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {filteredFAQs.map((faq) => {
                const isOpen = openItems.has(faq.id);
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    
                    {isOpen && (
                      <div className="px-6 pb-6">
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-8 text-white">
              <Mail className="w-12 h-12 text-orange-200 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our community team is here to help.
                Reach out and we'll get back to you as soon as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-white text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/register"
                  className="bg-orange-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-900 transition-colors"
                >
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-orange-500 mb-4">Remote Inbound</div>
              <p className="text-gray-400 mb-4">
                The first fan-driven HubSpot community event. Created by super users, for the community.
              </p>
              <div className="flex space-x-4">
                <Calendar className="w-5 h-5 text-orange-500" />
                <span className="text-gray-400">September 3-5, 2025</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Event</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/events" className="hover:text-white">Sessions</Link></li>
                <li><Link href="/speakers" className="hover:text-white">Speakers</Link></li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register" className="hover:text-white">Register</Link></li>
                <li><Link href="/register" className="hover:text-white">Join as Fan</Link></li>
                <li><Link href="/register/partner" className="hover:text-white">Partner With Us</Link></li>
                <li><Link href="/register/sponsor" className="hover:text-white">Sponsor</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white">YouTube</a></li>
                <li><a href="#" className="hover:text-white">Newsletter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Remote Inbound. Organized by HubSpot Super Users. Not affiliated with HubSpot, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}