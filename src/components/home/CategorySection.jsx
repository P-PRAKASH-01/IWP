import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { categories } from '../../data/categories';

export default function CategorySection() {
  return (
    <section className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" /> Collections & Categories
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Garments by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold text-sm group"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className={`group relative rounded-3xl overflow-hidden glass-card border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Category Image */}
              <div className="aspect-[16/10] overflow-hidden bg-slate-900 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Badge */}
                {cat.badge && (
                  <span className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-indigo-300 border border-indigo-500/20 text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-lg">
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Text content */}
              <div className="p-6 relative z-10 -mt-12">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                    {cat.itemCount} items
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                  <span>Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
