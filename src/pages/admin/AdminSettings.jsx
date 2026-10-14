import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { storeService } from '../../services/storeService';
import { useStore } from '../../context/StoreContext';

const defaults = {
  businessName: 'Sri Sai Garments', logo: '', about: '', phone: '', whatsapp: '',
  email: '', address: '', mapUrl: '', businessHours: '', footer: '',
  seoTitle: '', seoDescription: '', socialLinks: { instagram: '', facebook: '', youtube: '' }
};
const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export default function AdminSettings() {
  const { refreshSettings } = useStore();
  const [form, setForm] = useState(defaults);
  const [persistedLogo, setPersistedLogo] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const previewUrl = useRef('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    storeService.getSettings().then((settings) => {
      if (active && settings) {
        setForm({ ...defaults, ...settings, socialLinks: { ...defaults.socialLinks, ...settings.socialLinks } });
        setPersistedLogo(settings.logo || '');
        setLogoPreview(settings.logo || '');
      }
    }).catch((loadError) => {
      if (active) setError(loadError.message || 'Store settings could not be loaded.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => () => {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
  }, []);

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const chooseLogo = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!acceptedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError('Choose a JPEG, PNG, WebP or AVIF logo smaller than 5 MB.');
      return;
    }
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = URL.createObjectURL(file);
    setLogoFile(file);
    setLogoPreview(previewUrl.current);
    setError('');
  };

  const save = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (form.mapUrl && !form.mapUrl.startsWith('https://')) {
      setError('Map link must use HTTPS.');
      return;
    }
    if (!form.businessName.trim()) {
      setError('Enter a business display name.');
      return;
    }
    if (form.phone && (!/^[+0-9(). -]{5,40}$/.test(form.phone) || form.phone.replace(/\D/g, '').length < 5)) {
      setError('Enter a valid phone number or leave the field empty.');
      return;
    }
    if (form.whatsapp && (!/^[+0-9(). -]{5,40}$/.test(form.whatsapp) || form.whatsapp.replace(/\D/g, '').length < 5)) {
      setError('Enter a valid WhatsApp number or leave the field empty.');
      return;
    }
    for (const [network, url] of Object.entries(form.socialLinks)) {
      if (url && !url.startsWith('https://')) {
        setError(`${network} link must use HTTPS.`);
        return;
      }
    }
    setSaving(true);
    let uploaded = [];
    const oldLogo = persistedLogo;
    try {
      if (logoFile) uploaded = await storeService.uploadProductImages([logoFile], 'store');
      const next = { ...form, businessName: form.businessName.trim(), logo: uploaded[0] || form.logo };
      await storeService.saveSettings(next);
      await refreshSettings();
      if (oldLogo && next.logo !== oldLogo && oldLogo.includes('/storage/v1/object/public/product-media/')) {
        try {
          await storeService.removeProductImages([oldLogo]);
        } catch (mediaError) {
          setNotice(`Settings saved, but the replaced logo could not be removed: ${mediaError.message}`);
        }
      }
      setForm(next);
      setPersistedLogo(next.logo);
      setLogoFile(null);
      setNotice((current) => current || 'Store information saved.');
    } catch (saveError) {
      if (uploaded.length) {
        try {
          await storeService.removeProductImages(uploaded);
        } catch (cleanupError) {
          setError(`${saveError.message || 'Store settings could not be saved.'} Uploaded image cleanup also failed: ${cleanupError.message}`);
          setSaving(false);
          return;
        }
      }
      setError(saveError.message || 'Store settings could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-5">
        <header>
          <h1 className="text-2xl font-bold">Store information</h1>
          <p className="mt-1 text-sm text-charcoal-600">Saved contact details are shared with storefront contact and footer sections.</p>
        </header>
        {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-olive-200 bg-olive-50 p-3 text-sm text-olive-900">{notice}</p>}
        {loading ? <p role="status" className="py-12 text-center text-sm">Loading store settings…</p> : (
          <form onSubmit={save} className="space-y-5">
            <section className="bg-white rounded-2xl border border-sand-300 p-5 space-y-4">
              <h2 className="font-bold">Business identity</h2>
              <label className="block text-sm font-semibold">Business display name *
                <input required maxLength={120} value={form.businessName} onChange={(event) => setField('businessName', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </label>
              <label className="block text-sm font-semibold">Logo
                <span className="mt-1 block text-xs font-normal text-charcoal-600">JPEG, PNG, WebP or AVIF; maximum 5 MB.</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={chooseLogo} className="sr-only" />
                <span className="mt-2 inline-flex items-center gap-2 rounded-lg border border-sand-300 px-3 py-2 text-sm font-semibold"><ImagePlus className="w-4 h-4 text-olive" />Choose logo</span>
              </label>
              {logoPreview && <div className="flex items-start gap-3"><img src={logoPreview} alt={`${form.businessName} logo preview`} className="max-h-28 max-w-56 object-contain rounded-lg border border-sand-200 p-2" /><button type="button" onClick={() => { setLogoFile(null); setLogoPreview(''); setForm((current) => ({ ...current, logo: '' })); }} className="text-xs font-semibold text-rose-700 hover:underline">Remove logo</button></div>}
              <label className="block text-sm font-semibold">Approved about description
                <textarea rows={4} maxLength={5000} value={form.about} onChange={(event) => setField('about', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </label>
            </section>

            <section className="bg-white rounded-2xl border border-sand-300 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <h2 className="font-bold sm:col-span-2">Contact details</h2>
              <label className="block text-sm font-semibold">Phone
                <input type="tel" maxLength={40} value={form.phone} onChange={(event) => setField('phone', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </label>
              <label className="block text-sm font-semibold">WhatsApp number
                <input type="tel" maxLength={40} value={form.whatsapp} onChange={(event) => setField('whatsapp', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </label>
              <label className="block text-sm font-semibold">Contact email
                <input type="email" maxLength={254} value={form.email} onChange={(event) => setField('email', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </label>
              <label className="block text-sm font-semibold">Business hours
                <input maxLength={180} value={form.businessHours} onChange={(event) => setField('businessHours', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </label>
              <label className="block text-sm font-semibold sm:col-span-2">Address
                <textarea rows={2} maxLength={500} value={form.address} onChange={(event) => setField('address', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </label>
              <label className="block text-sm font-semibold sm:col-span-2">Map link (HTTPS)
                <input type="url" value={form.mapUrl} onChange={(event) => setField('mapUrl', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </label>
            </section>

            <section className="bg-white rounded-2xl border border-sand-300 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <h2 className="font-bold sm:col-span-2">Social links and search details</h2>
              {Object.keys(form.socialLinks).map((network) => (
                <label key={network} className="block text-sm font-semibold capitalize">{network} URL (HTTPS)
                  <input type="url" value={form.socialLinks[network] || ''} onChange={(event) => setForm((current) => ({ ...current, socialLinks: { ...current.socialLinks, [network]: event.target.value } }))} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
                </label>
              ))}
              <label className="block text-sm font-semibold sm:col-span-2">Footer information
                <textarea rows={2} maxLength={1000} value={form.footer} onChange={(event) => setField('footer', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </label>
              <label className="block text-sm font-semibold sm:col-span-2">SEO title
                <input maxLength={180} value={form.seoTitle} onChange={(event) => setField('seoTitle', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </label>
              <label className="block text-sm font-semibold sm:col-span-2">SEO description
                <textarea rows={2} maxLength={500} value={form.seoDescription} onChange={(event) => setField('seoDescription', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </label>
            </section>
            <div className="flex justify-end"><button type="submit" disabled={saving} className="rounded-xl bg-olive px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save store information'}</button></div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
