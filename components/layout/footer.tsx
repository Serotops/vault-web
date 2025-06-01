'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Gavel, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Marketplace',
      links: [
        { href: '/auctions', label: 'Browse Auctions' },
        { href: '/categories', label: 'Categories' },
        { href: '/sell', label: 'Start Selling' },
        { href: '/how-it-works', label: 'How It Works' },
        { href: '/fees', label: 'Selling Fees' },
      ]
    },
    {
      title: 'Support',
      links: [
        { href: '/help', label: 'Help Center' },
        { href: '/contact', label: 'Contact Us' },
        { href: '/shipping', label: 'Shipping Info' },
        { href: '/returns', label: 'Returns Policy' },
        { href: '/safety', label: 'Safety Tips' },
      ]
    },
    {
      title: 'Community',
      links: [
        { href: '/blog', label: 'Blog' },
        { href: '/events', label: 'Events' },
        { href: '/collecting-guides', label: 'Collecting Guides' },
        { href: '/forums', label: 'Forums' },
        { href: '/grading', label: 'Grading Services' },
      ]
    },
    {
      title: 'Company',
      links: [
        { href: '/about', label: 'About Us' },
        { href: '/careers', label: 'Careers' },
        { href: '/press', label: 'Press' },
        { href: '/investors', label: 'Investors' },
        { href: '/sustainability', label: 'Sustainability' },
      ]
    }
  ]

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription:', email)
  }

  return (
    <footer className={cn("bg-gray-900 text-gray-300", className)}>
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated on the Latest Collectibles
            </h3>
            <p className="text-gray-400 mb-6">
              Get notified about new auctions, price trends, and collecting tips straight to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-4 max-w-md mx-auto">
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button type="submit" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Gavel className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">Vault</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              The premier marketplace for pop culture collectibles. Buy, sell, and discover rare items from comics to action figures.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@vault.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>1-800-VAULT-01</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © {currentYear} Vault. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
