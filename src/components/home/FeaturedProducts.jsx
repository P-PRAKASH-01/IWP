import React, { useState, useEffect } from 'react';
import { Sparkles, Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import { productService } from '../../services/productService';

export default function FeaturedProducts() {
  const [productsList, setProductsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setProductsList(productService.getAllProducts());
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
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    displayProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    displayProducts.sort((a, b) => b.rating - a.rating);
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
              Displaying all {displayProducts.length} available dresses & garment designs
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
