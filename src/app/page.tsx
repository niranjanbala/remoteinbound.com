'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import {
  Play,
  ArrowRight,
  Calendar,
  Globe,
  Users,
  Star,
  CheckCircle,
  Zap,
  Heart,
  Award,
  Wifi,
  Coffee,
  BookOpen
} from 'lucide-react';

export default function Home() {
  const [isInstallable, setIsInstallable] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Logo size="md" />
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/events" className="text-gray-700 hover:text-orange-500 font-medium">
                Sessions
              </Link>
              <Link href="/speakers" className="text-gray-700 hover:text-orange-500 font-medium">
                Speakers
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {isInstallable && (
                <button
                  onClick={handleInstall}
                  className="hidden sm:flex items-center space-x-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Install App</span>
                </button>
              )}
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
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* Event Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-sm font-medium mb-8">
                <Calendar className="w-4 h-4 mr-2" />
                September 3-5, 2025 • First Edition • 100% Remote • Free
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Build your future
                <br />
                at <span className="text-orange-500">Remote Inbound</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                The first edition of a remote event created by HubSpot fans, for HubSpot fans. Join passionate users from around the world for community-driven learning and growth.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/register"
                  className="bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>Register Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="flex items-center justify-center space-x-2 px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-full text-lg font-semibold hover:border-orange-500 hover:text-orange-500 transition-colors">
                  <Play className="w-5 h-5" />
                  <span>Watch Preview</span>
                </button>
              </div>

              {/* Organizer Info */}
              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>First Edition by HubSpot Fans</span>
                </div>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Fan-Driven Community</span>
                </div>
              </div>
            </div>

            {/* Right Content - Video/Image Placeholder */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-slate-800 rounded-2xl border border-orange-500/20 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <button className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform mb-4">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </button>
                  <p className="text-gray-300 text-sm">Watch: What is Remote Inbound?</p>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-orange-500">5,000+</div>
                <div className="text-gray-600 text-sm">Expected Attendees</div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-orange-500">50+</div>
                <div className="text-gray-600 text-sm">Expert Speakers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Remote Inbound Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What is Remote Inbound?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The first edition of a fan-created remote event where passionate HubSpot users share insights, strategies, and innovations that drive real business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Learn from HubSpot Fans</h3>
                    <p className="text-gray-600">Get practical insights from passionate HubSpot users who have achieved exceptional results and want to share their knowledge.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Fan Community</h3>
                    <p className="text-gray-600">Connect with HubSpot enthusiasts and professionals worldwide in this first-ever fan-organized remote event.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Actionable HubSpot Strategies</h3>
                    <p className="text-gray-600">Discover advanced techniques, workflows, and integrations you can implement immediately.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-orange-500 mb-2">90,000+</div>
                  <div className="text-gray-600 font-medium">Combined HubSpot Experience Hours</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">2</div>
                    <div className="text-gray-600 text-sm">Days</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">30+</div>
                    <div className="text-gray-600 text-sm">Sessions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-gray-600 text-sm">Remote</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">FREE</div>
                    <div className="text-gray-600 text-sm">Always</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Remote Experience Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Remote Experience
            </h2>
            <p className="text-xl text-gray-600">
              Designed for the modern remote professional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Interactive Sessions */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wifi className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Interactive Sessions</h3>
                <p className="text-gray-600">Live Q&A, polls, and breakout rooms</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Real-time audience interaction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Small group discussions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Direct speaker access</span>
                </div>
              </div>
            </div>

            {/* Networking */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Virtual Networking</h3>
                <p className="text-gray-600">Connect with peers worldwide</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Speed networking sessions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Industry-specific meetups</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Slack community access</span>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-orange-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Resource Library</h3>
                <p className="text-gray-600">Take-home materials and templates</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Session recordings</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">HubSpot templates & workflows</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Implementation guides</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Attend */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Why attend Remote Inbound?
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-orange-400 mb-3">Grow</h3>
                  <p className="text-purple-100 text-lg">
                    Discover advanced HubSpot strategies and tactics from practitioners who've achieved exceptional results.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-orange-400 mb-3">Connect</h3>
                  <p className="text-purple-100 text-lg">
                    Build meaningful relationships with fellow HubSpot fans and expand your professional network in this inaugural community event.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-orange-400 mb-3">Learn</h3>
                  <p className="text-purple-100 text-lg">
                    Access cutting-edge insights, real-world case studies, and actionable takeaways you can implement immediately.
                  </p>
                </div>
              </div>
              
              <Link
                href="/register"
                className="inline-flex items-center space-x-2 bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors mt-8"
              >
                <span>Join the Community</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-orange-400 mb-2">100%</div>
                  <div className="text-purple-100">Free & Remote</div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <Award className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="text-lg font-semibold">Fan-Led</div>
                    <div className="text-purple-200 text-sm">First Edition by HubSpot Fans</div>
                  </div>
                  <div>
                    <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="text-lg font-semibold">Community</div>
                    <div className="text-purple-200 text-sm">Driven & Collaborative</div>
                  </div>
                  <div>
                    <Globe className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="text-lg font-semibold">Global</div>
                    <div className="text-purple-200 text-sm">Accessible Worldwide</div>
                  </div>
                  <div>
                    <Heart className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="text-lg font-semibold">Passion</div>
                    <div className="text-purple-200 text-sm">For Growth & Learning</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Level Up Your HubSpot Game?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of HubSpot fans at the first-ever Remote Inbound 2025. It's free, it's remote, and it's created by fans, for fans.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-orange-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <span>Register Free Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/events"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors"
            >
              View Schedule
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500 mb-4">Remote Inbound</div>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              The first edition remote event created by HubSpot fans for the global HubSpot community.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              September 3-5, 2025 • First Edition<br />
              100% Remote • 100% Free • 100% Fan-Driven
            </p>
            
            <div className="border-t border-gray-800 pt-8 space-y-4">
              <div className="flex items-center justify-center space-x-2 text-gray-400">
                <span>Built in Public & Open Source</span>
                <span>•</span>
                <span>Made with</span>
                <span className="text-red-500">❤️</span>
                <span>from India for the World</span>
              </div>
              <p className="text-gray-500 text-sm">
                &copy; 2025 Remote Inbound. Organized by HubSpot Super Users. Not affiliated with HubSpot, Inc.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
