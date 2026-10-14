import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Mail, MessageCircle, Phone, Save, Search } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { enquiryService } from '../../services/enquiryService';

const STATUSES = ['New', 'Contacted', 'In Progress', 'Converted', 'Closed'];
const PAGE_SIZE = 10;

function csvValue(value) {
  const text = String(value ?? '');
  const safeText = /^[\t\r=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [notes, setNotes] = useState({});
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAppliedSearch(search);
      setPage(0);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    enquiryService.getEnquiryPage({
      search: appliedSearch,
      status,
      type,
      fromDate,
      toDate,
      sort,
      page,
      pageSize: PAGE_SIZE
    }).then(({ enquiries: rows, totalCount: count }) => {
      if (!active) return;
      setEnquiries(rows);
      setTotalCount(count);
      setNotes(Object.fromEntries(rows.map((row) => [row.id, row.internalNotes || ''])));
    }).catch((loadError) => {
      if (active) setError(loadError.message || 'Enquiries could not be loaded.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [appliedSearch, status, type, fromDate, toDate, sort, page]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const filters = { search: appliedSearch, status, type, fromDate, toDate, sort };

  const updateStatus = async (enquiry, nextStatus) => {
    setSavingId(enquiry.id);
    setError('');
    setNotice('');
    try {
      const updated = await enquiryService.updateEnquiry(enquiry.id, { status: nextStatus });
      setEnquiries((rows) => rows.map((row) => row.id === enquiry.id ? updated : row));
      setNotice(`Enquiry status updated to ${nextStatus}.`);
    } catch (updateError) {
      setError(updateError.message || 'Enquiry status could not be updated.');
    } finally {
      setSavingId('');
    }
  };

  const saveNotes = async (enquiry) => {
    setSavingId(enquiry.id);
    setError('');
    setNotice('');
    try {
      const updated = await enquiryService.updateEnquiry(enquiry.id, { internalNotes: notes[enquiry.id] || '' });
      setEnquiries((rows) => rows.map((row) => row.id === enquiry.id ? updated : row));
      setNotice('Internal notes saved.');
    } catch (updateError) {
      setError(updateError.message || 'Internal notes could not be saved.');
    } finally {
      setSavingId('');
    }
  };

  const exportCsv = async () => {
    setExporting(true);
    setError('');
    try {
      const records = await enquiryService.getFilteredEnquiries(filters);
      const columns = ['Date', 'Name', 'Phone', 'Email', 'Enquiry type', 'Product', 'Quantity', 'Status', 'Message'];
      const rows = records.map((item) => [
        item.createdAt, item.name, item.phone, item.email, item.enquiryType,
        item.productName, item.quantity, item.status, item.message
      ]);
      const csv = [columns, ...rows].map((row) => row.map(csvValue).join(',')).join('\r\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'sri-sai-garments-enquiries.csv';
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (exportError) {
      setError(exportError.message || 'The filtered enquiries could not be exported.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Customer enquiries</h1>
            <p className="mt-1 text-sm text-charcoal-600">Customer records and internal notes are visible only to administrators.</p>
          </div>
          <button type="button" onClick={() => void exportCsv()} disabled={!totalCount || exporting} className="inline-flex items-center justify-center gap-2 rounded-xl border border-sand-300 bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
            <Download className="w-4 h-4" aria-hidden="true" /> {exporting ? 'Preparing export…' : 'Export filtered CSV'}
          </button>
        </header>
        {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-olive-200 bg-olive-50 p-3 text-sm text-olive-900">{notice}</p>}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3 bg-white p-4 rounded-2xl border border-sand-300" aria-label="Enquiry filters">
          <label className="relative xl:col-span-2">
            <span className="sr-only">Search enquiries</span>
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-500" aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer, phone, product" className="w-full rounded-lg border border-sand-300 pl-9 pr-3 py-2 text-sm" />
          </label>
          <label><span className="sr-only">Filter by enquiry status</span><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }} className="w-full rounded-lg border border-sand-300 bg-white px-3 py-2 text-sm"><option value="all">All statuses</option>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className="sr-only">Filter by enquiry type</span><select value={type} onChange={(event) => { setType(event.target.value); setPage(0); }} className="w-full rounded-lg border border-sand-300 bg-white px-3 py-2 text-sm"><option value="all">All types</option><option value="retail">Retail</option><option value="wholesale">Wholesale</option><option value="custom">Custom</option></select></label>
          <label><span className="sr-only">Sort enquiries</span><select value={sort} onChange={(event) => { setSort(event.target.value); setPage(0); }} className="w-full rounded-lg border border-sand-300 bg-white px-3 py-2 text-sm"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
          <div className="flex gap-2">
            <label className="min-w-0 flex-1"><span className="sr-only">From date</span><input type="date" aria-label="From date" value={fromDate} onChange={(event) => { setFromDate(event.target.value); setPage(0); }} className="w-full min-w-0 rounded-lg border border-sand-300 px-2 py-2 text-xs" /></label>
            <label className="min-w-0 flex-1"><span className="sr-only">To date</span><input type="date" aria-label="To date" value={toDate} onChange={(event) => { setToDate(event.target.value); setPage(0); }} className="w-full min-w-0 rounded-lg border border-sand-300 px-2 py-2 text-xs" /></label>
          </div>
        </section>

        {loading ? <p role="status" className="py-12 text-center text-sm text-charcoal-600">Loading enquiries…</p> : enquiries.length === 0 ? (
          <div className="rounded-2xl border border-sand-300 bg-white py-12 text-center">
            <p className="font-semibold">{totalCount ? 'No enquiries on this page.' : 'No enquiries received yet.'}</p>
            <p className="text-sm text-charcoal-600 mt-1">{totalCount ? 'Try another page.' : 'Website submissions will appear here.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((item) => {
              const phoneDigits = item.phone.replace(/\D/g, '');
              const validPhone = phoneDigits.length >= 5 && phoneDigits.length <= 15;
              return (
                <article key={item.id} className="bg-white rounded-2xl border border-sand-300 p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold text-lg">{item.name}</h2>
                        <span className="rounded-full bg-sand-100 px-2.5 py-1 text-xs">{item.status}</span>
                        <span className="rounded-full border border-sand-300 px-2.5 py-1 text-xs capitalize">{item.enquiryType}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-charcoal-700">
                        <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-olive" />{item.phone}</span>
                        {item.email && <a className="inline-flex items-center gap-1.5 text-olive hover:underline" href={`mailto:${item.email}`}><Mail className="w-3.5 h-3.5" />{item.email}</a>}
                        {validPhone && <a className="inline-flex items-center gap-1.5 text-olive hover:underline" href={`tel:${phoneDigits}`}><Phone className="w-3.5 h-3.5" />Call</a>}
                        {validPhone && <a className="inline-flex items-center gap-1.5 text-olive hover:underline" href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer"><MessageCircle className="w-3.5 h-3.5" />WhatsApp</a>}
                      </div>
                    </div>
                    <label className="w-full md:w-48 text-xs font-semibold">
                      Update status
                      <select disabled={savingId === item.id} value={item.status} onChange={(event) => void updateStatus(item, event.target.value)} className="mt-1 w-full rounded-lg border border-sand-300 bg-white p-2.5 text-sm">
                        {STATUSES.map((value) => <option key={value}>{value}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl bg-sand-50 p-3 text-sm">
                    <div><p className="text-xs text-charcoal-500">Product</p><p className="font-semibold">{item.productName}</p></div>
                    <div><p className="text-xs text-charcoal-500">Quantity</p><p className="font-semibold">{item.quantity}</p></div>
                    <div><p className="text-xs text-charcoal-500">Received</p><p className="font-semibold">{new Date(item.createdAt).toLocaleString()}</p></div>
                    <div><p className="text-xs text-charcoal-500">Reference</p><p className="font-mono text-xs break-all">{item.id}</p></div>
                  </div>
                  {item.message && <p className="whitespace-pre-wrap text-sm text-charcoal-700">{item.message}</p>}
                  <div className="border-t border-sand-200 pt-3">
                    <label htmlFor={`notes-${item.id}`} className="block text-xs font-semibold text-charcoal-700">Internal notes (admin only)</label>
                    <div className="mt-1 flex flex-col sm:flex-row gap-2">
                      <textarea id={`notes-${item.id}`} rows={2} maxLength={5000} value={notes[item.id] ?? ''} onChange={(event) => setNotes((current) => ({ ...current, [item.id]: event.target.value }))} className="flex-1 rounded-lg border border-sand-300 p-2.5 text-sm" />
                      <button type="button" disabled={savingId === item.id} onClick={() => void saveNotes(item)} className="inline-flex items-center justify-center gap-2 self-end rounded-lg bg-sand-100 px-4 py-2 text-sm font-semibold disabled:opacity-50"><Save className="w-4 h-4" aria-hidden="true" /> Save notes</button>
                    </div>
                  </div>
                </article>
              );
            })}
            {totalCount > PAGE_SIZE && (
              <div className="flex items-center justify-between rounded-xl bg-white border border-sand-300 p-3 text-sm">
                <span>Page {currentPage + 1} of {totalPages} · {totalCount} enquiries</span>
                <div className="flex gap-2">
                  <button type="button" disabled={currentPage === 0} onClick={() => setPage((value) => value - 1)} aria-label="Previous page" className="p-2 border rounded-lg disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
                  <button type="button" disabled={currentPage >= totalPages - 1} onClick={() => setPage((value) => value + 1)} aria-label="Next page" className="p-2 border rounded-lg disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
