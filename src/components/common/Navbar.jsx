import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Heart, MessageSquare } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { WHATSAPP_PHONE_NUMBER } from '../../utils/whatsapp';

export default function Navbar({ onSearchOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { wishlist, setIsWishlistOpen } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-sand-300' : 'bg-ivory/90 backdrop-blur-md py-4 border-b border-sand-200/60'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-charcoal p-0.5 shadow-md shadow-charcoal/10 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
              <div className="w-full h-full bg-olive rounded-[10px] flex items-center justify-center">
                <span className="font-black text-ivory text-base tracking-wider">
                  SSG
                </span>
              </div>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-charcoal group-hover:text-olive transition-colors block leading-none">
                SRI SAI <span className="text-olive font-extrabold">GARMENTS</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-charcoal-500 font-medium block mt-1">
                Tiruppur • Direct Virtual Shop
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <Link 
              to="/" 
              className={`transition-colors py-1 relative ${
                isActive('/') ? 'text-olive font-bold' : 'text-charcoal-700 hover:text-olive'
              }`}
            >
              Home
              {isActive('/') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-olive rounded-full" />
              )}
            </Link>

            <Link 
              to="/products" 
              className={`transition-colors py-1 relative ${
                isActive('/products') ? 'text-olive font-bold' : 'text-charcoal-700 hover:text-olive'
              }`}
            >
              Catalogue / All Garments
              {isActive('/products') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-olive rounded-full" />
              )}
            </Link>

            <Link 
              to="/about" 
              className={`transition-colors py-1 relative ${
                isActive('/about') ? 'text-olive font-bold' : 'text-charcoal-700 hover:text-olive'
              }`}
            >
              About Us
              {isActive('/about') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-olive rounded-full" />
              )}
            </Link>

            <Link 
              to="/contact" 
              className={`transition-colors py-1 relative ${
                isActive('/contact') ? 'text-olive font-bold' : 'text-charcoal-700 hover:text-olive'
              }`}
            >
              Contact & Enquiries
              {isActive('/contact') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-olive rounded-full" />
              )}
            </Link>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Trigger */}
            <button
              onClick={onSearchOpen}
              className="p-2.5 rounded-xl text-charcoal-700 hover:text-olive hover:bg-sand-100 transition-all border border-sand-200"
              title="Search products..."
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2.5 rounded-xl text-charcoal-700 hover:text-olive hover:bg-sand-100 transition-all relative border border-sand-200"
              title="View Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-olive fill-olive' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-olive text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* WhatsApp Direct CTA */}
            <a
              href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent('Hello Sri Sai Garments! I would like to inquire about your garments catalogue.')}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-olive hover:bg-olive-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-olive/20 transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct Order</span>
            </a>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-charcoal-700 hover:text-olive hover:bg-sand-100 border border-sand-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-sand-200 pt-4 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200 bg-white/95 rounded-2xl p-4 shadow-lg border">
            <Link
              to="/"
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive('/') ? 'bg-sand-100 text-olive font-bold' : 'text-charcoal-800 hover:bg-sand-50'
              }`}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive('/products') ? 'bg-sand-100 text-olive font-bold' : 'text-charcoal-800 hover:bg-sand-50'
              }`}
            >
              Catalogue / All Garments
            </Link>

            <Link
              to="/about"
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive('/about') ? 'bg-sand-100 text-olive font-bold' : 'text-charcoal-800 hover:bg-sand-50'
              }`}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive('/contact') ? 'bg-sand-100 text-olive font-bold' : 'text-charcoal-800 hover:bg-sand-50'
              }`}
            >
              Contact & Enquiries
            </Link>

            <div className="pt-2 px-1">
              <a
                href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent('Hello Sri Sai Garments! I would like to inquire about your garments catalogue.')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-olive hover:bg-olive-600 text-white font-semibold text-xs py-3 rounded-xl shadow-md shadow-olive/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enquire via WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
