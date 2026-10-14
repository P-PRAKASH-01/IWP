import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { storeService } from '../../services/storeService';

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    storeService.getCategories()
      .then((rows) => { if (active) setCategories(rows.filter((category) => category.isActive)); })
      .catch((loadError) => { if (active) setError(loadError.message || 'Categories could not be loaded.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <section className="py-20 bg-ivory relative border-t border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-olive text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" /> Collections & Categories
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
              Explore Garments by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-olive hover:text-olive-600 font-semibold text-sm group"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {error && <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {loading ? <p role="status" className="py-8 text-center text-sm text-charcoal-600">Loading categories…</p> : categories.length === 0 && !error ? <p className="rounded-2xl border border-sand-300 bg-white p-8 text-center text-sm text-charcoal-600">No public categories are available yet.</p> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className={`group relative rounded-3xl overflow-hidden bg-white border border-sand-300 hover:border-olive/50 shadow-xs hover:shadow-xl transition-all duration-300 ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Category Image */}
              <div className="aspect-[16/10] overflow-hidden bg-sand-100 relative">
                {cat.image && <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                
                {/* Badge */}
                {cat.badge && (
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-olive border border-sand-300 text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-md">
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Text content */}
              <div className="p-6 relative z-10 -mt-12 bg-white rounded-t-3xl pt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-charcoal group-hover:text-olive transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-semibold bg-sand-100 text-charcoal-700 px-2.5 py-1 rounded-full border border-sand-200">
                    {cat.productCount} items
                  </span>
                </div>
                <p className="text-xs text-charcoal-500 mt-2 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-olive group-hover:text-olive-600">
                  <span>Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>}

      </div>
    </section>
  );
}
