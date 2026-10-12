import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory pt-32 pb-20 flex items-center justify-center text-center px-4">
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-sand-300 max-w-lg w-full space-y-6 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-sand-100 text-olive font-black text-2xl flex items-center justify-center mx-auto">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
          Page Not Found
        </h1>

        <p className="text-charcoal-600 text-xs sm:text-sm">
          The page you are looking for might have been moved or does not exist in Sri Sai Garments catalogue.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-olive hover:bg-olive-600 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-md shadow-olive/20 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-sand-50 text-charcoal font-semibold text-xs px-5 py-3 rounded-xl border border-sand-300 shadow-2xs transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-olive" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
