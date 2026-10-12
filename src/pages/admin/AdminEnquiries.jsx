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
            <h1 className="text-2xl font-extrabold text-charcoal">
              Customer Enquiry Tickets
            </h1>
            <p className="text-charcoal-500 text-xs mt-1">
              Manage incoming retail & wholesale order inquiries submitted by website visitors.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-sand-100 p-1 rounded-xl border border-sand-300">
            {['all', 'pending', 'contacted', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-olive text-white shadow-xs'
                    : 'text-charcoal-600 hover:text-charcoal'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets Grid */}
        {filteredEnquiries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-charcoal-400 text-xs border border-sand-300">
            No enquiry tickets match the selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEnquiries.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-3xl p-6 border border-sand-300 shadow-xs flex flex-col justify-between gap-4 relative"
              >
                <div className="space-y-3">
                  {/* Top row */}
                  <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                    <span className="font-mono font-bold text-olive text-xs">{ticket.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ticket.status === 'Pending' ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                      ticket.status === 'Contacted' ? 'bg-olive-50 text-olive-800 border border-olive-300' :
                      'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>

                  {/* Customer details */}
                  <div>
                    <h3 className="text-charcoal font-bold text-base">{ticket.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-charcoal-500 mt-1">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-olive" /> {ticket.phone}</span>
                      {ticket.email !== 'N/A' && (
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-olive" /> {ticket.email}</span>
                      )}
                    </div>
                  </div>

                  {/* Garment / Requirement info */}
                  <div className="bg-sand-50 p-3 rounded-2xl border border-sand-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-charcoal-400">Requirement / Item:</div>
                    <div className="text-xs font-semibold text-charcoal-800">{ticket.productName}</div>
                    <div className="text-xs text-olive font-bold">Quantity: {ticket.quantity} Pcs</div>
                  </div>

                  {ticket.message && (
                    <div className="text-xs text-charcoal-600 italic bg-ivory p-3 rounded-xl border border-sand-200">
                      "{ticket.message}"
                    </div>
                  )}
                </div>

                {/* Footer status buttons */}
                <div className="pt-3 border-t border-sand-200 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-charcoal-400">
                    Received: {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {ticket.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(ticket.id, 'Contacted')}
                        className="text-xs bg-olive hover:bg-olive-600 text-white font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
                      >
                        Mark Contacted
                      </button>
                    )}
                    {ticket.status === 'Contacted' && (
                      <button
                        onClick={() => handleUpdateStatus(ticket.id, 'Completed')}
                        className="text-xs bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(ticket.id)}
                      className="p-1.5 text-charcoal-400 hover:text-rose-600 hover:bg-sand-100 rounded-lg transition-colors"
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
