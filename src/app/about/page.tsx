'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { 
  Heart,
  Users,
  Globe,
  Calendar,
  Award,
  Zap,
  Target,
  BookOpen,
  Coffee,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Star,
  Rocket,
  Building,
  Mail
} from 'lucide-react';

const teamMembers = [
  {
    name: 'HubSpot Super Users',
    role: 'Community Organizers',
    description: 'Passionate HubSpot experts from around the world who volunteer their time to make this event possible.',
    icon: Users
  },
  {
    name: 'Industry Speakers',
    role: 'Content Contributors',
    description: 'Marketing professionals, sales experts, and customer success leaders sharing their knowledge.',
    icon: Award
  },
  {
    name: 'Community Partners',
    role: 'Event Supporters',
    description: 'Agencies, consultants, and companies supporting the HubSpot community ecosystem.',
    icon: Building
  }
];

const values = [
  {
    icon: Heart,
    title: 'Community First',
    description: 'Everything we do is driven by our passion for the HubSpot community and helping each other succeed.'
  },
  {
    icon: Globe,
    title: 'Accessible to All',
    description: 'Free, virtual, and designed to be inclusive for HubSpot users regardless of location or budget.'
  },
  {
    icon: BookOpen,
    title: 'Practical Learning',
    description: 'Real-world insights, actionable strategies, and hands-on knowledge you can implement immediately.'
  },
  {
    icon: Users,
    title: 'Networking Focus',
    description: 'Connecting HubSpot professionals to build lasting relationships and collaborative opportunities.'
  }
];

const stats = [
  { number: '2025', label: 'First Edition', icon: Rocket },
  { number: '3 Days', label: 'Sept 3-5', icon: Calendar },
  { number: '100%', label: 'Free Event', icon: Heart },
  { number: 'Global', label: 'Virtual Access', icon: Globe }
];

export default function AboutPage() {
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
              <Link href="/about" className="text-orange-600 font-medium">
                About
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-orange-600 font-medium">
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
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Heart className="w-16 h-16 text-orange-200" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Remote Inbound
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-4xl mx-auto">
              The first-ever fan-driven HubSpot community event, created by super users for the global HubSpot community.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <Icon className="w-12 h-12 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>
                  Remote Inbound was born from a simple idea: what if the HubSpot community could create 
                  its own version of INBOUND, made by fans for fans?
                </p>
                <p>
                  As passionate HubSpot users, we've attended INBOUND conferences, participated in user 
                  groups, and built our careers around inbound marketing principles. We wanted to create 
                  something that would bring this amazing community together in a new way.
                </p>
                <p>
                  Remote Inbound 2025 is our love letter to the HubSpot community - a completely free, 
                  virtual event that celebrates the knowledge, creativity, and passion of HubSpot super users worldwide.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Community Driven</h3>
                    <p className="text-gray-600">Organized by HubSpot super users who understand the community's needs.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Completely Free</h3>
                    <p className="text-gray-600">No tickets, no fees - just valuable content and networking opportunities.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Global Access</h3>
                    <p className="text-gray-600">Virtual format means anyone, anywhere can participate and learn.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Target className="w-16 h-16 text-orange-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              To democratize access to world-class inbound marketing education and create meaningful 
              connections within the global HubSpot community.
            </p>
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">We believe that</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <Star className="w-6 h-6 text-orange-200 mt-1 flex-shrink-0" />
                  <p>Knowledge should be accessible to everyone, regardless of budget or location</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-6 h-6 text-orange-200 mt-1 flex-shrink-0" />
                  <p>The HubSpot community is filled with incredible expertise worth sharing</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-6 h-6 text-orange-200 mt-1 flex-shrink-0" />
                  <p>Virtual events can create real, meaningful professional connections</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-6 h-6 text-orange-200 mt-1 flex-shrink-0" />
                  <p>Community-driven initiatives can complement official company events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at Remote Inbound
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 rounded-lg p-3">
                      <Icon className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Who Makes It Happen
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Remote Inbound is powered by passionate volunteers from the HubSpot community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => {
              const Icon = member.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-orange-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Independence Notice */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-200">
            <Lightbulb className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Independent Community Initiative
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Remote Inbound is an independent, fan-driven initiative created by HubSpot community members. 
              While we're inspired by HubSpot's INBOUND conference and deeply appreciate the HubSpot platform, 
              this event is not officially affiliated with or endorsed by HubSpot, Inc. We're simply passionate 
              users who want to give back to the community that has given us so much.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the Remote Inbound Community
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Be part of the first-ever fan-driven HubSpot community event. Register for free and help us 
            make Remote Inbound 2025 an unforgettable experience for the entire community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-50 transition-colors inline-flex items-center justify-center"
            >
              Register Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/register/speaker"
              className="bg-orange-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-900 transition-colors inline-flex items-center justify-center"
            >
              Become a Speaker
              <Rocket className="w-5 h-5 ml-2" />
            </Link>
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
                <li><Link href="/register/speaker" className="hover:text-white">Become a Speaker</Link></li>
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