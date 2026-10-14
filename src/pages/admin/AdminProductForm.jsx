import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { productService } from '../../services/productService';
import { storeService } from '../../services/storeService';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function makeSlug(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function Field({ label, htmlFor, children }) {
  return <label htmlFor={htmlFor} className="block text-sm font-semibold text-charcoal-700">{label}{children}</label>;
}

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [imageItems, setImageItems] = useState([]);
  const objectUrls = useRef(new Set());
  const [form, setForm] = useState({
    name: '', slug: '', categoryId: '', productCode: '', description: '',
    material: '', specifications: '', price: '', wholesalePrice: '',
    pricingType: 'retail', minBulkQty: '', sizes: '', colors: '',
    availabilityStatus: 'available', status: 'draft', featured: false, imageAlt: ''
  });

  useEffect(() => () => {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      storeService.getCategories(),
      id ? productService.getProductById(id) : Promise.resolve(null)
    ]).then(([categoryRows, product]) => {
      if (!active) return;
      setCategories(categoryRows);
      if (id && !product) {
        setError('This product could not be found.');
        return;
      }
      if (product) {
        setForm({
          name: product.name || '',
          slug: product.slug || '',
          categoryId: product.categoryId || '',
          productCode: product.productCode || '',
          description: product.description || '',
          material: product.material || '',
          specifications: product.specifications || '',
          price: product.price ?? '',
          wholesalePrice: product.wholesalePrice ?? '',
          pricingType: product.pricingType || 'retail',
          minBulkQty: product.minBulkQty ?? '',
          sizes: (product.sizes || []).join(', '),
          colors: (product.colors || []).map((color) => color.name || '').filter(Boolean).join(', '),
          availabilityStatus: product.availabilityStatus || (product.availability ? 'available' : 'unavailable'),
          status: product.status || 'draft',
          featured: Boolean(product.featured),
          imageAlt: product.imageAlt || product.name
        });
        setImageItems((product.images || []).map((url) => ({ url, file: null })));
      }
    }).catch((loadError) => {
      if (active) setError(loadError.message || 'Product form information could not be loaded.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [id]);

  const changeField = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === 'name' && !slugEdited ? { slug: makeSlug(value) } : {})
    }));
  };

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    const invalid = files.find((file) => !ACCEPTED_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE);
    if (invalid) {
      setError(`${invalid.name}: choose a JPEG, PNG, WebP or AVIF image smaller than 5 MB.`);
      return;
    }
    if (imageItems.length + files.length > 10) {
      setError('A product can have up to 10 gallery images.');
      return;
    }
    setError('');
    const addedItems = files.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.add(url);
      return { url, file };
    });
    setImageItems((current) => [...current, ...addedItems]);
  };

  const moveImage = (index, offset) => {
    const destination = index + offset;
    if (destination < 0 || destination >= imageItems.length) return;
    setImageItems((current) => {
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!form.categoryId) {
      setError('Choose an active category before saving this product.');
      return;
    }
    if (form.pricingType !== 'quote' && form.price === '' && form.wholesalePrice === '') {
      setError('Enter at least one price, or choose quote-based pricing.');
      return;
    }
    const slug = makeSlug(form.slug);
    if (!slug) {
      setError('Enter a product name or slug containing letters or numbers.');
      return;
    }
    setSaving(true);
    let uploadedUrls = [];
    let savedProduct;
    let mediaNotice = '';
    try {
      const previousProduct = id ? await productService.getProductById(id) : null;
      const newFiles = imageItems.filter((item) => item.file).map((item) => item.file);
      uploadedUrls = newFiles.length
        ? await storeService.uploadProductImages(newFiles, 'products', (complete, total) => setUploadProgress({ complete, total }))
        : [];
      let uploadIndex = 0;
      const images = imageItems.map((item) => item.file ? uploadedUrls[uploadIndex++] : item.url);
      const payload = {
        name: form.name.trim(),
        slug,
        categoryId: form.categoryId,
        productCode: form.productCode.trim(),
        description: form.description.trim(),
        material: form.material.trim(),
        specifications: form.specifications.trim(),
        price: form.price,
        wholesalePrice: form.wholesalePrice,
        pricingType: form.pricingType,
        minBulkQty: form.minBulkQty,
        sizes: form.sizes.split(',').map((value) => value.trim()).filter(Boolean),
        colors: form.colors.split(',').map((name) => name.trim()).filter(Boolean).map((name) => ({ name })),
        availabilityStatus: form.availabilityStatus,
        status: form.status,
        featured: form.featured,
        imageAlt: form.imageAlt.trim() || form.name.trim(),
        images
      };
      savedProduct = id
        ? await productService.updateProduct(id, payload)
        : await productService.addProduct(payload);

      if (id) {
        const removedImages = (previousProduct?.images || []).filter((url) => !images.includes(url) && url.includes('/storage/v1/object/public/product-media/'));
        if (removedImages.length) {
          try {
            await storeService.removeProductImages(removedImages);
          } catch (mediaError) {
            mediaNotice = `Product saved, but an unused image could not be removed: ${mediaError.message}`;
          }
        }
      }
      navigate('/admin/products', { replace: true, state: mediaNotice ? { notice: mediaNotice } : null });
    } catch (saveError) {
      if (uploadedUrls.length && !savedProduct) {
        try {
          await storeService.removeProductImages(uploadedUrls);
        } catch (cleanupError) {
          setError(`${saveError.message || 'Product could not be saved.'} Uploaded media cleanup also failed: ${cleanupError.message}`);
          setSaving(false);
          return;
        }
      }
      setError(saveError.message || 'Product could not be saved.');
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-5">
        <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm font-semibold text-olive hover:underline"><ArrowLeft className="w-4 h-4" /> Back to products</Link>
        <header>
          <h1 className="text-2xl font-bold text-charcoal">{id ? 'Edit product' : 'Add product'}</h1>
          <p className="mt-1 text-sm text-charcoal-600">Optional product details may remain blank when they are not available.</p>
        </header>

        {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{notice}</p>}
        {uploadProgress && <p role="status" className="rounded-xl border border-sand-300 bg-white p-3 text-sm text-charcoal-700">Uploading image {uploadProgress.complete} of {uploadProgress.total}…</p>}
        {loading ? <p role="status" className="py-12 text-center text-sm text-charcoal-600">Loading product…</p> : (
          <form onSubmit={handleSave} className="space-y-5">
            <section className="bg-white rounded-2xl border border-sand-300 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Product name *" htmlFor="product-name">
                <input id="product-name" required maxLength={180} value={form.name} onChange={(event) => changeField('name', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </Field>
              <Field label="Slug *" htmlFor="product-slug">
                <input id="product-slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={(event) => { setSlugEdited(true); changeField('slug', event.target.value); }} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </Field>
              <Field label="Category or subcategory *" htmlFor="product-category">
                <select id="product-category" required value={form.categoryId} onChange={(event) => changeField('categoryId', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 bg-white p-2.5 font-normal">
                  <option value="">Select a category</option>
                  {categories.filter((item) => item.isActive || item.id === form.categoryId).map((item) => <option key={item.id} value={item.id}>{item.parentId ? '— ' : ''}{item.name}{item.isActive ? '' : ' (inactive)'}</option>)}
                </select>
                {categories.filter((item) => item.isActive).length === 0 && <span className="block mt-1 text-xs text-rose-700">Create an active category first.</span>}
              </Field>
              <Field label="Product code / SKU" htmlFor="product-code">
                <input id="product-code" maxLength={80} value={form.productCode} onChange={(event) => changeField('productCode', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </Field>
              <Field label="Retail price (₹)" htmlFor="product-price">
                <input id="product-price" type="number" min="0" step="0.01" value={form.price} onChange={(event) => changeField('price', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </Field>
              <Field label="Wholesale price (₹)" htmlFor="product-wholesale">
                <input id="product-wholesale" type="number" min="0" step="0.01" value={form.wholesalePrice} onChange={(event) => changeField('wholesalePrice', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </Field>
              <Field label="Pricing type" htmlFor="product-pricing-type">
                <select id="product-pricing-type" value={form.pricingType} onChange={(event) => changeField('pricingType', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 bg-white p-2.5 font-normal">
                  <option value="retail">Retail</option><option value="wholesale">Wholesale</option><option value="quote">Quote based</option>
                </select>
              </Field>
              <Field label="Minimum order quantity" htmlFor="product-moq">
                <input id="product-moq" type="number" min="1" step="1" value={form.minBulkQty} onChange={(event) => changeField('minBulkQty', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </Field>
              <Field label="Material / fabric" htmlFor="product-material">
                <input id="product-material" maxLength={300} value={form.material} onChange={(event) => changeField('material', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </Field>
              <Field label="Sizes (comma separated)" htmlFor="product-sizes">
                <input id="product-sizes" value={form.sizes} onChange={(event) => changeField('sizes', event.target.value)} placeholder="S, M, L, XL" className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </Field>
              <Field label="Colours (comma separated)" htmlFor="product-colors">
                <input id="product-colors" value={form.colors} onChange={(event) => changeField('colors', event.target.value)} placeholder="Navy, White" className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </Field>
              <Field label="Availability" htmlFor="product-availability">
                <select id="product-availability" value={form.availabilityStatus} onChange={(event) => changeField('availabilityStatus', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 bg-white p-2.5 font-normal">
                  <option value="available">Available</option><option value="unavailable">Unavailable</option><option value="preorder">Pre-order</option>
                </select>
              </Field>
              <Field label="Publication status" htmlFor="product-status">
                <select id="product-status" value={form.status} onChange={(event) => changeField('status', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 bg-white p-2.5 font-normal">
                  <option value="draft">Save as draft</option><option value="published">Publish</option><option value="inactive">Inactive</option>
                </select>
              </Field>
              <Field label="Description" htmlFor="product-description">
                <textarea id="product-description" rows={4} maxLength={10000} value={form.description} onChange={(event) => changeField('description', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal sm:col-span-2" />
              </Field>
              <Field label="Specifications" htmlFor="product-specifications">
                <textarea id="product-specifications" rows={3} maxLength={5000} value={form.specifications} onChange={(event) => changeField('specifications', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal sm:col-span-2" />
              </Field>
              <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
                <input type="checkbox" checked={form.featured} onChange={(event) => changeField('featured', event.target.checked)} className="accent-olive" />
                Feature this product on the homepage
              </label>
            </section>

            <section className="bg-white rounded-2xl border border-sand-300 p-5 space-y-4">
              <div>
                <h2 className="font-bold">Product images</h2>
                <p className="text-xs text-charcoal-600 mt-1">Up to 10 JPEG, PNG, WebP or AVIF images, maximum 5 MB each. First image is primary.</p>
              </div>
              <Field label="Image alt text" htmlFor="product-image-alt">
                <input id="product-image-alt" maxLength={250} value={form.imageAlt} onChange={(event) => changeField('imageAlt', event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
              </Field>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-sand-300 px-3 py-2 text-sm font-semibold hover:bg-sand-50">
                <ImagePlus className="w-4 h-4 text-olive" aria-hidden="true" /> Add images
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={handleFiles} className="sr-only" />
              </label>
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {imageItems.map((item, index) => (
                  <li key={`${item.url}-${index}`} className="relative rounded-xl border border-sand-300 p-2">
                    <img src={item.url} alt={form.imageAlt || form.name || 'Product preview'} className="w-full aspect-square object-cover rounded-lg" />
                    <div className="flex justify-between pt-2">
                      <span className="text-xs text-charcoal-600">{index === 0 ? 'Primary' : `Image ${index + 1}`}</span>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} aria-label={`Move image ${index + 1} earlier`} className="p-1 disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => moveImage(index, 1)} disabled={index === imageItems.length - 1} aria-label={`Move image ${index + 1} later`} className="p-1 disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => setImageItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove image ${index + 1}`} className="p-1 text-rose-700"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white rounded-2xl border border-sand-300 p-5">
              <button type="button" aria-expanded={previewOpen} onClick={() => setPreviewOpen((open) => !open)} className="text-sm font-bold text-olive hover:underline">
                {previewOpen ? 'Hide storefront preview' : 'Preview storefront card'}
              </button>
              {previewOpen && (
                <div className="mt-4 max-w-xs overflow-hidden rounded-2xl border border-sand-300">
                  {imageItems[0] && <img src={imageItems[0].url} alt={form.imageAlt || form.name || 'Product preview'} className="aspect-square w-full object-cover" />}
                  <div className="space-y-2 p-4">
                    <p className="font-bold">{form.name || 'Product name'}</p>
                    <p className="text-sm font-semibold">{form.pricingType === 'quote' || form.price === '' ? 'Ask for price' : `₹${form.price}`}</p>
                    <p className="line-clamp-3 text-xs text-charcoal-600">{form.description || 'Product description will appear here.'}</p>
                    <span className="inline-block rounded-full bg-sand-100 px-2.5 py-1 text-xs capitalize">{form.status}</span>
                  </div>
                </div>
              )}
            </section>

            <div className="flex justify-end gap-3">
              <Link to="/admin/products" className="rounded-xl border border-sand-300 px-4 py-2.5 text-sm font-semibold">Cancel</Link>
              <button type="submit" disabled={saving || categories.filter((item) => item.isActive).length === 0} className="rounded-xl bg-olive px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                {saving ? 'Saving…' : form.status === 'published' ? 'Save and publish' : 'Save product'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
