import Link from "next/link"
import { MessageCircle, Phone, Mail, Globe, Heart, Shield, Clock, Award, Users, Calendar, BookOpen, ArrowRight, ChevronUp, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Enhanced Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-2xl blur-lg"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-3xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  MindCare
                </h2>
                <p className="text-purple-200 text-sm font-medium">Your Mental Wellness Partner</p>
              </div>
            </div>
            
            <p className="text-slate-300 mb-6 max-w-md leading-relaxed text-lg">
              Empowering your mental health journey with AI-powered support, professional counseling, and a caring community. 
              <span className="text-purple-200 font-medium">Available 24/7 for you.</span>
            </p>

            {/* Crisis Support - Enhanced */}
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-2xl p-4 mb-6 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-red-200 text-sm font-semibold">Emergency Crisis Support</p>
                  <p className="text-white font-bold text-lg">Call 988 • Available 24/7</p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <p className="text-xs text-slate-300 font-medium">HIPAA Compliant</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <Clock className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-slate-300 font-medium">24/7 Support</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <Award className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <p className="text-xs text-slate-300 font-medium">Licensed Staff</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-xl text-white mb-6 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full mr-3"></span>
              Services
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/chat"
                  className="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/10"
                >
                  <MessageCircle className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                  <span className="font-medium">AI Support Chat</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/10"
                >
                  <Calendar className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                  <span className="font-medium">Book Counselor</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/10"
                >
                  <BookOpen className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
                  <span className="font-medium">Resources Hub</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link
                  href="/forum"
                  className="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/10"
                >
                  <Users className="w-5 h-5 text-orange-400 group-hover:text-orange-300" />
                  <span className="font-medium">Peer Forum</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="font-bold text-xl text-white mb-6 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-400 to-cyan-500 rounded-full mr-3"></span>
              Support
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-slate-300 p-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Email Support</p>
                  <p className="font-medium">support@mindcare.edu</p>
                </div>
              </li>
              <li className="flex items-center space-x-3 text-slate-300 p-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Multilingual</p>
                  <p className="font-medium">3 Languages Available</p>
                </div>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-6">
              <p className="text-slate-300 font-medium mb-3">Connect With Us</p>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-sky-500 to-sky-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Legal & Resources */}
          <div>
            <h3 className="font-bold text-xl text-white mb-6 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full mr-3"></span>
              Legal & Info
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-300 hover:text-white transition-colors duration-300 font-medium hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-slate-300 hover:text-white transition-colors duration-300 font-medium hover:underline"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/accessibility" 
                  className="text-slate-300 hover:text-white transition-colors duration-300 font-medium hover:underline"
                >
                  Accessibility
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-slate-300 hover:text-white transition-colors duration-300 font-medium hover:underline"
                >
                  About Us
                </Link>
              </li>
            </ul>

            {/* Stats */}
            <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-slate-300 text-sm font-medium mb-2">Community Impact</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Lives Supported</span>
                  <span className="text-sm font-bold text-white">500+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Sessions Completed</span>
                  <span className="text-sm font-bold text-white">2,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Satisfaction Rate</span>
                  <span className="text-sm font-bold text-emerald-400">98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="text-lg font-medium text-white mb-2 flex items-center justify-center lg:justify-start space-x-2">
                <span>Built with</span>
                <Heart className="w-5 h-5 text-red-400 fill-current animate-pulse" />
                <span>for your well-being</span>
              </p>
              <p className="text-sm text-slate-400">
                © 2025 MindCare Platform. All rights reserved. • 
                <span className="text-red-300 font-medium"> Emergency: Call 988 or visit your nearest ER</span>
              </p>
            </div>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Back to Top</span>
              <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Additional Legal Notice */}
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-xl backdrop-blur-sm">
            <p className="text-xs text-yellow-200 text-center leading-relaxed">
              <strong>Important:</strong> MindCare is not a substitute for professional medical advice, diagnosis, or treatment. 
              If you're experiencing a mental health crisis, please contact emergency services immediately or call the National Suicide Prevention Lifeline at 988.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
