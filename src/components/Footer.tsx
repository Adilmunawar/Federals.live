import React from 'react';
import { Mail, Twitter, Facebook, Linkedin, Rss } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    About: [
      { name: 'About Us', href: '#' },
      { name: 'Editorial Team', href: '#' },
      { name: 'Mission Statement', href: '#' },
      { name: 'Contact Us', href: '#' }
    ],
    Categories: [
      { name: 'Politics', href: '/category/politics' },
      { name: 'World News', href: '/category/world' },
      { name: 'Economy', href: '/category/economy' },
      { name: 'Opinion', href: '/category/opinion' }
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Disclaimer', href: '#' }
    ],
    Resources: [
      { name: 'Newsletter', href: '#' },
      { name: 'RSS Feed', href: '#' },
      { name: 'Press Kit', href: '#' },
      { name: 'Archives', href: '#' }
    ]
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img 
                src="/Federals logo.png" 
                alt="Federals.live Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback to original design if logo fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center hidden">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Federals<span className="text-red-600">.live</span>
              </h3>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your authoritative source for breaking news, political analysis, world affairs, 
              and global intelligence. Delivering fact-based journalism and insightful commentary 
              on the issues that matter most.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Rss className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white font-semibold mb-2">Stay Updated</h4>
              <p className="text-gray-400 text-sm">
                Subscribe to our newsletter for the latest news and analysis.
              </p>
            </div>
            <div className="flex space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-600 flex-1 md:w-64"
              />
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>© {currentYear} Federals.live. All rights reserved.</p>
              <p className="mt-1">
                Independent journalism committed to truth and transparency.
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                Advertise
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                Careers
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;