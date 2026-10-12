import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { products } from '../../data/products';

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = searchTerm.trim() === '' ? [] : products.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.material.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  });

  const handleSelectProduct = (product) => {
    onClose();
    setSearchTerm('');
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-charcoal/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white border border-sand-300 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="flex items-center px-4 sm:px-6 py-4 border-b border-sand-200 gap-3">
          <Search className="w-5 h-5 text-olive shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search t-shirts, shirts, activewear, bulk orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-charcoal placeholder-charcoal-400 text-sm sm:text-base focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-charcoal-600 hover:text-charcoal px-2 py-1 rounded-md bg-sand-100 font-medium"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-charcoal-400 hover:text-charcoal hover:bg-sand-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-4">
          {searchTerm.trim() === '' ? (
            <div className="text-center py-8">
              <p className="text-xs text-charcoal-400 uppercase tracking-wider font-semibold mb-3">Popular Searches</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Cotton Tee', 'Polo Shirt', 'Streetwear Hoodie', 'Bulk Custom', 'Dry-Fit', 'Women Lounge'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="text-xs bg-sand-100 hover:bg-sand-200 text-charcoal-700 hover:text-olive px-3 py-1.5 rounded-full border border-sand-300 transition-colors flex items-center gap-1.5 font-medium"
                  >
                    <Tag className="w-3 h-3 text-olive" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold px-2">
                Found {filteredProducts.length} items
              </p>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-white hover:bg-sand-50 border border-sand-200 hover:border-olive/50 transition-all cursor-pointer group shadow-2xs"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-xl border border-sand-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-semibold text-olive bg-sand-100 px-2 py-0.5 rounded-md">
                        {product.category}
                      </span>
                      {product.isNew && (
                        <span className="text-[10px] uppercase font-bold text-white bg-olive px-1.5 py-0.5 rounded-md">
                          New
                        </span>
                      )}
                    </div>
                    <h4 className="text-charcoal text-sm font-semibold truncate group-hover:text-olive transition-colors mt-0.5">
                      {product.name}
                    </h4>
                    <p className="text-xs text-charcoal-500 truncate mt-0.5">
                      {product.material}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-charcoal">₹{product.price}</div>
                    <div className="text-[10px] text-olive font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View details <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm text-charcoal-700 font-semibold">No garments match "{searchTerm}"</p>
              <p className="text-xs text-charcoal-400 mt-1">Try searching for cotton t-shirts, polo, hoodies or bulk orders.</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-sand-50 border-t border-sand-200 text-xs text-charcoal-500 flex items-center justify-between">
          <span>Press ESC to exit</span>
          <span className="text-olive font-semibold">Sri Sai Garments Catalogue</span>
        </div>
      </div>
    </div>
  );
}
