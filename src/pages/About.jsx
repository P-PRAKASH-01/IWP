import React from 'react';
import { Link } from 'react-router-dom';
import { Factory, ShieldCheck, Award, Users, MapPin, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';
import { WHATSAPP_PHONE_NUMBER, COMPANY_ADDRESS } from '../utils/whatsapp';

export default function About() {
  return (
    <div className="min-h-screen bg-ivory pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sand-300 text-olive text-xs font-semibold shadow-2xs">
            <Factory className="w-3.5 h-3.5" /> Tiruppur Garment Specialists
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal tracking-tight leading-tight">
            Crafting Quality Apparel in India's Textile Capital
          </h1>

          <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
            Sri Sai Garments is dedicated to producing high-grade cotton garments, casual wear, and custom bulk uniforms. We bridge retail buyers and wholesale clients with direct factory manufacturing in Tiruppur.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          <div className="lg:col-span-6 relative">
            <div className="bg-white rounded-3xl p-3 border border-sand-300 shadow-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1000&q=80"
                alt="Sri Sai Garments Textile Factory"
                className="w-full aspect-[4/3] object-cover rounded-2xl"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Our Journey & Textile Heritage
            </h2>

            <p className="text-charcoal-600 text-sm leading-relaxed">
              Based in Tiruppur, Tamil Nadu — universally recognized as the knitwear capital of India — Sri Sai Garments began with a simple mission: delivering soft, long-lasting, bio-washed cotton garments without premium markup.
            </p>

            <p className="text-charcoal-600 text-sm leading-relaxed">
              Whether you are looking for a single classic cotton t-shirt or ordering 5,000 customized corporate polo shirts with custom embroidery, we handle every stage with strict quality checks.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-charcoal-700 pt-2">
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-sand-200 shadow-2xs">
                <CheckCircle className="w-4 h-4 text-olive" />
                <span>100% Organic Combed Yarn</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-sand-200 shadow-2xs">
                <CheckCircle className="w-4 h-4 text-olive" />
                <span>Eco-Friendly Azo-Free Dyes</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-sand-200 shadow-2xs">
                <CheckCircle className="w-4 h-4 text-olive" />
                <span>In-House Screen Printing</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-sand-200 shadow-2xs">
                <CheckCircle className="w-4 h-4 text-olive" />
                <span>Pan-India Logistics</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Pillar Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-white p-6 rounded-3xl border border-sand-300 shadow-xs hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sand-100 text-olive flex items-center justify-center mb-4 font-bold">
              01
            </div>
            <h3 className="text-charcoal font-bold text-base mb-2">Combed Cotton</h3>
            <p className="text-charcoal-600 text-xs leading-relaxed">
              We exclusively use long-staple combed cotton yarn that removes short fibers, preventing pilling and ensuring silky hand-feel.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-sand-300 shadow-xs hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sand-100 text-olive flex items-center justify-center mb-4 font-bold">
              02
            </div>
            <h3 className="text-charcoal font-bold text-base mb-2">Bio-Wash Finish</h3>
            <p className="text-charcoal-600 text-xs leading-relaxed">
              Enzyme treatment removes fuzz, enhancing color brightness, fabric softness, and resistance against lint accumulation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-sand-300 shadow-xs hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sand-100 text-olive flex items-center justify-center mb-4 font-bold">
              03
            </div>
            <h3 className="text-charcoal font-bold text-base mb-2">Custom Branding</h3>
            <p className="text-charcoal-600 text-xs leading-relaxed">
              Support for DTF printing, high-density silk screening, neck tag relabeling, and polybag packaging for private labels.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-sand-300 shadow-xs hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sand-100 text-olive flex items-center justify-center mb-4 font-bold">
              04
            </div>
            <h3 className="text-charcoal font-bold text-base mb-2">Direct Support</h3>
            <p className="text-charcoal-600 text-xs leading-relaxed">
              Speak directly with our garment managers via WhatsApp for stock confirmation, custom price quotes, and sample requests.
            </p>
          </div>
        </div>

        {/* Location & Contact CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl border border-sand-300 bg-sand-100/80 text-center space-y-6 shadow-xs">
          <div className="flex items-center justify-center gap-2 text-olive text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4" /> Visit Our Tiruppur Store & Office
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal">
            Have Questions or Need a Custom Quote?
          </h2>

          <p className="text-charcoal-600 text-xs sm:text-sm max-w-xl mx-auto">
            {COMPANY_ADDRESS}
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent('Hello Sri Sai Garments! I would like to visit or ask questions about your garments.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-olive hover:bg-olive-600 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg shadow-olive/20 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact via WhatsApp</span>
            </a>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white hover:bg-sand-50 text-charcoal font-semibold text-xs px-6 py-3.5 rounded-2xl border border-sand-300 shadow-2xs transition-all"
            >
              <span>Explore Catalogue</span>
              <ArrowRight className="w-4 h-4 text-olive" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
