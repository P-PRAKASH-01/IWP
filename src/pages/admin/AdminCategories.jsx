import React, { useEffect, useMemo, useState } from 'react';
import { Edit2, Plus, Power } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { storeService } from '../../services/storeService';

const emptyCategory = { name: '', slug: '', description: '', image: '', parentId: '', isActive: true };
const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyCategory);
  const [editingId, setEditingId] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const descendants = useMemo(() => {
    if (!editingId) return new Set();
    const result = new Set([editingId]);
    let changed = true;
    while (changed) {
      changed = false;
      categories.forEach((category) => {
        if (result.has(category.parentId) && !result.has(category.id)) {
          result.add(category.id);
          changed = true;
        }
      });
    }
    return result;
  }, [categories, editingId]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      setCategories(await storeService.getCategories());
    } catch (loadError) {
      setError(loadError.message || 'Categories could not be loaded.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void loadCategories(); }, []);

  const startEdit = (category) => {
    setEditingId(category.id);
    setSlugTouched(true);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      parentId: category.parentId || '',
      isActive: category.isActive
    });
    setError('');
    setNotice('');
  };

  const resetForm = () => {
    setEditingId('');
    setSlugTouched(false);
    setForm(emptyCategory);
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (form.parentId && descendants.has(form.parentId)) {
      setError('A category cannot be assigned beneath itself or one of its own subcategories.');
      return;
    }
    setSaving(true);
    try {
      await storeService.saveCategory({ ...form, id: editingId || undefined, slug: slugify(form.slug), parentId: form.parentId || null });
      setNotice(editingId ? 'Category updated.' : 'Category created.');
      resetForm();
      await loadCategories();
    } catch (saveError) {
      setError(saveError.message || 'Category could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (category) => {
    const childCount = categories.filter((item) => item.parentId === category.id && item.isActive).length;
    if (category.isActive && (category.productCount > 0 || childCount > 0)) {
      const dependencies = [
        category.productCount ? `${category.productCount} product(s)` : '',
        childCount ? `${childCount} active subcategory/subcategories` : ''
      ].filter(Boolean).join(' and ');
      if (!window.confirm(`Deactivate this category? ${dependencies} will no longer be visible in the public catalogue.`)) return;
    }
    try {
      setError('');
      setNotice('');
      await storeService.saveCategory({ ...category, isActive: !category.isActive });
      setNotice(category.isActive ? 'Category deactivated.' : 'Category activated.');
      await loadCategories();
    } catch (saveError) {
      setError(saveError.message || 'Category status could not be changed.');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl space-y-5">
        <header>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="mt-1 text-sm text-charcoal-600">Create parent categories and subcategories. Deactivation hides a category without losing product relationships.</p>
        </header>
        {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-olive-200 bg-olive-50 p-3 text-sm text-olive-900">{notice}</p>}

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 items-start">
          <form onSubmit={saveCategory} className="xl:col-span-2 bg-white rounded-2xl border border-sand-300 p-5 space-y-4">
            <h2 className="font-bold">{editingId ? 'Edit category' : 'New category'}</h2>
            <label className="block text-sm font-semibold">Name *
              <input required maxLength={100} value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value, ...(!slugTouched ? { slug: slugify(event.target.value) } : {}) }))} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
            </label>
            <label className="block text-sm font-semibold">Slug *
              <input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={(event) => { setSlugTouched(true); setForm((value) => ({ ...value, slug: event.target.value })); }} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
            </label>
            <label className="block text-sm font-semibold">Parent category
              <select value={form.parentId} onChange={(event) => setForm((value) => ({ ...value, parentId: event.target.value }))} className="mt-1 w-full rounded-lg border border-sand-300 bg-white p-2.5 font-normal">
                <option value="">None (top-level)</option>
                {categories.filter((item) => item.isActive && !item.parentId && !descendants.has(item.id)).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold">Description
              <textarea rows={3} maxLength={2000} value={form.description} onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
            </label>
            <label className="block text-sm font-semibold">Image URL (optional)
              <input type="url" value={form.image} onChange={(event) => setForm((value) => ({ ...value, image: event.target.value }))} className="mt-1 w-full rounded-lg border border-sand-300 p-2.5 font-normal" />
            </label>
            {editingId && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm((value) => ({ ...value, isActive: event.target.checked }))} className="accent-olive" /> Visible in public catalogue</label>}
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-olive px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Plus className="w-4 h-4" />{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create category'}</button>
              {editingId && <button type="button" onClick={resetForm} className="rounded-lg border border-sand-300 px-4 py-2.5 text-sm font-semibold">Cancel</button>}
            </div>
          </form>

          <section className="xl:col-span-3 bg-white rounded-2xl border border-sand-300 overflow-hidden">
            <h2 className="font-bold p-5 border-b border-sand-200">Category list</h2>
            {loading ? <p role="status" className="p-8 text-sm text-center text-charcoal-600">Loading categories…</p> : categories.length === 0 ? (
              <p className="p-8 text-center text-sm text-charcoal-600">No categories exist yet. Create the categories used by your store.</p>
            ) : (
              <ul className="divide-y divide-sand-200">
                {categories.map((category) => (
                  <li key={category.id} className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{category.parentId ? '↳ ' : ''}{category.name} <span className={`ml-1 text-xs ${category.isActive ? 'text-olive' : 'text-charcoal-500'}`}>{category.isActive ? 'Active' : 'Inactive'}</span></p>
                      <p className="text-xs text-charcoal-500">{category.slug} · {category.productCount} product(s){category.description ? ` · ${category.description}` : ''}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => startEdit(category)} aria-label={`Edit ${category.name}`} className="p-2 rounded-lg border border-sand-300 hover:bg-sand-50"><Edit2 className="w-4 h-4" /></button>
                      <button type="button" onClick={() => void toggleActive(category)} aria-label={`${category.isActive ? 'Deactivate' : 'Activate'} ${category.name}`} className="p-2 rounded-lg border border-sand-300 hover:bg-sand-50"><Power className="w-4 h-4" /></button>
                    </div>
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
