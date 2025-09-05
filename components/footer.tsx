import Link from "next/link"
import { MessageCircle, Phone, Mail, Globe, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-background to-primary/5 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-foreground">MindCare</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md leading-relaxed">
              Your trusted digital mental health support platform. We're here to help you on your journey to better
              mental wellness with compassion and care.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-primary/10 px-3 py-2 rounded-lg">
                <Phone className="w-4 h-4 text-primary" />
                <span className="font-medium">Crisis Helpline: 988</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/chat"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <MessageCircle className="w-4 h-4 group-hover:text-primary" />
                  <span>AI Support Chat</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span>Book Counselor</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-muted-foreground hover:text-accent transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span>Mental Health Resources</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/forum"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span>Peer Support Forum</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-primary">Support</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@mindcare.edu</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4 text-accent" />
                <span>Language Support</span>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2 flex items-center justify-center space-x-2">
              <span>Built with care</span>
             <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for your well-being</span>
            </p>
            <p className="text-xs text-muted-foreground">
              © 2024 MindCare. All rights reserved. • If you're in crisis, please call 988 or visit your nearest
              emergency room.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
