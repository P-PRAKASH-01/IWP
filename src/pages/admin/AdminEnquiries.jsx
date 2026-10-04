import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle2, Trash2, Filter, Phone, Mail } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { enquiryService } from '../../services/enquiryService';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = () => {
    setEnquiries(enquiryService.getAllEnquiries());
  };

  const handleUpdateStatus = (id, status) => {
    enquiryService.updateEnquiryStatus(id, status);
    loadEnquiries();
  };

  const handleDelete = (id) => {
    if (window.confirm(`Delete enquiry ticket ${id}?`)) {
      enquiryService.deleteEnquiry(id);
      loadEnquiries();
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    if (statusFilter === 'all') return true;
    return e.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Customer Enquiry Tickets
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Manage incoming retail & wholesale order inquiries submitted by website visitors.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['all', 'pending', 'contacted', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets Grid */}
        {filteredEnquiries.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-slate-500 text-xs border border-slate-800">
            No enquiry tickets match the selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEnquiries.map((ticket) => (
              <div
                key={ticket.id}
                className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between gap-4 relative"
              >
                <div className="space-y-3">
                  {/* Top row */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-mono font-bold text-indigo-400 text-xs">{ticket.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ticket.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      ticket.status === 'Contacted' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>

                  {/* Customer details */}
                  <div>
                    <h3 className="text-white font-bold text-base">{ticket.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-indigo-400" /> {ticket.phone}</span>
                      {ticket.email !== 'N/A' && (
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-indigo-400" /> {ticket.email}</span>
                      )}
                    </div>
                  </div>

                  {/* Garment / Requirement info */}
                  <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800/60 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Requirement / Item:</div>
                    <div className="text-xs font-semibold text-indigo-300">{ticket.productName}</div>
                    <div className="text-xs text-slate-300 font-bold">Quantity: {ticket.quantity} Pcs</div>
                  </div>

                  {ticket.message && (
                    <div className="text-xs text-slate-400 italic bg-slate-950 p-3 rounded-xl border border-slate-900">
                      "{ticket.message}"
                    </div>
                  )}
                </div>

                {/* Footer status buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-500">
                    Received: {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {ticket.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(ticket.id, 'Contacted')}
                        className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1.5 rounded-xl shadow"
                      >
                        Mark Contacted
                      </button>
                    )}
                    {ticket.status === 'Contacted' && (
                      <button
                        onClick={() => handleUpdateStatus(ticket.id, 'Completed')}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-xl shadow"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(ticket.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                      title="Delete Ticket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
