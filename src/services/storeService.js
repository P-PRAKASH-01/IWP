import { categories as localCategories } from '../data/categories';
import { products } from '../data/products';
import { requireSupabase, supabase } from './supabase';

const SETTINGS_KEY = 'ssg_store_settings';
const BANNERS_KEY = 'ssg_store_banners';
const CATEGORY_SELECT = '*, products(count)';
const IMAGE_BUCKET = 'product-media';

function localGet(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error(`Failed to read local development ${key}:`, error);
    return fallback;
  }
}

function mapCategory(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    image: row.image_url || '',
    parentId: row.parent_id,
    isActive: row.is_active,
    productCount: row.products?.[0]?.count ?? 0
  };
}

function toDatabaseCategory(category) {
  return {
    name: category.name.trim(),
    slug: category.slug.trim(),
    description: category.description || '',
    image_url: category.image || null,
    parent_id: category.parentId || null,
    is_active: category.isActive !== false
  };
}

export const storeService = {
  async getCategories() {
    if (!supabase) {
      return localCategories.map((category) => ({
        ...category,
        parentId: null,
        isActive: true,
        productCount: products.filter((product) => product.category === category.slug).length
      }));
    }
    const { data, error } = await requireSupabase()
      .from('categories')
      .select(CATEGORY_SELECT)
      .order('name');
    if (error) throw error;
    return data.map(mapCategory);
  },

  async getCategoryCount() {
    if (!supabase) return (await this.getCategories()).length;
    const { count, error } = await requireSupabase()
      .from('categories')
      .select('id', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  },

  async saveCategory(category) {
    if (!supabase) throw new Error('Category management requires a configured database.');
    const client = requireSupabase();
    const query = category.id
      ? client.from('categories').update(toDatabaseCategory(category)).eq('id', category.id)
      : client.from('categories').insert(toDatabaseCategory(category));
    const { data, error } = await query.select(CATEGORY_SELECT).single();
    if (error) throw error;
    return mapCategory(data);
  },

  async getBanners() {
    if (!supabase) return localGet(BANNERS_KEY, []);
    const { data, error } = await requireSupabase()
      .from('banners')
      .select('*')
      .order('sort_order')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map((banner) => ({
      id: banner.id,
      heading: banner.heading,
      supportingText: banner.supporting_text,
      buttonLabel: banner.button_label,
      destination: banner.destination,
      image: banner.image_url,
      imageAlt: banner.image_alt,
      isActive: banner.is_active,
      sortOrder: banner.sort_order
    }));
  },

  async saveBanner(banner) {
    if (!supabase) throw new Error('Banner management requires a configured database.');
    const payload = {
      heading: banner.heading.trim(),
      supporting_text: banner.supportingText || '',
      button_label: banner.buttonLabel || '',
      destination: banner.destination || '',
      image_url: banner.image || '',
      image_alt: banner.imageAlt || banner.heading,
      is_active: Boolean(banner.isActive),
      sort_order: Number(banner.sortOrder) || 0
    };
    const client = requireSupabase();
    const query = banner.id
      ? client.from('banners').update(payload).eq('id', banner.id)
      : client.from('banners').insert(payload);
    const { data, error } = await query.select('*').single();
    if (error) throw error;
    return data;
  },

  async getSettings() {
    if (!supabase) return localGet(SETTINGS_KEY, null);
    const { data, error } = await requireSupabase()
      .from('store_settings')
      .select('*')
      .eq('id', true)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      businessName: data.business_name,
      logo: data.logo_url,
      about: data.about_text,
      phone: data.phone,
      whatsapp: data.whatsapp_phone,
      email: data.contact_email,
      address: data.address,
      mapUrl: data.map_url,
      businessHours: data.business_hours,
      socialLinks: data.social_links || {},
      footer: data.footer_text,
      seoTitle: data.seo_title,
      seoDescription: data.seo_description
    };
  },

  async saveSettings(settings) {
    if (!supabase) throw new Error('Store settings require a configured database.');
    const { error } = await requireSupabase().from('store_settings').upsert({
      id: true,
      business_name: settings.businessName.trim(),
      logo_url: settings.logo || '',
      about_text: settings.about || '',
      phone: settings.phone || '',
      whatsapp_phone: settings.whatsapp || '',
      contact_email: settings.email || '',
      address: settings.address || '',
      map_url: settings.mapUrl || '',
      business_hours: settings.businessHours || '',
      social_links: settings.socialLinks || {},
      footer_text: settings.footer || '',
      seo_title: settings.seoTitle || '',
      seo_description: settings.seoDescription || '',
      is_public: true
    });
    if (error) throw error;
  },

  async uploadProductImages(files, folder = 'products', onProgress) {
    if (!['products', 'categories', 'banners', 'store'].includes(folder)) {
      throw new Error('Unsupported media folder.');
    }
    const client = requireSupabase();
    const uploadedUrls = [];
    for (const [index, file] of files.entries()) {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${folder}/${crypto.randomUUID()}.${extension}`;
      const { error } = await client.storage.from(IMAGE_BUCKET).upload(path, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });
      if (error) {
        if (uploadedUrls.length) await this.removeProductImages(uploadedUrls);
        throw error;
      }
      const { data } = client.storage.from(IMAGE_BUCKET).getPublicUrl(path);
      uploadedUrls.push(data.publicUrl);
      onProgress?.(index + 1, files.length);
    }
    return uploadedUrls;
  },

  async removeProductImages(urls) {
    if (!urls.length) return;
    const client = requireSupabase();
    const paths = urls.map((imageUrl) => {
      const marker = `/${IMAGE_BUCKET}/`;
      const markerIndex = new URL(imageUrl).pathname.indexOf(marker);
      if (markerIndex < 0) throw new Error('Cannot remove an image outside the product media bucket.');
      return decodeURIComponent(new URL(imageUrl).pathname.slice(markerIndex + marker.length));
    });
    const { error } = await client.storage.from(IMAGE_BUCKET).remove(paths);
    if (error) throw error;
  }
};
