import { products as initialProducts } from '../data/products';

const STORAGE_KEY = 'ssg_products_data';

// Initialize products in LocalStorage if not present
function getStoredProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse stored products', e);
  }
  // Fallback to initial dataset
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
  return initialProducts;
}

export const productService = {
  getAllProducts() {
    return getStoredProducts();
  },

  getProductById(id) {
    const products = getStoredProducts();
    return products.find((p) => p.id === id) || null;
  },

  addProduct(newProduct) {
    const products = getStoredProducts();
    const id = `SG${String(products.length + 1).padStart(3, '0')}`;
    const productToAdd = {
      ...newProduct,
      id,
      slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: newProduct.rating || 5.0,
      reviewsCount: newProduct.reviewsCount || 1,
      availability: newProduct.availability !== undefined ? newProduct.availability : true,
      images: newProduct.images?.length > 0 ? newProduct.images : [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
      ]
    };
    const updated = [productToAdd, ...products];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return productToAdd;
  },

  updateProduct(id, updatedFields) {
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updatedFields
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return products[index];
  },

  deleteProduct(id) {
    const products = getStoredProducts();
    const updated = products.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  },

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  }
};
