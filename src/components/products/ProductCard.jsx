import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare, Eye, Heart, CheckCircle2 } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isSaved = isInWishlist(product.id);

  const whatsappUrl = buildWhatsAppUrl({
    product,
    selectedSize,
    selectedColor
  });

  return (
    <div className="glass-card rounded-3xl overflow-hidden group transition-all duration-300 flex flex-col h-full relative border border-slate-800/80 hover:border-indigo-500/40">
      
      {/* Badges & Wishlist Heart */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          {product.isNew && (
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-lg tracking-wider">
              New Arrival
            </span>
          )}
          {product.featured && (
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-lg tracking-wider">
              Popular
            </span>
          )}
        </div>

        {/* Heart Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`p-2 rounded-full backdrop-blur-md border transition-all pointer-events-auto ${
            isSaved
              ? 'bg-rose-500 text-white border-rose-400 shadow-lg scale-105'
              : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-rose-400 hover:border-rose-400'
          }`}
          title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Hover Action overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <Link
            to={`/products/${product.id}`}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 shadow-xl transition-all"
          >
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>View Specs & Options</span>
          </Link>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        
        <div className="space-y-2">
          {/* Rating & Category tag */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-400 uppercase font-bold text-[11px] tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-slate-200 font-bold text-[11px]">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/products/${product.id}`}>
            <h3 className="text-slate-100 font-bold text-base line-clamp-1 group-hover:text-indigo-300 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Material */}
          <p className="text-slate-400 text-xs line-clamp-1">
            {product.material}
          </p>

          {/* Color swatch selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500 uppercase">Colors:</span>
              <div className="flex items-center gap-1">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      selectedColor === color.name ? 'ring-2 ring-indigo-400 scale-110 border-white' : 'border-slate-700 hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selection */}
          {product.sizes && (
            <div className="flex items-center gap-1 flex-wrap pt-1">
              {product.sizes.slice(0, 5).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                    selectedSize === size
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & WhatsApp Button */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-white">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-medium">
              <CheckCircle2 className="w-2.5 h-2.5" /> In Stock
            </span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 transition-all"
            title="Enquire on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Enquire</span>
          </a>
        </div>

      </div>
    </div>
  );
}
