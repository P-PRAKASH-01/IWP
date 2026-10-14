import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  RefreshCw, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  X,
} from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import { productService } from '../services/productService';
import { storeService } from '../services/storeService';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const COLOR_SWATCHES = [
  { name: 'Black', hex: '#111827' },
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Grey', hex: '#6B7280' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Olive', hex: '#5B6846' },
  { name: 'Beige', hex: '#E8DFD1' },
  { name: 'Brown', hex: '#633B27' },
  { name: 'Burgundy', hex: '#581C28' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Cream', hex: '#FAF6EE', border: true }
];

const FABRICS = [
  '100% Combed Cotton',
  'Cotton Fleece',
  'Pique Cotton',
  'Modal Cotton',
  'Micro-Polyester'
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || '';
  const [productsList, setProductsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Accordion collapse states
  const [openSections, setOpenSections] = useState({
    size: true,
    color: true,
    price: true,
    rating: true,
    fabric: true
  });

  useEffect(() => {
    let active = true;
    Promise.all([productService.getAllProducts(), storeService.getCategories()])
      .then(([products, categoryRows]) => {
        if (active) {
          setProductsList(products);
          setCategories(categoryRows);
        }
      })
      .catch((error) => { if (active) setLoadError(error.message || 'Products could not be loaded.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => setSelectedCategory(categoryFromUrl), [categoryFromUrl]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = 
    Boolean(searchQuery) ||
    Boolean(selectedSize) ||
    Boolean(selectedColor) ||
    maxPrice < 2000 ||
    Boolean(selectedRating) ||
    Boolean(selectedFabric) ||
    Boolean(selectedCategory) ||
    sortBy !== 'featured';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSortBy('featured');
    setSelectedSize(null);
    setSelectedColor(null);
    setMaxPrice(2000);
    setSelectedRating(null);
    setSelectedFabric(null);
    setSelectedCategory('');
    setSearchParams((params) => {
      params.delete('category');
      return params;
    });
  };

  // Filter products
  let filtered = productsList.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedSize) {
      const hasSize = p.sizes?.some(
        (s) =>
          s.toLowerCase() === selectedSize.toLowerCase() ||
          (selectedSize === 'XXXL' && s === '3XL')
      );
      if (!hasSize) return false;
    }

    if (selectedColor) {
      const hasColor = p.colors?.some(
        (c) =>
          c.name.toLowerCase().includes(selectedColor.toLowerCase()) ||
          c.hex?.toLowerCase() === selectedColor.toLowerCase()
      );
      if (!hasColor) return false;
    }

    if (p.price > maxPrice) {
      return false;
    }

    if (selectedRating) {
      if (Math.floor(p.rating) < selectedRating) {
        return false;
      }
    }

    if (selectedFabric) {
      if (!p.material?.toLowerCase().includes(selectedFabric.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  // Sort products
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER));
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'newest') {
    filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  // Filter Sidebar Component Content
  const filterSidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-sand-300">
        <h2 className="text-xl font-bold text-charcoal">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={resetAllFilters}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Accordion 1: Size */}
      <div className="border-b border-sand-200 pb-5">
        <button
          onClick={() => toggleSection('size')}
          className="w-full flex items-center justify-between text-sm font-bold text-charcoal py-1 hover:text-olive transition-colors"
        >
          <span>Size</span>
          {openSections.size ? (
            <ChevronUp className="w-4 h-4 text-charcoal-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-charcoal-400" />
          )}
        </button>

        {openSections.size && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {SIZES.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(isSelected ? null : size)}
                  className={`py-2 px-1 text-xs font-semibold rounded-md border transition-all ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50 text-charcoal shadow-xs font-bold'
                      : 'border-sand-300 bg-white text-charcoal-700 hover:border-sand-400'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 2: Color */}
      <div className="border-b border-sand-200 pb-5">
        <button
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between text-sm font-bold text-charcoal py-1 hover:text-olive transition-colors"
        >
          <span>Color</span>
          {openSections.color ? (
            <ChevronUp className="w-4 h-4 text-charcoal-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-charcoal-400" />
          )}
        </button>

        {openSections.color && (
          <div className="mt-3">
            <div className="grid grid-cols-5 gap-2.5">
              {COLOR_SWATCHES.map((color) => {
                const isSelected = selectedColor === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(isSelected ? null : color.name)}
                    title={color.name}
                    className={`relative w-8 h-8 rounded-md transition-all flex items-center justify-center ${
                      color.border ? 'border border-sand-300' : ''
                    } ${
                      isSelected
                        ? 'ring-2 ring-amber-400 ring-offset-2 scale-105'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Accordion 3: Price */}
      <div className="border-b border-sand-200 pb-5">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-sm font-bold text-charcoal py-1 hover:text-olive transition-colors"
        >
          <span>Price</span>
          {openSections.price ? (
            <ChevronUp className="w-4 h-4 text-charcoal-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-charcoal-400" />
          )}
        </button>

        {openSections.price && (
          <div className="mt-3 space-y-3">
            <input
              type="range"
              min="200"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-sand-200 rounded-lg appearance-none"
            />
            <div className="flex items-center justify-between text-xs font-semibold text-charcoal-700">
              <span>₹200</span>
              <span className="bg-sand-100 px-2.5 py-0.5 rounded-md border border-sand-200 text-charcoal font-bold">
                Up to ₹{maxPrice}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 4: Rating */}
      <div className="border-b border-sand-200 pb-5">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between text-sm font-bold text-charcoal py-1 hover:text-olive transition-colors"
        >
          <span>Rating</span>
          {openSections.rating ? (
            <ChevronUp className="w-4 h-4 text-charcoal-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-charcoal-400" />
          )}
        </button>

        {openSections.rating && (
          <div className="mt-3 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const isChecked = selectedRating === stars;
              return (
                <label
                  key={stars}
                  onClick={() => setSelectedRating(isChecked ? null : stars)}
                  className="flex items-center gap-2.5 cursor-pointer text-xs group"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-sand-300 text-amber-500 focus:ring-amber-400 cursor-pointer accent-amber-500"
                  />
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-sand-300 fill-sand-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-charcoal-600 font-medium group-hover:text-charcoal">
                    {stars} Star
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 5: Fabric / Material */}
      <div className="pb-3">
        <button
          onClick={() => toggleSection('fabric')}
          className="w-full flex items-center justify-between text-sm font-bold text-charcoal py-1 hover:text-olive transition-colors"
        >
          <span>Fabric & Weave</span>
          {openSections.fabric ? (
            <ChevronUp className="w-4 h-4 text-charcoal-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-charcoal-400" />
          )}
        </button>

        {openSections.fabric && (
          <div className="mt-3 space-y-2">
            {FABRICS.map((fabric) => {
              const isChecked = selectedFabric === fabric;
              return (
                <label
                  key={fabric}
                  onClick={() => setSelectedFabric(isChecked ? null : fabric)}
                  className="flex items-center gap-2.5 cursor-pointer text-xs group"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-sand-300 text-olive focus:ring-olive cursor-pointer accent-olive"
                  />
                  <span className="text-charcoal-600 font-medium group-hover:text-charcoal">
                    {fabric}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-charcoal/50 backdrop-blur-xs"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-sand-200">
                  <span className="font-bold text-base text-charcoal">Filter Garments</span>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1.5 rounded-lg text-charcoal-500 hover:bg-sand-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {filterSidebarContent}
              </div>
              <div className="pt-6 mt-6 border-t border-sand-200">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-olive text-white py-2.5 rounded-xl font-bold text-xs"
                >
                  Show {filtered.length} Results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Two-Column Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Desktop Left Sidebar: Filters */}
          <aside className="hidden md:block w-64 lg:w-72 shrink-0 bg-white p-6 rounded-2xl border border-sand-300 shadow-xs sticky top-24">
            {filterSidebarContent}
          </aside>

          {/* Right Main Content */}
          <main className="flex-1 w-full">
            
            {/* Top Bar above Product Grid */}
            <div className="bg-white rounded-2xl p-4 mb-6 border border-sand-300 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Mobile filter toggle + Results count */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="md:hidden inline-flex items-center gap-2 bg-sand-100 hover:bg-sand-200 text-charcoal px-3 py-2 rounded-xl text-xs font-semibold border border-sand-300"
                >
                  <Filter className="w-4 h-4 text-olive" />
                  <span>Filters {hasActiveFilters && '• Active'}</span>
                </button>

                <div className="text-xs text-charcoal-500 font-medium">
                  Showing <span className="font-bold text-charcoal">{filtered.length}</span> products
                </div>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-sand-50/80 text-charcoal placeholder-charcoal-400 text-xs pl-9 pr-3 py-2 rounded-xl border border-sand-200 focus:outline-none focus:border-olive focus:bg-white"
                />
              </div>

              <label className="w-full sm:w-52 text-xs font-semibold">
                <span className="sr-only">Filter by category</span>
                <select
                  value={selectedCategory}
                  onChange={(event) => {
                    const nextCategory = event.target.value;
                    setSelectedCategory(nextCategory);
                    setSearchParams((params) => {
                      if (nextCategory) params.set('category', nextCategory);
                      else params.delete('category');
                      return params;
                    });
                  }}
                  className="w-full bg-sand-50/80 text-charcoal text-xs font-semibold px-2.5 py-2 rounded-xl border border-sand-200"
                >
                  <option value="">All categories</option>
                  {categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
                </select>
              </label>

              {/* Sort & Clear Filters */}
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-olive" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-sand-50/80 text-charcoal text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-sand-200 focus:outline-none focus:border-olive cursor-pointer"
                  >
                    <option value="featured">Sort: Featured</option>
                    <option value="newest">Sort: Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

            </div>

            {/* 3-Column Product Grid */}
            {loadError && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{loadError}</p>}
            {loading ? (
              <p role="status" className="rounded-2xl border border-sand-300 bg-white p-12 text-center text-sm text-charcoal-600">Loading catalogue…</p>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-sand-300 max-w-md mx-auto my-12 shadow-sm">
                <Filter className="w-10 h-10 text-sand-400 mx-auto mb-3" />
                <h3 className="text-charcoal font-bold text-lg">No Garments Match</h3>
                <p className="text-charcoal-500 text-xs mt-1">
                  {productsList.length ? 'Try adjusting or clearing your size, color, or price filters.' : 'No published products are available yet.'}
                </p>
                <button
                  onClick={resetAllFilters}
                  className="mt-4 inline-flex items-center gap-2 bg-olive hover:bg-olive-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-olive/20 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
}
