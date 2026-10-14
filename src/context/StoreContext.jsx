import React, { createContext, useContext, useEffect, useState } from 'react';
import { storeService } from '../services/storeService';
import { isSupabaseConfigured } from '../services/supabase';
import {
  WHATSAPP_PHONE_NUMBER,
  CONTACT_PHONE_DISPLAY,
  COMPANY_EMAIL,
  COMPANY_ADDRESS
} from '../utils/whatsapp';

const defaultSettings = {
  businessName: 'Sri Sai Garments',
  logo: '',
  about: '',
  phone: CONTACT_PHONE_DISPLAY,
  whatsapp: WHATSAPP_PHONE_NUMBER,
  email: COMPANY_EMAIL,
  address: COMPANY_ADDRESS,
  mapUrl: '',
  businessHours: '',
  socialLinks: {},
  footer: '',
  seoTitle: '',
  seoDescription: ''
};
const DEFAULT_SEO_TITLE = 'Sri Sai Garments | Premium Apparel Showcase & Direct Bulk Orders';
const DEFAULT_SEO_DESCRIPTION = 'Discover premium quality T-shirts, shirts, activewear & custom garment manufacturing from Sri Sai Garments, Tiruppur, India. Direct WhatsApp enquiry & bulk ordering.';
const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsConfigured, setSettingsConfigured] = useState(false);
  const [error, setError] = useState('');

  const refreshSettings = async () => {
    try {
      const stored = await storeService.getSettings();
      if (stored) {
        setSettings(stored);
        setSettingsConfigured(true);
      } else {
        setSettings(defaultSettings);
        setSettingsConfigured(false);
      }
      setError('');
    } catch (loadError) {
      setError(loadError.message || 'Store contact information could not be loaded.');
      console.error('Unable to load public store settings:', loadError);
    }
  };

  useEffect(() => { void refreshSettings(); }, []);

  useEffect(() => {
    document.title = settings.seoTitle || DEFAULT_SEO_TITLE;
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.appendChild(description);
    }
    description.setAttribute('content', settings.seoDescription || DEFAULT_SEO_DESCRIPTION);
  }, [settings.seoTitle, settings.seoDescription]);

  return (
    <StoreContext.Provider value={{ settings, settingsConfigured, isSupabaseConfigured, error, refreshSettings }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider.');
  return context;
}
