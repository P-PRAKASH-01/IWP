import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { enquiryService } from '../services/enquiryService';
import { useWishlist } from '../context/WishlistContext';
import { useStore } from '../context/StoreContext';

export default function Contact() {
  const { showToast } = useWishlist();
  const { settings } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    enquiryType: 'retail',
    quantity: '1',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    const whatsappWindow = window.open('', '_blank');
    try {
      await enquiryService.addEnquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        enquiryType: formData.enquiryType,
        quantity: formData.quantity,
        productName: `Direct ${formData.enquiryType.toUpperCase()} Enquiry`,
        message: formData.message
      });
      const url = buildWhatsAppUrl({
        product: { name: `General ${formData.enquiryType.toUpperCase()} Enquiry`, id: 'GENERAL' },
        quantity: formData.quantity,
        message: `From: ${formData.name} (${formData.phone}${formData.email ? ` / ${formData.email}` : ''})\nMessage: ${formData.message}`,
        phoneNumber: settings.whatsapp,
        businessName: settings.businessName
      });
      setWhatsappUrl(url);
      setSubmitted(true);
      showToast('Enquiry saved. Continue the conversation on WhatsApp.', 'success');
      if (whatsappWindow) whatsappWindow.location.href = url;
    } catch (error) {
      if (whatsappWindow) whatsappWindow.close();
      setSubmitError(error.message || 'Your enquiry could not be saved. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sand-300 text-olive text-xs font-semibold shadow-2xs">
            <MessageSquare className="w-3.5 h-3.5" /> Direct Contact & Shop Enquiry
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal tracking-tight">
            We'd Love to Hear From You
          </h1>

          <p className="text-charcoal-600 text-xs sm:text-sm">
            Whether you want to order individual sample garments or inquire about bulk manufacturing rates in Tiruppur, our team responds promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-sand-300 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-sand-100 text-olive">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-charcoal font-bold text-base">WhatsApp Support</h3>
                  <p className="text-xs text-charcoal-500">Fastest way to get product photos & prices</p>
                </div>
              </div>

              <a
                href={settings.whatsapp ? `https://wa.me/${String(settings.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${settings.businessName}! I would like to inquire about your product catalog.`)}` : '/contact'}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-olive hover:bg-olive-600 text-white font-bold text-xs py-3.5 rounded-xl shadow-md shadow-olive/20 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Chat with Shop Manager</span>
              </a>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-sand-300 shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-sand-100 text-olive shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-charcoal font-semibold text-sm">Direct Phone</h4>
                  {settings.phone
                    ? <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`} className="text-xs text-olive font-medium hover:underline">{settings.phone}</a>
                    : <span className="text-xs text-charcoal-500">Not provided</span>}
                  {settings.businessHours && <p className="text-[11px] text-charcoal-400 mt-0.5">{settings.businessHours}</p>}
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-sand-200">
                <div className="p-2.5 rounded-xl bg-sand-100 text-olive shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-charcoal font-semibold text-sm">Email Address</h4>
                  {settings.email
                    ? <a href={`mailto:${settings.email}`} className="text-xs text-olive font-medium hover:underline">{settings.email}</a>
                    : <span className="text-xs text-charcoal-500">Not provided</span>}
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-sand-200">
                <div className="p-2.5 rounded-xl bg-sand-100 text-olive shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-charcoal font-semibold text-sm">Factory & Showroom Address</h4>
                  {settings.mapUrl && settings.address
                    ? <a href={settings.mapUrl} target="_blank" rel="noreferrer" className="text-xs text-charcoal-600 leading-relaxed hover:text-olive">{settings.address}</a>
                    : <p className="text-xs text-charcoal-600 leading-relaxed">{settings.address || 'Address not provided'}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-sand-300 text-xs text-charcoal-600 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-olive" />
                <span>{settings.businessHours ? `Working Hours: ${settings.businessHours}` : 'Working hours not provided'}</span>
              </div>
              <span className="text-olive font-bold">Tiruppur Hub</span>
            </div>

          </div>

          {/* Right Column Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-300 shadow-xl relative">
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-charcoal">Send Direct Enquiry</h3>
                <p className="text-xs text-charcoal-500 mt-1">
                  Fill out the details below to generate an instant enquiry ticket.
                </p>
              </div>

              {submitted && (
                <div role="status" className="mb-6 p-4 rounded-2xl bg-sand-100 border border-sand-300 text-olive text-xs flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-olive shrink-0" />
                  <span>Enquiry saved. {whatsappUrl && <a className="underline" href={whatsappUrl} target="_blank" rel="noreferrer">Continue on WhatsApp</a>}</span>
                </div>
              )}
              {submitError && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">{submitError}</p>}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal-700">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      maxLength={120}
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-sand-50/80 text-charcoal text-xs p-3 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal-700">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      minLength={5}
                      maxLength={40}
                      pattern="[0-9+().\\s-]+"
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-sand-50/80 text-charcoal text-xs p-3 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal-700">Email Address (Optional)</label>
                    <input
                      type="email"
                      maxLength={254}
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-sand-50/80 text-charcoal text-xs p-3 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal-700">Enquiry Category *</label>
                    <select
                      value={formData.enquiryType}
                      onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                      className="w-full bg-sand-50/80 text-charcoal text-xs p-3 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:bg-white"
                    >
                      <option value="retail">Single Piece / Retail Inquiry</option>
                      <option value="wholesale">Bulk Order / Corporate T-Shirts</option>
                      <option value="custom">Custom Screen Printing / Labeling</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-700">Estimated Quantity (Pcs)</label>
                  <input
                    type="number"
                    min="1"
                    max="1000000"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-sand-50/80 text-charcoal text-xs p-3 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-700">Your Message / Order Requirements *</label>
                  <textarea
                    required
                    rows={4}
                    maxLength={5000}
                    placeholder="Describe the garments, colors, sizes or custom printing needs..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-sand-50/80 text-charcoal text-xs p-3 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-olive enabled:hover:bg-olive-600 disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-olive/20 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Saving enquiry…' : 'Submit enquiry & open WhatsApp'}</span>
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
