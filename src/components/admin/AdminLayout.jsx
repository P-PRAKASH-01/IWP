import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, LogOut, Menu, MessageSquare, Package, Settings, Store, Tags, X, PanelsTopLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Categories', path: '/admin/categories', icon: Tags },
  { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
  { label: 'Homepage content', path: '/admin/content', icon: PanelsTopLeft },
  { label: 'Store settings', path: '/admin/settings', icon: Settings }
];

export default function AdminLayout({ children }) {
  const { isAdminLoggedIn, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  if (isLoading) {
    return <main className="min-h-screen bg-ivory grid place-items-center text-sm text-charcoal-600">Checking administrator access…</main>;
  }
  if (!isAdminLoggedIn) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;

  const handleLogout = async () => {
    setLogoutError('');
    try {
      await logout();
      navigate('/admin/login', { replace: true });
    } catch (error) {
      setLogoutError(error.message || 'Unable to sign out. Please try again.');
    }
  };

  const navigation = (
    <>
      <p className="px-3 py-2 text-[10px] uppercase tracking-wider text-charcoal-500 font-bold">Store management</p>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.path
          || (item.path === '/admin/products' && location.pathname.startsWith('/admin/products/'));
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMenuOpen(false)}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive ${
              active ? 'bg-olive text-white' : 'text-charcoal-700 hover:bg-sand-100'
            }`}
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-ivory flex flex-col text-charcoal">
      <header className="bg-white border-b border-sand-300 sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close admin navigation' : 'Open admin navigation'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="w-9 h-9 rounded-lg bg-olive flex items-center justify-center text-white font-extrabold text-xs">SSG</div>
          <div>
            <span className="text-charcoal font-bold text-sm block leading-none">SRI SAI GARMENTS <span className="text-olive">ADMIN</span></span>
            <span className="text-[10px] text-charcoal-500">Store control panel</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-1.5 text-xs text-charcoal-700 hover:text-olive px-3 py-2 rounded-lg border border-sand-200">
            <Store className="w-3.5 h-3.5" aria-hidden="true" /> View shop
          </Link>
          <button type="button" onClick={handleLogout} className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-700 hover:text-rose-700 px-3 py-2 rounded-lg border border-sand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive">
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" /> Sign out
          </button>
        </div>
      </header>

      {logoutError && <p role="alert" className="px-4 py-2 bg-rose-50 text-rose-800 text-sm">{logoutError}</p>}
      <div className="flex-1 flex flex-col md:flex-row">
        <aside className="hidden md:block w-60 bg-white/80 border-r border-sand-300 p-4 space-y-1 shrink-0" aria-label="Admin navigation">
          {navigation}
        </aside>
        {menuOpen && (
          <nav className="md:hidden bg-white border-b border-sand-300 p-4 space-y-1" aria-label="Admin navigation">
            {navigation}
          </nav>
        )}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}
