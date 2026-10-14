import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { productService } from '../../services/productService';
import { storeService } from '../../services/storeService';

const PAGE_SIZE = 10;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAppliedSearch(search);
      setPage(0);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;
    storeService.getCategories().then((rows) => {
      if (active) setCategories(rows);
    }).catch((loadError) => {
      if (active) setError(loadError.message || 'Categories could not be loaded.');
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    productService.getProductPage({
      search: appliedSearch,
      status,
      category,
      sort,
      page,
      pageSize: PAGE_SIZE
    }).then(({ products: productRows, totalCount: count }) => {
      if (active) {
        setProducts(productRows);
        setTotalCount(count);
      }
    }).catch((loadError) => {
      if (active) setError(loadError.message || 'Products could not be loaded.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [appliedSearch, status, category, sort, page, refreshKey]);

  useEffect(() => {
    if (location.state?.notice) {
      setNotice(location.state.notice);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const visibleProducts = products;

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    setBusyId(product.id);
    setError('');
    setNotice('');
    try {
      await productService.deleteProduct(product.id);
      const storedImages = (product.images || []).filter((url) => url.includes('/storage/v1/object/public/product-media/'));
      if (storedImages.length) {
        try {
          await storeService.removeProductImages(storedImages);
        } catch (mediaError) {
          setNotice(`Product deleted, but an image could not be removed from storage: ${mediaError.message}`);
        }
      }
      const nextCount = Math.max(0, totalCount - 1);
      setTotalCount(nextCount);
      if (page > 0 && page * PAGE_SIZE >= nextCount) setPage(page - 1);
      setRefreshKey((key) => key + 1);
    } catch (deleteError) {
      setError(deleteError.message || 'Product could not be deleted.');
    } finally {
      setBusyId('');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Products</h1>
            <p className="mt-1 text-sm text-charcoal-600">Manage product details, visibility, pricing, and media.</p>
          </div>
          <Link to="/admin/products/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-olive px-4 py-2.5 text-sm font-semibold text-white hover:bg-olive-600">
            <Plus className="w-4 h-4" aria-hidden="true" /> Add product
          </Link>
        </header>

        {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{notice}</p>}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-sand-300" aria-label="Product search and filters">
          <label className="relative">
            <span className="sr-only">Search products</span>
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-500" aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, code or ID" className="w-full rounded-lg border border-sand-300 pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive" />
          </label>
          <label className="text-sm">
            <span className="sr-only">Filter by status</span>
            <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }} className="w-full rounded-lg border border-sand-300 px-3 py-2 bg-white">
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="sr-only">Filter by category</span>
            <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(0); }} className="w-full rounded-lg border border-sand-300 px-3 py-2 bg-white">
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="sr-only">Sort products</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="w-full rounded-lg border border-sand-300 px-3 py-2 bg-white">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </section>

        <div className="bg-white rounded-2xl border border-sand-300 overflow-hidden">
          {loading ? (
            <p role="status" className="py-12 text-center text-sm text-charcoal-600">Loading products…</p>
          ) : visibleProducts.length === 0 ? (
            <div className="py-12 px-5 text-center">
              <p className="font-semibold text-charcoal">{totalCount ? 'No products on this page.' : 'No products yet.'}</p>
              <p className="mt-1 text-sm text-charcoal-600">{totalCount ? 'Clear or adjust filters and search terms.' : 'Add a product to start your public catalogue.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-sand-50 text-xs uppercase text-charcoal-600">
                  <tr>
                    <th scope="col" className="p-3">Product</th>
                    <th scope="col" className="p-3">Code</th>
                    <th scope="col" className="p-3">Category</th>
                    <th scope="col" className="p-3">Retail price</th>
                    <th scope="col" className="p-3">Status</th>
                    <th scope="col" className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200">
                  {visibleProducts.map((product) => (
                    <tr key={product.id} className="align-middle">
                      <td className="p-3 min-w-56">
                        <div className="flex items-center gap-3">
                          {product.images?.[0] ? <img src={product.images[0]} alt={product.imageAlt || product.name} className="w-12 h-12 rounded-lg border border-sand-200 object-cover" /> : <div className="w-12 h-12 rounded-lg bg-sand-100" aria-hidden="true" />}
                          <div><p className="font-semibold">{product.name}</p><p className="text-xs text-charcoal-500">{product.availabilityStatus || (product.availability ? 'Available' : 'Unavailable')}</p></div>
                        </div>
                      </td>
                      <td className="p-3 text-charcoal-600">{product.productCode || '—'}</td>
                      <td className="p-3 text-charcoal-600">{categories.find((item) => item.id === product.categoryId)?.name || product.category || '—'}</td>
                      <td className="p-3">{product.price == null ? 'Quote' : `₹${product.price}`}</td>
                      <td className="p-3"><span className="inline-flex rounded-full bg-sand-100 px-2.5 py-1 text-xs capitalize">{product.status || 'draft'}</span></td>
                      <td className="p-3">
                        <div className="flex justify-end items-center gap-3">
                          <Link to={`/admin/products/${product.id}/edit`} className="text-xs font-semibold text-olive hover:underline">Edit</Link>
                          <button type="button" disabled={busyId === product.id} onClick={() => void handleDelete(product)} aria-label={`Delete ${product.name}`} className="p-2 text-charcoal-500 hover:text-rose-700 disabled:opacity-50">
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && totalCount > PAGE_SIZE && (
            <div className="flex items-center justify-between p-3 border-t border-sand-200 text-sm">
              <span className="text-charcoal-600">Page {currentPage + 1} of {totalPages} · {totalCount} products</span>
              <div className="flex gap-2">
                <button type="button" disabled={currentPage === 0} onClick={() => setPage((value) => value - 1)} className="p-2 border border-sand-300 rounded-lg disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="w-4 h-4" /></button>
                <button type="button" disabled={currentPage >= totalPages - 1} onClick={() => setPage((value) => value + 1)} className="p-2 border border-sand-300 rounded-lg disabled:opacity-40" aria-label="Next page"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
