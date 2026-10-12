import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { CheckCircle2, Info, Heart } from 'lucide-react';

export default function ToastContainer() {
  const { toast } = useWishlist();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white px-4 py-3 rounded-2xl shadow-xl border border-sand-300 flex items-center gap-3 text-xs text-charcoal">
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-olive shrink-0" />
        ) : (
          <Heart className="w-4 h-4 text-olive fill-olive shrink-0" />
        )}
        <span className="font-semibold">{toast.message}</span>
      </div>
    </div>
  );
}
