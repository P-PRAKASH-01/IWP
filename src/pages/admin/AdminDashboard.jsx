import React, { useEffect, useState } from 'react';
import { ArrowRight, ClipboardList, FolderKanban, MessageSquare, Package, Plus, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { enquiryService } from '../../services/enquiryService';
import { productService } from '../../services/productService';
import { storeService } from '../../services/storeService';

function Metric({ label, value, icon: Icon, detail }) {
  return (
    <article className="bg-white p-5 rounded-2xl border border-sand-300 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-charcoal-600">{label}</span>
        <span className="p-2 rounded-xl bg-sand-100 text-olive"><Icon className="w-4 h-4" aria-hidden="true" /></span>
      </div>
      <div className="text-3xl font-bold text-charcoal">{value}</div>
      <p className="text-xs text-charcoal-500">{detail}</p>
    </article>
  );
}

export default function AdminDashboard() {
  const [productSummary, setProductSummary] = useState({ publishedCount: 0, unpublishedCount: 0, latest: [] });
  const [categoryCount, setCategoryCount] = useState(0);
  const [enquiries, setEnquiries] = useState([]);
  const [enquirySummary, setEnquirySummary] = useState({ total: 0, newCount: 0, processedCount: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      productService.getDashboardSummary(),
      storeService.getCategoryCount(),
      enquiryService.getDashboardSummary()
    ]).then(([products, categories, summary]) => {
      if (!active) return;
      setProductSummary(products);
      setCategoryCount(categories);
      setEnquiries(summary.latest);
      setEnquirySummary(summary);
    }).catch((loadError) => {
      if (active) setError(loadError.message || 'Dashboard information could not be loaded.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const newEnquiries = enquirySummary.newCount;
  const latestProducts = productSummary.latest;
  const latestEnquiries = enquiries.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Store overview</h1>
            <p className="text-sm text-charcoal-600 mt-1">Current catalogue and customer enquiry activity.</p>
          </div>
          <Link to="/admin/products/new" className="inline-flex items-center justify-center gap-2 bg-olive hover:bg-olive-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl">
            <Plus className="w-4 h-4" aria-hidden="true" /> Add product
          </Link>
        </div>

        {error && <p role="alert" className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-sm">{error}</p>}
        {loading ? (
          <p role="status" className="py-10 text-center text-sm text-charcoal-600">Loading store data…</p>
        ) : (
          <>
            <section aria-label="Store metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <Metric label="Published products" value={productSummary.publishedCount} icon={Package} detail={`${productSummary.unpublishedCount} draft or inactive`} />
              <Metric label="Categories" value={categoryCount} icon={FolderKanban} detail="Active catalogue categories" />
              <Metric label="New enquiries" value={newEnquiries} icon={MessageSquare} detail={`${enquirySummary.total} total enquiries`} />
              <Metric label="Processed enquiries" value={enquirySummary.processedCount} icon={ClipboardList} detail="Contacted, active, converted or closed" />
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-sand-300 p-5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="font-bold text-charcoal">Recently updated products</h2>
                  <Link to="/admin/products" className="inline-flex items-center gap-1 text-xs text-olive font-semibold">Manage <ArrowRight className="w-3.5 h-3.5" /></Link>
                </div>
                {latestProducts.length === 0 ? (
                  <div className="py-8 text-center text-sm text-charcoal-600">No products yet. Add a product to begin building the catalogue.</div>
                ) : (
                  <ul className="divide-y divide-sand-200">
                    {latestProducts.map((product) => (
                      <li key={product.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{product.name}</p>
                          <p className="text-xs text-charcoal-500">{product.productCode || product.id} · {product.status || 'Local preview'}</p>
                        </div>
                        <Link to={`/admin/products/${product.id}/edit`} className="text-xs text-olive font-semibold hover:underline">Edit</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="bg-white rounded-2xl border border-sand-300 p-5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="font-bold text-charcoal">Latest enquiries</h2>
                  <Link to="/admin/enquiries" className="inline-flex items-center gap-1 text-xs text-olive font-semibold">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
                </div>
                {latestEnquiries.length === 0 ? (
                  <div className="py-8 text-center text-sm text-charcoal-600">No customer enquiries have been received.</div>
                ) : (
                  <ul className="divide-y divide-sand-200">
                    {latestEnquiries.map((enquiry) => (
                      <li key={enquiry.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{enquiry.name}</p>
                          <p className="text-xs text-charcoal-500 truncate">{enquiry.productName} · {new Date(enquiry.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs rounded-full bg-sand-100 px-2.5 py-1">{enquiry.status}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-sand-300 p-5">
              <h2 className="font-bold text-charcoal mb-4">Quick actions</h2>
              <div className="flex flex-wrap gap-3">
                {[
                  ['/admin/products', 'Manage products', Package],
                  ['/admin/categories', 'Manage categories', FolderKanban],
                  ['/admin/enquiries', 'View enquiries', MessageSquare],
                  ['/admin/settings', 'Edit store information', Settings2]
                ].map(([to, label, Icon]) => (
                  <Link key={to} to={to} className="inline-flex items-center gap-2 border border-sand-300 hover:border-olive rounded-xl px-4 py-3 text-sm font-semibold">
                    <Icon className="w-4 h-4 text-olive" aria-hidden="true" /> {label}
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
