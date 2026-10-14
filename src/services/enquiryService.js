import { requireSupabase, supabase } from './supabase';

const STORAGE_KEY = 'ssg_enquiries_data';

function getStoredEnquiries() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Failed to read local development enquiries:', error);
    return [];
  }
}

function mapEnquiry(row) {
  return {
    id: row.id,
    name: row.customer_name,
    phone: row.phone,
    email: row.email || '',
    enquiryType: row.enquiry_type,
    productName: row.product_name,
    quantity: row.requested_quantity,
    message: row.message,
    status: row.status,
    internalNotes: row.internal_notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function filterEnquiries(rows, filters) {
  const query = filters.search?.trim().toLowerCase();
  const result = rows.filter((item) => {
    const date = item.createdAt.slice(0, 10);
    return (!query || [item.name, item.phone, item.email, item.productName, item.message].some((value) => value?.toLowerCase().includes(query)))
      && (!filters.status || filters.status === 'all' || item.status === filters.status)
      && (!filters.type || filters.type === 'all' || item.enquiryType === filters.type)
      && (!filters.fromDate || date >= filters.fromDate)
      && (!filters.toDate || date <= filters.toDate);
  });
  result.sort((first, second) => {
    const direction = filters.sort === 'oldest' ? 1 : -1;
    return direction * (new Date(first.createdAt) - new Date(second.createdAt));
  });
  return result;
}

export const enquiryService = {
  async getAllEnquiries() {
    if (!supabase) return getStoredEnquiries();
    const { data, error } = await requireSupabase()
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(mapEnquiry);
  },

  async getEnquiryPage(filters) {
    const { page, pageSize } = filters;
    if (!supabase) {
      const matching = filterEnquiries(getStoredEnquiries(), filters);
      return {
        enquiries: matching.slice(page * pageSize, (page + 1) * pageSize),
        totalCount: matching.length
      };
    }
    let query = requireSupabase()
      .from('enquiries')
      .select('*', { count: 'exact' });
    if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status);
    if (filters.type && filters.type !== 'all') query = query.eq('enquiry_type', filters.type);
    if (filters.fromDate) query = query.gte('created_at', `${filters.fromDate}T00:00:00.000Z`);
    if (filters.toDate) query = query.lte('created_at', `${filters.toDate}T23:59:59.999Z`);
    const search = filters.search?.trim().replace(/[^a-zA-Z0-9 @.+-]/g, '');
    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%,product_name.ilike.%${search}%,message.ilike.%${search}%`);
    }
    query = query
      .order('created_at', { ascending: filters.sort === 'oldest' })
      .order('id', { ascending: true })
      .range(page * pageSize, page * pageSize + pageSize - 1);
    const { data, count, error } = await query;
    if (error) throw error;
    return { enquiries: data.map(mapEnquiry), totalCount: count || 0 };
  },

  async getFilteredEnquiries(filters) {
    if (!supabase) return filterEnquiries(getStoredEnquiries(), filters);
    const pageSize = 500;
    const result = [];
    let page = 0;
    let totalCount = 0;
    do {
      const batch = await this.getEnquiryPage({ ...filters, page, pageSize });
      result.push(...batch.enquiries);
      totalCount = batch.totalCount;
      page += 1;
    } while (result.length < totalCount);
    return result;
  },

  async getDashboardSummary() {
    if (!supabase) {
      const rows = getStoredEnquiries();
      return {
        total: rows.length,
        newCount: rows.filter((row) => row.status === 'New').length,
        processedCount: rows.filter((row) => row.status !== 'New').length,
        latest: rows.slice(0, 5)
      };
    }
    const client = requireSupabase();
    const statuses = ['Contacted', 'In Progress', 'Converted', 'Closed'];
    const [totalResult, newResult, processedResults, latestResult] = await Promise.all([
      client.from('enquiries').select('id', { count: 'exact', head: true }),
      client.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'New'),
      Promise.all(statuses.map((status) => client.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', status))),
      this.getEnquiryPage({ page: 0, pageSize: 5, sort: 'newest' })
    ]);
    const failedCount = [totalResult, newResult, ...processedResults].find((result) => result.error);
    if (failedCount?.error) throw failedCount.error;
    return {
      total: totalResult.count || 0,
      newCount: newResult.count || 0,
      processedCount: processedResults.reduce((sum, result) => sum + (result.count || 0), 0),
      latest: latestResult.enquiries
    };
  },

  async addEnquiry(enquiry) {
    if (!supabase) {
      const created = {
        ...enquiry,
        id: `LOCAL-${crypto.randomUUID()}`,
        status: 'New',
        internalNotes: '',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([created, ...getStoredEnquiries()]));
      return created;
    }

    const { error } = await requireSupabase()
      .from('enquiries')
      .insert({
        customer_name: enquiry.name.trim(),
        phone: enquiry.phone.trim(),
        email: enquiry.email?.trim() || null,
        product_id: enquiry.productId || null,
        product_name: enquiry.productName || 'General catalogue enquiry',
        requested_quantity: Number(enquiry.quantity) || 1,
        enquiry_type: enquiry.enquiryType || 'retail',
        message: enquiry.message?.trim() || '',
        status: 'New',
        internal_notes: ''
      });
    if (error) throw error;
    return { ...enquiry, status: 'New', internalNotes: '', createdAt: new Date().toISOString() };
  },

  async updateEnquiry(id, updates) {
    if (!supabase) {
      const enquiries = getStoredEnquiries();
      const index = enquiries.findIndex((enquiry) => enquiry.id === id);
      if (index === -1) throw new Error('The enquiry no longer exists.');
      enquiries[index] = {
        ...enquiries[index],
        status: updates.status ?? enquiries[index].status,
        internalNotes: updates.internalNotes ?? enquiries[index].internalNotes,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiries));
      return enquiries[index];
    }

    const payload = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.internalNotes !== undefined) payload.internal_notes = updates.internalNotes;
    const { data, error } = await requireSupabase()
      .from('enquiries')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return mapEnquiry(data);
  }
};
