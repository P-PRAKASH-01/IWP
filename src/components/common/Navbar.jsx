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
      isScrolled ? 'glass-panel shadow-2xl py-3 border-b border-indigo-500/10' : 'bg-slate-950/80 backdrop-blur-md py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300 text-lg">
                  SSG
                </span>
              </div>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors block leading-none">
                SRI SAI <span className="text-indigo-400 font-extrabold">GARMENTS</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium block mt-1">
                Tiruppur • Direct Virtual Shop
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <Link 
              to="/" 
              className={`transition-colors py-1 relative ${
                isActive('/') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Home
              {isActive('/') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
              )}
            </Link>

            <Link 
              to="/products" 
              className={`transition-colors py-1 relative ${
                isActive('/products') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Catalogue / All Garments
              {isActive('/products') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
              )}
            </Link>

            <Link 
              to="/about" 
              className={`transition-colors py-1 relative ${
                isActive('/about') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              About Us
              {isActive('/about') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
              )}
            </Link>

            <Link 
              to="/contact" 
              className={`transition-colors py-1 relative ${
                isActive('/contact') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Contact & Enquiries
              {isActive('/contact') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
              )}
            </Link>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Trigger */}
            <button
              onClick={onSearchOpen}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700"
              title="Search products..."
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-slate-800/80 transition-all relative border border-transparent hover:border-slate-700"
              title="View Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* WhatsApp Direct CTA */}
            <a
              href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent('Hello Sri Sai Garments! I would like to inquire about your garments catalogue.')}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-emerald-400/30" />
              <span>Direct Order</span>
            </a>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-800 pt-4 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
            <Link
              to="/"
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive('/') ? 'bg-indigo-600/20 text-indigo-400 font-semibold' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive('/products') ? 'bg-indigo-600/20 text-indigo-400 font-semibold' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              Catalogue / All Garments
            </Link>

            <Link
              to="/about"
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive('/about') ? 'bg-indigo-600/20 text-indigo-400 font-semibold' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive('/contact') ? 'bg-indigo-600/20 text-indigo-400 font-semibold' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              Contact & Enquiries
            </Link>

            <div className="pt-2 px-4">
              <a
                href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent('Hello Sri Sai Garments! I would like to inquire about your garments catalogue.')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-3 rounded-xl shadow-lg"
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
