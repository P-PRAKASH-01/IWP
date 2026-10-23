import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageSquare, ShieldCheck, Truck, Factory, Sparkles } from 'lucide-react';
import { CONTACT_PHONE_DISPLAY, COMPANY_EMAIL, COMPANY_ADDRESS } from '../../utils/whatsapp';
import { useStore } from '../../context/StoreContext';
import defaultLogo from '../../assets/Logos/Logo.jpeg';

export default function Footer() {
  const { settings, settingsConfigured } = useStore();
  const phone = settingsConfigured ? settings.phone : settings.phone || CONTACT_PHONE_DISPLAY;
  const email = settingsConfigured ? settings.email : settings.email || COMPANY_EMAIL;
  const address = settingsConfigured ? settings.address : settings.address || COMPANY_ADDRESS;
  return (
    <footer className="bg-charcoal border-t border-charcoal-700 pt-16 pb-8 text-sand-300 text-sm mt-auto relative overflow-hidden">
      {/* Background Accent Subtle Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-olive/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sand/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Value Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 mb-12 border-b border-charcoal-700">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-charcoal-700/40 border border-charcoal-600/40">
            <div className="p-2.5 rounded-xl bg-olive/20 text-olive">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-ivory font-semibold text-sm">Direct Manufacturer</h4>
              <p className="text-xs text-sand-300 mt-0.5">Tiruppur textile hub direct pricing with zero middleman markup.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-charcoal-700/40 border border-charcoal-600/40">
            <div className="p-2.5 rounded-xl bg-olive/20 text-olive">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-ivory font-semibold text-sm">Combed Cotton Quality</h4>
              <p className="text-xs text-sand-300 mt-0.5">100% bio-washed knit fabrics crafted for softness and longevity.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-charcoal-700/40 border border-charcoal-600/40">
            <div className="p-2.5 rounded-xl bg-olive/20 text-olive">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-ivory font-semibold text-sm">Instant Enquiries</h4>
              <p className="text-xs text-sand-300 mt-0.5">Direct response via WhatsApp for retail & bulk customized orders.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-charcoal-700/40 border border-charcoal-600/40">
            <div className="p-2.5 rounded-xl bg-olive/20 text-olive">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-ivory font-semibold text-sm">Pan-India Delivery</h4>
              <p className="text-xs text-sand-300 mt-0.5">Fast logistics dispatch for both sample pieces and wholesale volume.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-olive p-0.5 flex items-center justify-center">
                <img src={settings.logo || defaultLogo} alt="" className="w-full h-full rounded-lg object-contain" />
              </div>
              <span className="text-lg font-bold text-ivory tracking-tight">
                {settings.businessName}
              </span>
            </div>

            <p className="text-xs text-sand-300 leading-relaxed max-w-sm">
              {settings.about || 'Sri Sai Garments'}
            </p>

            <div className="pt-2">
              <a
                href={settings.whatsapp ? `https://wa.me/${String(settings.whatsapp).replace(/\D/g, '')}` : '/contact'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-olive/20 hover:bg-olive/30 text-sand-100 border border-olive/40 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              >
                <MessageSquare className="w-4 h-4 text-olive" />
                <span>Chat with Shop Manager</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-ivory font-semibold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-olive" /> Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-olive transition-colors">Home Page</Link></li>
              <li><Link to="/products" className="hover:text-olive transition-colors">Complete Catalogue</Link></li>
              <li><Link to="/products?category=men" className="hover:text-olive transition-colors">Men's Collection</Link></li>
              <li><Link to="/products?category=women" className="hover:text-olive transition-colors">Women's Fashion</Link></li>
              <li><Link to="/products?category=bulk" className="hover:text-olive transition-colors">Bulk & Corporate Orders</Link></li>
            </ul>
          </div>

          {/* Business Info */}
          <div>
            <h4 className="text-ivory font-semibold text-xs uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/about" className="hover:text-olive transition-colors">About Sri Sai Garments</Link></li>
              <li><Link to="/contact" className="hover:text-olive transition-colors">Contact Us</Link></li>
              <li><Link to="/contact#location" className="hover:text-olive transition-colors">Store Location</Link></li>
              <li><span className="text-sand-400 cursor-not-allowed">Wholesale Catalog (PDF)</span></li>
              <li><span className="text-sand-400 cursor-not-allowed">Quality Policy</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-ivory font-semibold text-xs uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-xs">
              {address && <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-olive shrink-0 mt-0.5" />
                {address && <span className="text-sand-200">{address}</span>}
              </li>}
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-olive shrink-0" />
                {phone && <a href={`tel:${phone}`} className="text-sand-200 hover:text-olive transition-colors">{phone}</a>}
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-olive shrink-0" />
                {email && <a href={`mailto:${email}`} className="text-sand-200 hover:text-olive transition-colors">{email}</a>}
              </li>
            </ul>
            {Object.entries(settings.socialLinks || {}).filter(([, url]) => url).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {Object.entries(settings.socialLinks).filter(([, url]) => url).map(([network, url]) => (
                  <a key={network} href={url} target="_blank" rel="noreferrer" className="text-xs capitalize text-sand-200 hover:text-olive">{network}</a>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-charcoal-700 flex flex-col sm:flex-row items-center justify-between text-xs text-sand-400 gap-4">
          <p>© {new Date().getFullYear()} {settings.businessName}. {settings.footer || 'All rights reserved.'}</p>
          <div className="flex items-center gap-6">
            <span>Product Showcase & Enquiry Platform</span>
            <span>•</span>
            <span className="text-sand-300">Phase 1 Virtual Shop</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
