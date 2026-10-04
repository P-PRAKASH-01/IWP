import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import { WHATSAPP_PHONE_NUMBER, CONTACT_PHONE_DISPLAY, COMPANY_EMAIL, COMPANY_ADDRESS, buildWhatsAppUrl } from '../utils/whatsapp';
import { enquiryService } from '../services/enquiryService';
import { useWishlist } from '../context/WishlistContext';

export default function Contact() {
  const { showToast } = useWishlist();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    enquiryType: 'retail',
    quantity: '1',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Register enquiry in Phase 3 backend service
    enquiryService.addEnquiry({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      enquiryType: formData.enquiryType,
      quantity: formData.quantity,
      productName: `Direct ${formData.enquiryType.toUpperCase()} Enquiry`,
      message: formData.message
    });

    showToast('Enquiry registered! Redirecting to WhatsApp...', 'success');

    // Build direct WhatsApp URL
    const url = buildWhatsAppUrl({
      product: { name: `General ${formData.enquiryType.toUpperCase()} Enquiry`, id: 'GENERAL', price: 0 },
      quantity: formData.quantity,
      message: `From: ${formData.name} (${formData.phone} / ${formData.email})\nMessage: ${formData.message}`
    });

    setTimeout(() => {
      window.open(url, '_blank');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" /> Direct Contact & Shop Enquiry
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            We'd Love to Hear From You
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm">
            Whether you want to order individual sample garments or inquire about bulk manufacturing rates in Tiruppur, our team responds promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-slate-900 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">WhatsApp Support</h3>
                  <p className="text-xs text-slate-400">Fastest way to get product photos & prices</p>
                </div>
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent('Hello Sri Sai Garments! I would like to inquire about your product catalog.')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Chat with Shop Manager</span>
              </a>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Direct Phone</h4>
                  <a href={`tel:${CONTACT_PHONE_DISPLAY}`} className="text-xs text-indigo-400 hover:underline">
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">Mon - Sat: 9:00 AM - 8:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-800">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Email Address</h4>
                  <a href={`mailto:${COMPANY_EMAIL}`} className="text-xs text-indigo-400 hover:underline">
                    {COMPANY_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-800">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Factory & Showroom Address</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {COMPANY_ADDRESS}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-3xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Working Hours: Mon-Sat (9:00 AM - 8:00 PM)</span>
              </div>
              <span className="text-indigo-400 font-semibold">Tiruppur Hub</span>
            </div>

          </div>

          {/* Right Column Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Send Direct Enquiry</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Fill out the details below to generate an instant enquiry ticket.
                </p>
              </div>

              {submitted && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Enquiry ticket registered! Opening WhatsApp...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-900 text-white text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-900 text-white text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-900 text-white text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Enquiry Category *</label>
                    <select
                      value={formData.enquiryType}
                      onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                      className="w-full bg-slate-900 text-white text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="retail">Single Piece / Retail Inquiry</option>
                      <option value="bulk">Bulk Order / Corporate T-Shirts</option>
                      <option value="custom">Custom Screen Printing / Labeling</option>
                      <option value="partnership">Wholesale Distributorship</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Estimated Quantity (Pcs)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-slate-900 text-white text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Your Message / Order Requirements *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe the garments, colors, sizes or custom printing needs..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-900 text-white text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Ticket & Open WhatsApp</span>
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
