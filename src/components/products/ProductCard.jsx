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
    <div className="bg-white rounded-3xl overflow-hidden group transition-all duration-300 flex flex-col h-full relative border border-sand-300 hover:border-olive/50 shadow-xs hover:shadow-xl hover:-translate-y-1">
      
      {/* Badges & Wishlist Heart */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          {product.isNew && (
            <span className="bg-olive text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm tracking-wider">
              New Arrival
            </span>
          )}
          {product.featured && (
            <span className="bg-charcoal text-ivory text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm tracking-wider">
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
          className={`p-2 rounded-full backdrop-blur-md border transition-all pointer-events-auto shadow-xs ${
            isSaved
              ? 'bg-olive text-white border-olive scale-105'
              : 'bg-white/90 text-charcoal-600 border-sand-300 hover:text-olive hover:border-olive'
          }`}
          title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-sand-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Hover Action overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <Link
            to={`/products/${product.id}`}
            className="w-full py-2.5 px-4 rounded-xl bg-white/95 hover:bg-white text-charcoal text-xs font-semibold flex items-center justify-center gap-2 border border-sand-300 shadow-xl transition-all"
          >
            <Eye className="w-4 h-4 text-olive" />
            <span>View Specs & Options</span>
          </Link>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4 bg-white">
        
        <div className="space-y-2">
          {/* Rating & Category tag */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-olive uppercase font-bold text-[11px] tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 bg-sand-50 px-2 py-0.5 rounded-full border border-sand-200">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-charcoal font-bold text-[11px]">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/products/${product.id}`}>
            <h3 className="text-charcoal font-bold text-base line-clamp-1 group-hover:text-olive transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Material */}
          <p className="text-charcoal-500 text-xs line-clamp-1">
            {product.material}
          </p>

          {/* Color swatch selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-charcoal-400 uppercase font-semibold">Colors:</span>
              <div className="flex items-center gap-1">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      selectedColor === color.name ? 'ring-2 ring-olive scale-110 border-white' : 'border-sand-300 hover:scale-110'
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
                      ? 'bg-olive text-white border-olive'
                      : 'bg-sand-50 text-charcoal-600 border-sand-200 hover:text-charcoal hover:border-sand-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & WhatsApp Button */}
        <div className="pt-3 border-t border-sand-200 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-charcoal">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-charcoal-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <span className="text-[10px] text-olive flex items-center gap-0.5 font-semibold">
              <CheckCircle2 className="w-2.5 h-2.5" /> In Stock
            </span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-olive hover:bg-olive-600 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md shadow-olive/20 hover:shadow-olive/30 transition-all"
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
