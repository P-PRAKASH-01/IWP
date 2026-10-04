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
            <h1 className="text-2xl font-extrabold text-white">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Store management overview for Sri Sai Garments, Tiruppur.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Garment</span>
            </Link>

            <button
              onClick={handleResetCatalog}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
              title="Reset Demo Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Garments</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{productsCount}</div>
            <p className="text-[11px] text-slate-500">Active in live catalog</p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase">Pending Enquiries</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-400">{pendingCount}</div>
            <p className="text-[11px] text-slate-500">Awaiting shop manager response</p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase">In Contact</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-indigo-400">{contactedCount}</div>
            <p className="text-[11px] text-slate-500">Quotes sent to customer</p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase">Store Status</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-lg font-bold text-emerald-400">Live & Syncing</div>
            <p className="text-[11px] text-slate-500">Local Storage persistence active</p>
          </div>
        </div>

        {/* Recent Enquiries Table */}
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Recent Customer Enquiries</h3>
            <Link
              to="/admin/enquiries"
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All Enquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {enquiries.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">No enquiries found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-xl">Ticket ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Requirement / Item</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-r-xl text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {enquiries.slice(0, 5).map((enq) => (
                    <tr key={enq.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-indigo-400">{enq.id}</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{enq.name}</div>
                        <div className="text-[10px] text-slate-500">{enq.phone}</div>
                      </td>
                      <td className="p-3 text-slate-300 max-w-xs truncate">{enq.productName}</td>
                      <td className="p-3 font-bold text-white">{enq.quantity} pcs</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          enq.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          enq.status === 'Contacted' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {enq.status === 'Pending' && (
                          <button
                            onClick={() => handleUpdateStatus(enq.id, 'Contacted')}
                            className="text-[11px] bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-lg"
                          >
                            Mark Contacted
                          </button>
                        )}
                        {enq.status === 'Contacted' && (
                          <button
                            onClick={() => handleUpdateStatus(enq.id, 'Completed')}
                            className="text-[11px] bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-lg"
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
