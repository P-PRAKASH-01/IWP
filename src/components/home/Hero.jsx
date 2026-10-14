import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function Hero() {
  const { settings } = useStore();
  return (
    <div className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-ivory">
      
      {/* Background Subtle Warm Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sand-200/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-olive-100/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sand-300 text-charcoal-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-olive" />
              <span>Official Virtual Shop • Sri Sai Garments, Tiruppur</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-charcoal leading-[1.15]">
              Pure Cotton Garments <br className="hidden sm:inline" />
              <span className="text-olive">
                Crafted for Superior Comfort
              </span>
            </h1>

            {/* Description */}
            <p className="text-charcoal-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Explore Sri Sai Garments' digital catalogue — from bio-washed crewneck t-shirts and pique polos to custom corporate bulk manufacturing directly from Tiruppur, India's textile capital.
            </p>

            {/* Key Value Points */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs font-medium text-charcoal-700 pt-2">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-sand-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-olive" /> 100% Combed Cotton
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-sand-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-olive" /> Bio-Washed & Pre-Shrunk
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-sand-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-olive" /> Direct Factory Pricing
              </span>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-olive hover:bg-olive-600 text-white font-bold text-sm px-7 py-4 rounded-2xl shadow-lg shadow-olive/20 hover:shadow-olive/35 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Explore Garment Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={settings.whatsapp ? `https://wa.me/${String(settings.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${settings.businessName}! I would like to inquire about bulk ordering and custom garment manufacturing.`)}` : '/contact'}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-sand-50 text-charcoal border border-sand-300 font-semibold text-sm px-6 py-4 rounded-2xl shadow-xs transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4 text-olive" />
                <span>Bulk & Custom Enquiry</span>
              </a>
            </div>

            {/* Stats Row */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-sand-300 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-xl sm:text-2xl font-black text-charcoal">50K+</div>
                <div className="text-[11px] text-charcoal-500 uppercase tracking-wide">Garments Supplied</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-olive">100%</div>
                <div className="text-[11px] text-charcoal-500 uppercase tracking-wide">Quality Assured</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-charcoal">Direct</div>
                <div className="text-[11px] text-charcoal-500 uppercase tracking-wide">Factory Rates</div>
              </div>
            </div>

          </div>

          {/* Right Visual Feature Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Stacked Image Frame */}
              <div className="relative rounded-3xl overflow-hidden border border-sand-300 p-3 bg-white shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
                  alt="Sri Sai Garments Featured Cotton Tee"
                  className="w-full aspect-[4/5] object-cover rounded-2xl"
                />
                
                {/* Floating Glass Overlay Card 1 */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-sand-200 shadow-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs text-olive font-semibold">Tiruppur Special</div>
                    <div className="text-charcoal text-sm font-bold">Bio-Washed 180 GSM Tee</div>
                    <div className="text-xs text-charcoal-500 mt-0.5">Starting at ₹499</div>
                  </div>
                  <Link
                    to="/products/SG001"
                    className="p-2.5 rounded-xl bg-olive hover:bg-olive-600 text-white shadow-md shadow-olive/20"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Floating Badge Top Right */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-full px-3.5 py-1.5 border border-sand-300 flex items-center gap-2 text-olive text-xs font-semibold shadow-md">
                  <ShieldCheck className="w-4 h-4 text-olive" />
                  <span>100% Pure Cotton</span>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
