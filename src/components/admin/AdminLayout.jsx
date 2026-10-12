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
    <div className="min-h-screen bg-ivory flex flex-col font-sans text-charcoal">
      
      {/* Top Admin Header */}
      <header className="bg-white border-b border-sand-300 sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-olive p-0.5 flex items-center justify-center">
            <span className="text-white font-extrabold text-xs">
              SSG
            </span>
          </div>
          <div>
            <span className="text-charcoal font-bold text-sm block leading-none">
              SRI SAI GARMENTS <span className="text-olive font-extrabold text-xs">ADMIN</span>
            </span>
            <span className="text-[10px] text-charcoal-400 font-mono">Control Panel</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-charcoal-700 hover:text-olive bg-sand-50 px-3 py-1.5 rounded-lg border border-sand-200 transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-olive" />
            <span>View Live Shop</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-charcoal-700 hover:text-rose-600 bg-sand-50 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-sand-200 transition-colors font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Sidebar + Content Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white/70 border-r border-sand-300 p-4 space-y-2 shrink-0">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-charcoal-400 font-bold">
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
                    ? 'bg-olive text-white shadow-md shadow-olive/20'
                    : 'text-charcoal-600 hover:bg-sand-100 hover:text-charcoal'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Dynamic Admin View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-ivory overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
