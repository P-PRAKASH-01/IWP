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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="flex items-center px-4 sm:px-6 py-4 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search t-shirts, shirts, activewear, bulk orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md bg-slate-800"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-4">
          {searchTerm.trim() === '' ? (
            <div className="text-center py-8">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Popular Searches</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Cotton Tee', 'Polo Shirt', 'Streetwear Hoodie', 'Bulk Custom', 'Dry-Fit', 'Women Lounge'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="text-xs bg-slate-800/80 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 px-3 py-1.5 rounded-full border border-slate-700/60 transition-colors flex items-center gap-1.5"
                  >
                    <Tag className="w-3 h-3 text-indigo-400" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold px-2">
                Found {filteredProducts.length} items
              </p>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/50 hover:border-indigo-500/30 transition-all cursor-pointer group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-700/50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                        {product.category}
                      </span>
                      {product.isNew && (
                        <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                          New
                        </span>
                      )}
                    </div>
                    <h4 className="text-white text-sm font-semibold truncate group-hover:text-indigo-300 transition-colors mt-0.5">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {product.material}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-white">₹{product.price}</div>
                    <div className="text-[10px] text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View details <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm text-slate-300 font-semibold">No garments match "{searchTerm}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for cotton t-shirts, polo, hoodies or bulk orders.</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Press ESC to exit</span>
          <span className="text-indigo-400">Sri Sai Garments Catalogue</span>
        </div>
      </div>
    </div>
  );
}
