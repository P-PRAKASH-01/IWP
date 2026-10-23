import { products as initialProducts } from '../data/products';
import { requireSupabase, supabase } from './supabase';

const STORAGE_KEY = 'ssg_products_studio_v3';
const PRODUCT_SELECT = '*, categories!products_category_id_fkey(slug)';

function getStoredProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        const products = parsed.filter((product) => !/^SG\d{3}$/.test(product.id));
        if (products.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        }
        return products;
      }
    }
  } catch (error) {
    console.error('Failed to read local development products:', error);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
  return initialProducts;
}

function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.categories?.slug ?? row.category,
    categoryId: row.category_id,
    productCode: row.product_code,
    description: row.description,
    images: row.image_urls || [],
    imageAlt: row.image_alt || row.name,
    sizes: row.sizes || [],
    colors: row.colors || [],
    material: row.material || '',
    specifications: row.specifications || '',
    price: row.retail_price,
    wholesalePrice: row.wholesale_price,
    pricingType: row.pricing_type,
    minBulkQty: row.minimum_order_quantity,
    availability: row.availability_status === 'available',
    availabilityStatus: row.availability_status,
    featured: row.is_featured,
    status: row.status,
    rating: row.rating || 0,
    reviewsCount: row.reviews_count || 0,
    isNew: false,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toDatabaseProduct(product) {
  return {
    name: product.name.trim(),
    slug: product.slug.trim(),
    description: product.description || '',
    category_id: product.categoryId,
    product_code: product.productCode?.trim() || null,
    image_urls: product.images || [],
    image_alt: product.imageAlt || product.name.trim(),
    sizes: product.sizes || [],
    colors: product.colors || [],
    material: product.material || '',
    specifications: product.specifications || '',
    retail_price: product.price === '' || product.price == null ? null : Number(product.price),
    wholesale_price: product.wholesalePrice === '' || product.wholesalePrice == null
      ? null
      : Number(product.wholesalePrice),
    pricing_type: product.pricingType || 'retail',
    minimum_order_quantity: product.minBulkQty === '' || product.minBulkQty == null
      ? null
      : Number(product.minBulkQty),
    availability_status: product.availabilityStatus || 'available',
    is_featured: Boolean(product.featured),
    status: product.status || 'draft'
  };
}

function filterLocalProducts(rows, filters) {
  const query = filters.search?.trim().toLowerCase();
  const result = rows.filter((product) => {
    const searchMatches = !query || [product.name, product.productCode, product.id]
      .some((value) => value?.toLowerCase().includes(query));
    const statusMatches = filters.status === 'all' || !filters.status || (product.status || 'published') === filters.status;
    const categoryMatches = filters.category === 'all' || !filters.category
      || product.categoryId === filters.category || product.category === filters.category;
    return searchMatches && statusMatches && categoryMatches;
  });
  result.sort((first, second) => {
    if (filters.sort === 'name') return first.name.localeCompare(second.name);
    const direction = filters.sort === 'oldest' ? 1 : -1;
    return direction * (new Date(first.createdAt || 0) - new Date(second.createdAt || 0));
  });
  return result;
}

export const productService = {
  async getAllProducts() {
    if (!supabase) return getStoredProducts();
    const client = requireSupabase();
    const pageSize = 500;
    const allProducts = [];
    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await client
        .from('products')
        .select(PRODUCT_SELECT)
        .order('created_at', { ascending: false })
        .order('id', { ascending: true })
        .range(offset, offset + pageSize - 1);
      if (error) throw error;
      allProducts.push(...data.map(mapProduct));
      if (data.length < pageSize) return allProducts;
    }
  },

  async getProductPage(filters) {
    const { page, pageSize } = filters;
    if (!supabase) {
      const filtered = filterLocalProducts(getStoredProducts(), filters);
      return {
        products: filtered.slice(page * pageSize, (page + 1) * pageSize),
        totalCount: filtered.length
      };
    }
    let query = requireSupabase()
      .from('products')
      .select(PRODUCT_SELECT, { count: 'exact' });
    if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status);
    if (filters.category && filters.category !== 'all') query = query.eq('category_id', filters.category);
    const search = filters.search?.trim().replace(/[^a-zA-Z0-9 @.+-]/g, '');
    if (search) {
      query = query.or(`name.ilike.%${search}%,product_code.ilike.%${search}%`);
    }
    query = query
      .order(filters.sort === 'name' ? 'name' : 'created_at', {
        ascending: filters.sort === 'name' || filters.sort === 'oldest'
      })
      .order('id', { ascending: true })
      .range(page * pageSize, page * pageSize + pageSize - 1);
    const { data, count, error } = await query;
    if (error) throw error;
    return { products: data.map(mapProduct), totalCount: count || 0 };
  },

  async getDashboardSummary() {
    if (!supabase) {
      const rows = getStoredProducts();
      return {
        publishedCount: rows.filter((product) => (product.status || 'published') === 'published').length,
        unpublishedCount: rows.filter((product) => ['draft', 'inactive'].includes(product.status)).length,
        latest: [...rows]
          .sort((first, second) => new Date(second.updatedAt || second.createdAt || 0) - new Date(first.updatedAt || first.createdAt || 0))
          .slice(0, 5)
      };
    }
    const client = requireSupabase();
    const [published, drafts, inactive, latest] = await Promise.all([
      client.from('products').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      client.from('products').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      client.from('products').select('id', { count: 'exact', head: true }).eq('status', 'inactive'),
      client.from('products').select(PRODUCT_SELECT).order('updated_at', { ascending: false }).order('id', { ascending: true }).limit(5)
    ]);
    const failure = [published, drafts, inactive, latest].find((result) => result.error);
    if (failure?.error) throw failure.error;
    return {
      publishedCount: published.count || 0,
      unpublishedCount: (drafts.count || 0) + (inactive.count || 0),
      latest: latest.data.map(mapProduct)
    };
  },

  async getProductById(id) {
    if (!supabase) {
      return getStoredProducts().find((product) => product.id === id) || null;
    }
    const { data, error } = await requireSupabase()
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapProduct(data) : null;
  },

  async addProduct(product) {
    if (!supabase) {
      const products = getStoredProducts();
      const id = `LOCAL-${crypto.randomUUID()}`;
      const productToAdd = {
        ...product,
        id,
        slug: product.slug,
        images: product.images || [],
        availability: product.availabilityStatus === 'available'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([productToAdd, ...products]));
      return productToAdd;
    }
    const { data, error } = await requireSupabase()
      .from('products')
      .insert(toDatabaseProduct(product))
      .select(PRODUCT_SELECT)
      .single();
    if (error) throw error;
    return mapProduct(data);
  },

  async updateProduct(id, product) {
    if (!supabase) {
      const products = getStoredProducts();
      const index = products.findIndex((item) => item.id === id);
      if (index === -1) return null;
      products[index] = { ...products[index], ...product };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      return products[index];
    }
    const { data, error } = await requireSupabase()
      .from('products')
      .update(toDatabaseProduct(product))
      .eq('id', id)
      .select(PRODUCT_SELECT)
      .single();
    if (error) throw error;
    return mapProduct(data);
  },

  async deleteProduct(id) {
    if (!supabase) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(getStoredProducts().filter((product) => product.id !== id))
      );
      return;
    }
    const { error } = await requireSupabase().from('products').delete().eq('id', id);
    if (error) throw error;
  }
};
