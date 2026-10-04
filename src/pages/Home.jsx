import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import { Factory, MessageSquare, ArrowRight, Award, CheckCircle } from 'lucide-react';
import { WHATSAPP_PHONE_NUMBER } from '../utils/whatsapp';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Direct All Garments Catalogue Grid */}
      <FeaturedProducts />

      {/* 3. Manufacturing & Bulk Order Showcase Banner */}
      <section className="py-20 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 relative overflow-hidden border-t border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Factory className="w-3.5 h-3.5" /> Direct From Tiruppur Textile Factory
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Need Custom Printed T-Shirts or Corporate Bulk Orders?
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Sri Sai Garments offers complete custom manufacturing services for corporate events, sports teams, schools, and fashion labels. From yarn selection and GSM custom knitting to high-density screen printing and embroidery.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-200">
                <div className="flex items-center gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Low MOQ starting from 50 pcs</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom Screen Printing & Embroidery</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom Neck Tags & Branding</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free Physical Sample for Large Orders</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent('Hello Sri Sai Garments! I would like to request a quotation for custom bulk manufacturing.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Request WhatsApp Quotation</span>
                </a>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm px-6 py-3.5 rounded-2xl border border-slate-700 transition-all"
                >
                  <span>Submit Inquiry Form</span>
                  <ArrowRight className="w-4 h-4 text-indigo-400" />
                </Link>
              </div>

            </div>

            {/* Right Card */}
            <div className="lg:col-span-5">
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative space-y-6">
                
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  Why Partner With Us?
                </h3>

                <div className="space-y-4 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold shrink-0">01</div>
                    <div>
                      <strong className="text-white block font-semibold text-sm">Tiruppur Manufacturing Hub</strong>
                      Located in the heart of Tiruppur, enabling direct access to top-grade cotton yarn, dyeing units, and expert garment tailors.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold shrink-0">02</div>
                    <div>
                      <strong className="text-white block font-semibold text-sm">Strict Quality Assurance</strong>
                      Every batch undergoes color-fastness, dimensional stability, and seam strength testing before dispatch.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold shrink-0">03</div>
                    <div>
                      <strong className="text-white block font-semibold text-sm">Fast Dispatch Logistics</strong>
                      Reliable shipping partners across all states in India and overseas port dispatch options.
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
