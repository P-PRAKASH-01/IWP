import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import SearchModal from './components/common/SearchModal';
import WishlistDrawer from './components/common/WishlistDrawer';
import ToastContainer from './components/common/ToastContainer';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminContent from './pages/admin/AdminContent';
import AdminSettings from './pages/admin/AdminSettings';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainLayout({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { error: storeSettingsError, isSupabaseConfigured } = useStore();

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-ivory text-charcoal selection:bg-olive selection:text-white">
      <Navbar onSearchOpen={() => setIsSearchOpen(true)} />
      {!isSupabaseConfigured && <p role="status" className="mt-24 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900">Development preview: sample catalogue and browser-local enquiry storage are not production data. Configure Supabase before launch.</p>}
      {storeSettingsError && <p role="alert" className="mt-24 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900">{storeSettingsError}</p>}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <WishlistDrawer />
      <ToastContainer />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <WishlistProvider>
          <Router>
            <ScrollToTop />
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/products/new" element={<AdminProductForm />} />
                <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/enquiries" element={<AdminEnquiries />} />
                <Route path="/admin/content" element={<AdminContent />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </Router>
        </WishlistProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
