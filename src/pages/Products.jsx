import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Layers, RefreshCw, Filter } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import { productService } from '../services/productService';

export default function Products() {
  const [productsList, setProductsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setProductsList(productService.getAllProducts());
  }, []);

  let filtered = productsList.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.material?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'newest') {
    filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  const resetFilters = () => {
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-olive text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" /> Sri Sai Garments Collection
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
            Complete Garments Catalogue
          </h1>
          <p className="text-charcoal-500 text-sm mt-1">
            Displaying all {filtered.length} garments in stock
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 mb-8 border border-sand-300 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search garments, cotton, polo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sand-50/80 text-charcoal placeholder-charcoal-400 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:border-olive focus:bg-white"
            />
          </div>

          {/* Sort & Reset */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-olive" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-sand-50/80 text-charcoal text-xs font-semibold px-3 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:border-olive"
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">Sort: New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {(searchQuery || sortBy !== 'featured') && (
              <button
                onClick={resetFilters}
                className="p-2.5 rounded-xl bg-sand-50 hover:bg-sand-100 text-charcoal-600 hover:text-olive border border-sand-200 transition-colors"
                title="Reset Search"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Product Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-sand-300 max-w-lg mx-auto my-12 shadow-sm">
            <Filter className="w-10 h-10 text-sand-400 mx-auto mb-3" />
            <h3 className="text-charcoal font-bold text-lg">No Garments Found</h3>
            <p className="text-charcoal-500 text-xs mt-1">
              No products match "{searchQuery}".
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-2 bg-olive hover:bg-olive-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-olive/20 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Show All Garments</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
