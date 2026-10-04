import React from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, Trash2, MessageSquare, ArrowRight, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export default function WishlistDrawer() {
  const { wishlist, toggleWishlist, clearWishlist, isWishlistOpen, setIsWishlistOpen } = useWishlist();

  if (!isWishlistOpen) return null;

  // Build batch whatsapp url for all saved items
  const handleBatchEnquire = () => {
    let msg = `Hello Sri Sai Garments! I would like to enquire about my saved garments:\n\n`;
    wishlist.forEach((item, i) => {
      msg += `${i + 1}. *${item.name}* (Code: ${item.id}) - ₹${item.price}\n`;
    });
    msg += `\nPlease inform me about total pricing, availability, and delivery time. Thank you!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/919876543210?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>Saved Garments ({wishlist.length})</span>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlist.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="text-white font-bold text-base">Your wishlist is empty</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click the heart icon on any garment card to save items you are interested in.
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg"
              >
                <span>Browse Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 relative group"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-800 shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-indigo-400">
                    {item.category}
                  </span>
                  <Link
                    to={`/products/${item.id}`}
                    onClick={() => setIsWishlistOpen(false)}
                    className="block text-white font-semibold text-xs truncate hover:text-indigo-300 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <div className="text-xs font-bold text-white mt-1">₹{item.price}</div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={buildWhatsAppUrl({ product: item })}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30"
                    title="Enquire on WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => toggleWishlist(item)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800"
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
          <div className="p-5 border-t border-slate-800 space-y-3 bg-slate-950/80">
            <button
              onClick={handleBatchEnquire}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3.5 rounded-xl shadow-xl"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enquire All {wishlist.length} Items on WhatsApp</span>
            </button>

            <button
              onClick={clearWishlist}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-300 py-1"
            >
              Clear All Saved Garments
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
