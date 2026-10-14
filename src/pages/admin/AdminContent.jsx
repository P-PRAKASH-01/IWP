import React, { useEffect, useRef, useState } from 'react';
import { Edit2, Power } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { storeService } from '../../services/storeService';

const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const freshBanner = { heading: '', supportingText: '', buttonLabel: '', destination: '', image: '', imageAlt: '', isActive: false, sortOrder: 0 };

export default function AdminContent() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(freshBanner);
  const [editingId, setEditingId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const previewUrl = useRef('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => () => {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      setBanners(await storeService.getBanners());
    } catch (loadError) {
      setError(loadError.message || 'Homepage banners could not be loaded.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void loadBanners(); }, []);

  const clearForm = () => {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = '';
    setPreview('');
    setImageFile(null);
    setEditingId('');
    setForm(freshBanner);
  };

  const editBanner = (banner) => {
    clearForm();
    setEditingId(banner.id);
    setForm({ ...banner });
    setPreview(banner.image || '');
    setError('');
    setNotice('');
  };

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!acceptedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError('Choose a JPEG, PNG, WebP or AVIF banner image smaller than 5 MB.');
      return;
    }
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = URL.createObjectURL(file);
    setImageFile(file);
    setPreview(previewUrl.current);
    setError('');
  };

  const saveBanner = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    const destination = form.destination.trim();
    const isInternalPath = destination.startsWith('/')
      && !destination.startsWith('//')
      && !destination.includes('\\')
      && !/[\u0000-\u0020]/.test(destination);
    if (destination && !(destination.startsWith('https://') || isInternalPath)) {
      setError('Destination must be an HTTPS URL or a path within this store.');
      return;
    }
    if (!form.image && !imageFile) {
      setError('Add a banner image before saving.');
      return;
    }
    setSaving(true);
    let uploaded = [];
    try {
      if (imageFile) uploaded = await storeService.uploadProductImages([imageFile], 'banners');
      const saved = await storeService.saveBanner({
        ...form,
        id: editingId || undefined,
        image: uploaded[0] || form.image,
        imageAlt: form.imageAlt || form.heading
      });
      if (editingId && form.image && form.image !== saved.image_url && form.image.includes('/storage/v1/object/public/product-media/')) {
        try {
          await storeService.removeProductImages([form.image]);
        } catch (mediaError) {
          setNotice(`Banner saved, but the replaced image could not be removed: ${mediaError.message}`);
        }
      }
      clearForm();
      await loadBanners();
      setNotice((current) => current || 'Banner saved.');
    } catch (saveError) {
      if (uploaded.length) {
        try {
          await storeService.removeProductImages(uploaded);
        } catch (cleanupError) {
          setError(`${saveError.message || 'Banner could not be saved.'} Uploaded image cleanup also failed: ${cleanupError.message}`);
          setSaving(false);
          return;
        }
      }
      setError(saveError.message || 'Banner could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const toggleBanner = async (banner) => {
    try {
      setError('');
      await storeService.saveBanner({ ...banner, isActive: !banner.isActive });
      setNotice(banner.isActive ? 'Banner hidden from the storefront.' : 'Banner published.');
      await loadBanners();
    } catch (saveError) {
      setError(saveError.message || 'Banner visibility could not be changed.');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl space-y-5">
        <header>
          <h1 className="text-2xl font-bold">Homepage content</h1>
          <p className="mt-1 text-sm text-charcoal-600">Manage promotions without adding unsupported claims or offers. Featured products are managed from each product record.</p>
          <Link to="/admin/products" className="mt-2 inline-block text-sm font-semibold text-olive hover:underline">Manage featured products →</Link>
        </header>
        {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-olive-200 bg-olive-50 p-3 text-sm text-olive-900">{notice}</p>}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 items-start">
          <form onSubmit={saveBanner} className="xl:col-span-2 bg-white rounded-2xl border border-sand-300 p-5 space-y-4">
            <h2 className="font-bold">{editingId ? 'Edit banner' : 'Add banner'}</h2>
            <label className="block text-sm font-semibold">Heading *
              <input required maxLength={180} value={form.heading} onChange={(event) => setForm((value) => ({ ...value, heading: event.target.value }))} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
            </label>
            <label className="block text-sm font-semibold">Supporting text
              <textarea rows={3} maxLength={1000} value={form.supportingText} onChange={(event) => setForm((value) => ({ ...value, supportingText: event.target.value }))} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
            </label>
            <label className="block text-sm font-semibold">Button label
              <input maxLength={80} value={form.buttonLabel} onChange={(event) => setForm((value) => ({ ...value, buttonLabel: event.target.value }))} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
            </label>
            <label className="block text-sm font-semibold">Destination (HTTPS URL or store path)
              <input value={form.destination} onChange={(event) => setForm((value) => ({ ...value, destination: event.target.value }))} placeholder="/products" className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
            </label>
            <label className="block text-sm font-semibold">Image alt text
              <input maxLength={250} value={form.imageAlt} onChange={(event) => setForm((value) => ({ ...value, imageAlt: event.target.value }))} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
            </label>
            <label className="block text-sm font-semibold">Banner image *
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={selectImage} className="mt-1 block w-full text-sm font-normal" />
            </label>
            {preview && <img src={preview} alt={form.imageAlt || form.heading || 'Banner preview'} className="w-full aspect-[16/7] object-cover rounded-xl border border-sand-200" />}
            <label className="block text-sm font-semibold">Display order
              <input type="number" step="1" value={form.sortOrder} onChange={(event) => setForm((value) => ({ ...value, sortOrder: event.target.value }))} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
            </label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm((value) => ({ ...value, isActive: event.target.checked }))} className="accent-olive" /> Published on storefront</label>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="rounded-lg bg-olive px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save banner'}</button>
              {editingId && <button type="button" onClick={clearForm} className="rounded-lg border border-sand-300 px-4 py-2.5 text-sm font-semibold">Cancel</button>}
            </div>
          </form>
          <section className="xl:col-span-3 bg-white rounded-2xl border border-sand-300 overflow-hidden">
            <h2 className="font-bold p-5 border-b border-sand-200">Banners</h2>
            {loading ? <p role="status" className="p-8 text-center text-sm">Loading banners…</p> : banners.length === 0 ? (
              <p className="p-8 text-center text-sm text-charcoal-600">No banners have been added.</p>
            ) : (
              <ul className="divide-y divide-sand-200">
                {banners.map((banner) => (
                  <li key={banner.id} className="p-4 flex gap-3 items-center">
                    {banner.image && <img src={banner.image} alt={banner.imageAlt || banner.heading} className="w-24 h-16 rounded-lg object-cover" />}
                    <div className="flex-1 min-w-0"><p className="font-semibold truncate">{banner.heading}</p><p className="text-xs text-charcoal-500">Order {banner.sortOrder} · {banner.isActive ? 'Published' : 'Hidden'}</p></div>
                    <button type="button" onClick={() => editBanner(banner)} aria-label={`Edit ${banner.heading}`} className="p-2 border border-sand-300 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button type="button" onClick={() => void toggleBanner(banner)} aria-label={`${banner.isActive ? 'Hide' : 'Publish'} ${banner.heading}`} className="p-2 border border-sand-300 rounded-lg"><Power className="w-4 h-4" /></button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
