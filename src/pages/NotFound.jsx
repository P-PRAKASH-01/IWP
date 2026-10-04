import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 flex items-center justify-center text-center px-4">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 max-w-lg w-full space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 font-black text-2xl flex items-center justify-center mx-auto">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Page Not Found
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm">
          The page you are looking for might have been moved or does not exist in Sri Sai Garments catalogue.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs px-5 py-3 rounded-xl border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
