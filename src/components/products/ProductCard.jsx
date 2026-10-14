import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';

export default function ProductCard({ product }) {
  const [selectedSize] = useState(product.sizes?.[0] || 'L');
  const [selectedColor] = useState(product.colors?.[0]?.name || '');
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { settings } = useStore();

  const isSaved = isInWishlist(product.id);

  const whatsappUrl = buildWhatsAppUrl({
    product,
    selectedSize,
    selectedColor,
    phoneNumber: settings.whatsapp,
    businessName: settings.businessName
  });

  return (
    <div className="bg-white rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col h-full border border-sand-300 hover:border-sand-400 shadow-xs hover:shadow-md">
      
      {/* Product Image Frame */}
      <div className="relative aspect-square sm:aspect-[4/5] bg-sand-50/70 overflow-hidden flex items-center justify-center p-4">
        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full border transition-all shadow-xs ${
            isSaved
              ? 'bg-olive text-white border-olive scale-105'
              : 'bg-white/90 text-charcoal-600 border-sand-300 hover:text-olive hover:border-olive'
          }`}
          title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
        </button>

        {/* Product Image */}
        <Link to={`/products/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.images?.[0] || ''}
            alt={product.imageAlt || product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white border-t border-sand-200">
        <div>
          {/* Title & Price on inline row */}
          <div className="flex items-baseline justify-between gap-3">
            <Link to={`/products/${product.id}`}>
              <h3 className="text-charcoal font-bold text-sm sm:text-base line-clamp-1 hover:text-olive transition-colors">
                {product.name}
              </h3>
            </Link>
            <span className="text-charcoal font-bold text-sm sm:text-base shrink-0">
              {product.price == null ? 'Ask for price' : `₹${product.price}`}
            </span>
          </div>

          {/* Subtitle / Description */}
          <p className="text-charcoal-500 text-xs line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Full-width Add to Cart / Enquire Button */}
        <a
          href={whatsappUrl || '/contact'}
          target="_blank"
          rel="noreferrer"
          className="mt-4 w-full py-2.5 px-4 rounded-xl bg-sand-200/70 hover:bg-olive text-charcoal-800 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 border border-sand-300 hover:border-olive transition-all duration-200 shadow-xs"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Cart</span>
        </a>
      </div>

    </div>
  );
}
