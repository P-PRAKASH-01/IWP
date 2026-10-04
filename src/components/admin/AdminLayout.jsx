import React from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, MessageSquare, LogOut, Store, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children }) {
  const { isAdminLoggedIn, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Garment CRUD Manager', path: '/admin/products', icon: Package },
    { label: 'Enquiry Tickets', path: '/admin/enquiries', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      
      {/* Top Admin Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center text-indigo-400 font-extrabold text-xs">
              SSG
            </div>
          </div>
          <div>
            <span className="text-white font-bold text-sm block leading-none">
              SRI SAI GARMENTS <span className="text-indigo-400 font-extrabold text-xs">ADMIN</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Control Panel</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-indigo-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span>View Live Shop</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/30 transition-colors font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Sidebar + Content Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-slate-900/40 border-r border-slate-800/80 p-4 space-y-2 shrink-0">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Admin Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Dynamic Admin View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-950 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
