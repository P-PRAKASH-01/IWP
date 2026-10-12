import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MessageSquare, Plus, CheckCircle2, Clock, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { productService } from '../../services/productService';
import { enquiryService } from '../../services/enquiryService';

export default function AdminDashboard() {
  const [productsCount, setProductsCount] = useState(0);
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const prods = productService.getAllProducts();
    const enqs = enquiryService.getAllEnquiries();
    setProductsCount(prods.length);
    setEnquiries(enqs);
  };

  const pendingCount = enquiries.filter((e) => e.status === 'Pending').length;
  const contactedCount = enquiries.filter((e) => e.status === 'Contacted').length;

  const handleUpdateStatus = (id, newStatus) => {
    enquiryService.updateEnquiryStatus(id, newStatus);
    loadData();
  };

  const handleResetCatalog = () => {
    if (window.confirm('Reset catalog to default product list?')) {
      productService.resetToDefaults();
      loadData();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-charcoal">
              Admin Dashboard
            </h1>
            <p className="text-charcoal-500 text-xs mt-1">
              Store management overview for Sri Sai Garments, Tiruppur.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 bg-olive hover:bg-olive-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-olive/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Garment</span>
            </Link>

            <button
              onClick={handleResetCatalog}
              className="p-2.5 rounded-xl bg-white hover:bg-sand-50 text-charcoal-600 hover:text-charcoal border border-sand-300 transition-colors shadow-2xs"
              title="Reset Demo Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-sand-300 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-charcoal-500 font-semibold uppercase">Total Garments</span>
              <div className="p-2 rounded-xl bg-sand-100 text-olive">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-charcoal">{productsCount}</div>
            <p className="text-[11px] text-charcoal-400">Active in live catalog</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-sand-300 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-charcoal-500 font-semibold uppercase">Pending Enquiries</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
            <p className="text-[11px] text-charcoal-400">Awaiting shop manager response</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-sand-300 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-charcoal-500 font-semibold uppercase">In Contact</span>
              <div className="p-2 rounded-xl bg-sand-100 text-olive">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-olive">{contactedCount}</div>
            <p className="text-[11px] text-charcoal-400">Quotes sent to customer</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-sand-300 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-charcoal-500 font-semibold uppercase">Store Status</span>
              <div className="p-2 rounded-xl bg-sand-100 text-olive">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-lg font-bold text-olive">Live & Syncing</div>
            <p className="text-[11px] text-charcoal-400">Local Storage persistence active</p>
          </div>
        </div>

        {/* Recent Enquiries Table */}
        <div className="bg-white rounded-3xl border border-sand-300 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-charcoal">Recent Customer Enquiries</h3>
            <Link
              to="/admin/enquiries"
              className="text-xs text-olive hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All Enquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {enquiries.length === 0 ? (
            <div className="text-center py-8 text-xs text-charcoal-400">No enquiries found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sand-50 text-charcoal-600 uppercase text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-xl">Ticket ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Requirement / Item</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-r-xl text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200">
                  {enquiries.slice(0, 5).map((enq) => (
                    <tr key={enq.id} className="hover:bg-sand-50/60">
                      <td className="p-3 font-mono font-bold text-olive">{enq.id}</td>
                      <td className="p-3">
                        <div className="font-semibold text-charcoal">{enq.name}</div>
                        <div className="text-[10px] text-charcoal-400">{enq.phone}</div>
                      </td>
                      <td className="p-3 text-charcoal-600 max-w-xs truncate">{enq.productName}</td>
                      <td className="p-3 font-bold text-charcoal">{enq.quantity} pcs</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          enq.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          enq.status === 'Contacted' ? 'bg-sand-100 text-olive border border-sand-300' :
                          'bg-olive/15 text-olive border border-olive/30'
                        }`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {enq.status === 'Pending' && (
                          <button
                            onClick={() => handleUpdateStatus(enq.id, 'Contacted')}
                            className="text-[11px] bg-sand-100 hover:bg-olive hover:text-white text-olive border border-sand-300 px-3 py-1 rounded-lg transition-colors"
                          >
                            Mark Contacted
                          </button>
                        )}
                        {enq.status === 'Contacted' && (
                          <button
                            onClick={() => handleUpdateStatus(enq.id, 'Completed')}
                            className="text-[11px] bg-sand-100 hover:bg-olive hover:text-white text-olive border border-sand-300 px-3 py-1 rounded-lg transition-colors"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
