import React, { useState, useEffect } from 'react';
import { Sparkles, Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import { productService } from '../../services/productService';

export default function FeaturedProducts() {
  const [productsList, setProductsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    productService.getAllProducts()
      .then((products) => { if (active) setProductsList(products); })
      .catch((loadError) => { if (active) setError(loadError.message || 'The catalogue could not be loaded.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  let displayProducts = productsList.filter((p) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.material?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  if (sortBy === 'price-low') {
    displayProducts.sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER));
  } else if (sortBy === 'price-high') {
    displayProducts.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  } else if (sortBy === 'rating') {
    displayProducts.sort((a, b) => b.rating - a.rating);
  } else {
    displayProducts.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }

  return (
    <section id="catalogue-section" className="py-16 bg-ivory relative border-t border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-olive text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> Full Garments Collection
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
              Explore Our All Garments Catalogue
            </h2>
            <p className="text-charcoal-500 text-xs sm:text-sm mt-1">
              {loading ? 'Loading published products…' : `Displaying ${displayProducts.length} published products`}
            </p>
          </div>

          {/* Quick Search & Sort Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type="text"
                placeholder="Search t-shirt, shirt, polo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white text-charcoal placeholder-charcoal-400 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive w-48 sm:w-60 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-olive" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white text-charcoal text-xs font-semibold px-3 py-2.5 rounded-xl border border-sand-300 focus:outline-none focus:border-olive shadow-2xs"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {error && <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {loading ? <p role="status" className="py-12 text-center text-sm text-charcoal-600">Loading catalogue…</p> : displayProducts.length === 0 ? (
          <p className="rounded-2xl border border-sand-300 bg-white py-12 text-center text-sm text-charcoal-600">No published products are available yet.</p>
        ) : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>}

      </div>
    </section>
  );
}
