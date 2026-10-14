import React from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, Trash2, MessageSquare, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { useStore } from '../../context/StoreContext';

export default function WishlistDrawer() {
  const { wishlist, toggleWishlist, clearWishlist, isWishlistOpen, setIsWishlistOpen } = useWishlist();
  const { settings } = useStore();

  if (!isWishlistOpen) return null;

  // Build batch whatsapp url for all saved items
  const handleBatchEnquire = () => {
    let msg = `I would like to enquire about my saved garments:\n\n`;
    wishlist.forEach((item, i) => {
      msg += `${i + 1}. *${item.name}* (Code: ${item.productCode || item.id})${item.price == null ? '' : ` - ₹${item.price}`}\n`;
    });
    msg += `\nPlease inform me about total pricing, availability, and delivery time. Thank you!`;

    const url = buildWhatsAppUrl({ message: msg, phoneNumber: settings.whatsapp, businessName: settings.businessName });
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-charcoal/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white border-l border-sand-300 h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-sand-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-charcoal font-bold text-base">
            <Heart className="w-5 h-5 text-olive fill-olive" />
            <span>Saved Garments ({wishlist.length})</span>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 rounded-xl text-charcoal-400 hover:text-charcoal hover:bg-sand-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlist.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center mx-auto text-charcoal-400">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="text-charcoal font-bold text-base">Your wishlist is empty</h4>
              <p className="text-xs text-charcoal-500 max-w-xs mx-auto">
                Click the heart icon on any garment card to save items you are interested in.
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="inline-flex items-center gap-2 bg-olive hover:bg-olive-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-olive/20 transition-all"
              >
                <span>Browse Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-2xl bg-sand-50/70 border border-sand-200 relative group"
              >
                <img
                  src={item.images?.[0] || ''}
                  alt={item.imageAlt || item.name}
                  className="w-16 h-16 object-cover rounded-xl border border-sand-200 shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-olive">
                    {item.category}
                  </span>
                  <Link
                    to={`/products/${item.id}`}
                    onClick={() => setIsWishlistOpen(false)}
                    className="block text-charcoal font-semibold text-xs truncate hover:text-olive transition-colors"
                  >
                    {item.name}
                  </Link>
                  <div className="text-xs font-bold text-charcoal mt-1">{item.price == null ? 'Ask for price' : `₹${item.price}`}</div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={buildWhatsAppUrl({ product: item, phoneNumber: settings.whatsapp, businessName: settings.businessName }) || '/contact'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-sand-100 hover:bg-olive text-olive hover:text-white border border-sand-300 transition-colors"
                    title="Enquire on WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => toggleWishlist(item)}
                    className="p-2 rounded-xl text-charcoal-400 hover:text-rose-500 hover:bg-sand-100 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Actions */}
        {wishlist.length > 0 && (
          <div className="p-5 border-t border-sand-200 space-y-3 bg-white">
            <button
              onClick={handleBatchEnquire}
              className="w-full flex items-center justify-center gap-2 bg-olive hover:bg-olive-600 text-white font-bold text-xs py-3.5 rounded-xl shadow-md shadow-olive/20 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enquire All {wishlist.length} Items on WhatsApp</span>
            </button>

            <button
              onClick={clearWishlist}
              className="w-full text-center text-xs text-charcoal-400 hover:text-charcoal-700 py-1 transition-colors"
            >
              Clear All Saved Garments
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
