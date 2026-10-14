import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { storeService } from '../../services/storeService';

export default function ActiveBanners() {
  const [banners, setBanners] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    storeService.getBanners()
      .then((rows) => { if (active) setBanners(rows.filter((banner) => banner.isActive)); })
      .catch((loadError) => { if (active) setError(loadError.message || 'Promotional content could not be loaded.'); });
    return () => { active = false; };
  }, []);

  if (error) return <p role="alert" className="mx-auto max-w-7xl px-4 py-3 text-sm text-rose-800">{error}</p>;
  if (!banners.length) return null;

  return (
    <section aria-label="Store promotions" className="py-8 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {banners.map((banner) => (
          <article key={banner.id} className="relative min-h-56 rounded-3xl overflow-hidden border border-sand-300 bg-sand-100">
            {banner.image && <img src={banner.image} alt={banner.imageAlt || ''} className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-charcoal/45" aria-hidden="true" />
            <div className="relative z-10 min-h-56 p-7 sm:p-10 flex flex-col items-start justify-center gap-3 text-white max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold">{banner.heading}</h2>
              {banner.supportingText && <p className="text-sm leading-relaxed">{banner.supportingText}</p>}
              {banner.buttonLabel && banner.destination && (
                <a href={banner.destination} target={banner.destination.startsWith('https://') ? '_blank' : undefined} rel={banner.destination.startsWith('https://') ? 'noreferrer' : undefined} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-sand-100">
                  {banner.buttonLabel} <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
