const ENQUIRIES_STORAGE_KEY = 'ssg_enquiries_data';

const initialEnquiries = [
  {
    id: 'ENQ-1001',
    name: 'Anand V',
    phone: '+91 98421 88219',
    email: 'anand@textiles.in',
    enquiryType: 'bulk',
    productName: 'Classic Crewneck Organic Cotton Tee',
    quantity: 150,
    message: 'Requesting wholesale quote for 150 pcs with custom chest print in Navy Blue.',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'ENQ-1002',
    name: 'Meera Krishnan',
    phone: '+91 97890 12345',
    email: 'meera@fashionhouse.com',
    enquiryType: 'custom',
    productName: 'Breathable Pique Cotton Polo Shirt',
    quantity: 50,
    message: 'Need corporate polo shirts for IT company staff with embroidered collar logo.',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

function getStoredEnquiries() {
  try {
    const data = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(initialEnquiries));
  return initialEnquiries;
}

export const enquiryService = {
  getAllEnquiries() {
    return getStoredEnquiries();
  },

  addEnquiry(data) {
    const enquiries = getStoredEnquiries();
    const newEnquiry = {
      id: `ENQ-${Date.now().toString().slice(-4)}`,
      name: data.name || 'Anonymous Customer',
      phone: data.phone || 'N/A',
      email: data.email || 'N/A',
      enquiryType: data.enquiryType || 'retail',
      productName: data.productName || 'General Catalogue Inquiry',
      quantity: data.quantity || 1,
      message: data.message || '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    const updated = [newEnquiry, ...enquiries];
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
    return newEnquiry;
  },

  updateEnquiryStatus(id, status) {
    const enquiries = getStoredEnquiries();
    const index = enquiries.findIndex((e) => e.id === id);
    if (index === -1) return null;

    enquiries[index].status = status;
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(enquiries));
    return enquiries[index];
  },

  deleteEnquiry(id) {
    const enquiries = getStoredEnquiries();
    const updated = enquiries.filter((e) => e.id !== id);
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
    return true;
  }
};
