import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { CheckCircle2, Info, Heart } from 'lucide-react';

export default function ToastContainer() {
  const { toast } = useWishlist();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="glass-panel px-4 py-3 rounded-2xl shadow-2xl border border-indigo-500/30 flex items-center gap-3 text-xs text-white">
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
        )}
        <span className="font-semibold">{toast.message}</span>
      </div>
    </div>
  );
}
