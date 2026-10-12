import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, Package, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { productService } from '../../services/productService';

export default function AdminProducts() {
  const [productsList, setProductsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'men',
    price: '',
    originalPrice: '',
    material: '',
    description: '',
    sizes: ['S', 'M', 'L', 'XL'],
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    availability: true,
    isNew: true,
    featured: false
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setProductsList(productService.getAllProducts());
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'men',
      price: '',
      originalPrice: '',
      material: '100% Combed Cotton (180 GSM)',
      description: '',
      sizes: ['S', 'M', 'L', 'XL'],
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      availability: true,
      isNew: true,
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category || 'men',
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      material: prod.material || '',
      description: prod.description || '',
      sizes: prod.sizes || ['S', 'M', 'L', 'XL'],
      imageUrl: prod.images[0] || '',
      availability: prod.availability !== undefined ? prod.availability : true,
      isNew: prod.isNew || false,
      featured: prod.featured || false
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete product ${id}?`)) {
      productService.deleteProduct(id);
      loadProducts();
    }
  };

  const handleToggleStock = (prod) => {
    productService.updateProduct(prod.id, { availability: !prod.availability });
    loadProducts();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      material: formData.material,
      description: formData.description,
      sizes: formData.sizes,
      images: [formData.imageUrl],
      colors: [
        { name: "Onyx Black", hex: "#090d16" },
        { name: "Pure White", hex: "#f8fafc" },
        { name: "Navy Blue", hex: "#1e293b" }
      ],
      availability: formData.availability,
      isNew: formData.isNew,
      featured: formData.featured
    };

    if (editingProduct) {
      productService.updateProduct(editingProduct.id, payload);
    } else {
      productService.addProduct(payload);
    }

    setIsModalOpen(false);
    loadProducts();
  };

  const filteredProducts = productsList.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-charcoal">
              Garments CRUD Manager
            </h1>
            <p className="text-charcoal-500 text-xs mt-1">
              Add, edit prices, update stock availability, or delete garments in live catalogue.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-olive hover:bg-olive-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-olive/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Garment</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-sand-300 shadow-xs flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search by code or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sand-50/80 text-charcoal text-xs pl-9 pr-4 py-2 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:bg-white"
            />
          </div>

          <span className="text-xs text-charcoal-500 font-medium">
            Total Garments: <strong className="text-charcoal">{filteredProducts.length}</strong>
          </span>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-sand-300 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-50 text-charcoal-600 uppercase text-[10px] border-b border-sand-200">
                <tr>
                  <th className="p-3">Garment</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Sizes</th>
                  <th className="p-3">Stock Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-sand-50/60">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded-lg border border-sand-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-charcoal line-clamp-1">{prod.name}</div>
                          <div className="text-[10px] text-charcoal-400">{prod.material}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 font-mono font-bold text-olive">{prod.id}</td>

                    <td className="p-3">
                      <div className="font-extrabold text-charcoal">₹{prod.price}</div>
                      {prod.originalPrice && (
                        <div className="text-[10px] text-charcoal-400 line-through">₹{prod.originalPrice}</div>
                      )}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {prod.sizes?.map((sz) => (
                          <span key={sz} className="text-[10px] bg-sand-50 text-charcoal-700 px-1.5 py-0.5 rounded border border-sand-200">
                            {sz}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => handleToggleStock(prod)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                          prod.availability
                            ? 'bg-olive/15 text-olive border-olive/30 hover:bg-olive/25'
                            : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {prod.availability ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-2 rounded-lg bg-sand-100 hover:bg-olive hover:text-white text-olive border border-sand-300 transition-colors"
                          title="Edit Garment"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200 transition-colors"
                          title="Delete Garment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form for Add/Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-sand-300 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 my-8">
              
              <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                <h3 className="text-lg font-bold text-charcoal">
                  {editingProduct ? `Edit Garment (${editingProduct.id})` : 'Add New Garment Design'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-charcoal-400 hover:text-charcoal">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-charcoal-700 font-semibold block mb-1">Garment Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Premium Combed Cotton Crewneck Tee"
                    className="w-full bg-sand-50/80 text-charcoal p-3 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-charcoal-700 font-semibold block mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="499"
                      className="w-full bg-sand-50/80 text-charcoal p-3 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-charcoal-700 font-semibold block mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="799"
                      className="w-full bg-sand-50/80 text-charcoal p-3 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-charcoal-700 font-semibold block mb-1">Material / GSM Specs</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="e.g. 100% Organic Combed Cotton (180 GSM)"
                    className="w-full bg-sand-50/80 text-charcoal p-3 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-charcoal-700 font-semibold block mb-1">Garment Image URL</label>
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-sand-50/80 text-charcoal p-3 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-charcoal-700 font-semibold block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Garment narrative description..."
                    className="w-full bg-sand-50/80 text-charcoal p-3 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-charcoal-700">
                    <input
                      type="checkbox"
                      checked={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                      className="rounded border-sand-300 text-olive focus:ring-0"
                    />
                    <span>In Stock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-charcoal-700">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="rounded border-sand-300 text-olive focus:ring-0"
                    />
                    <span>New Arrival Tag</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-sand-100 text-charcoal-700 font-semibold hover:bg-sand-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-olive hover:bg-olive-600 text-white font-bold shadow-md shadow-olive/20 transition-all"
                  >
                    {editingProduct ? 'Save Changes' : 'Add Garment Design'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
