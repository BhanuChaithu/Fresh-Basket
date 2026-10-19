'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Product, Category } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Editing state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Modal for Add / Edit Full Product
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEditProduct, setCurrentEditProduct] = useState<Partial<Product> | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products?includeUnavailable=true'),
        fetch('/api/categories'),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (prodData.products) setProducts(prodData.products);
      if (catData.categories) setCategories(catData.categories);
    } catch {
      setStatusMsg({ success: false, text: 'Failed to load products.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuickPriceUpdate = async (product: Product) => {
    const num = parseFloat(newPrice);
    if (isNaN(num) || num < 0) {
      alert('Please enter a valid price.');
      return;
    }

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: num, previous_price: product.current_price }),
      });
      const data = await res.json();

      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? data.product : p))
        );
        setEditingPriceId(null);
        setStatusMsg({
          success: true,
          text: `Updated price for ${product.name} to ₹${num}. It is now immediately visible on the public store without redeployment!`,
        });
        setTimeout(() => setStatusMsg(null), 4000);
      }
    } catch {
      alert('Error updating price');
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      const updatedAvail = !product.is_available;
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, is_available: updatedAvail }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? data.product : p))
        );
        setStatusMsg({
          success: true,
          text: `Updated stock status for ${product.name} to ${updatedAvail ? 'In Stock' : 'Out of Stock'}.`,
        });
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch {
      alert('Error toggling stock status');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to archive "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setStatusMsg({ success: true, text: `Product "${name}" archived.` });
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch {
      alert('Error archiving product');
    }
  };

  const handleSaveFullProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEditProduct?.name || currentEditProduct.current_price === undefined) {
      alert('Name and price are required.');
      return;
    }

    try {
      const isEdit = Boolean(currentEditProduct.id);
      const url = isEdit ? `/api/products/${currentEditProduct.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentEditProduct),
      });

      const data = await res.json();
      if (data.success) {
        if (isEdit) {
          setProducts((prev) =>
            prev.map((p) => (p.id === data.product.id ? data.product : p))
          );
        } else {
          setProducts((prev) => [data.product, ...prev]);
        }
        setModalOpen(false);
        setCurrentEditProduct(null);
        setStatusMsg({
          success: true,
          text: `Product "${data.product.name}" successfully saved and updated in the database.`,
        });
        setTimeout(() => setStatusMsg(null), 4000);
      } else {
        alert(data.error || 'Failed to save product');
      }
    } catch {
      alert('Network error while saving product');
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory ? p.category_id === selectedCategory : true;
    const matchSearch = search
      ? p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Product Catalogue & Price Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Prices updated here reflect immediately on customer pages without requiring a redeployment.
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentEditProduct({
              name: '',
              category_id: categories[0]?.id || 'cat-veg',
              unit: '₹/kg',
              current_price: 40,
              previous_price: null,
              is_available: true,
              min_quantity: 1,
              is_featured: false,
              is_sample_data: false,
              description: '',
              origin: 'Bengaluru Farm Belt',
              image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-[#218838] hover:bg-[#1a6f2d] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            statusMsg.success
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMsg.success ? (
            <Check className="w-4 h-4 text-[#218838] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search produce by name..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          <span className="text-gray-400 font-semibold shrink-0">Filter:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#218838]"
          >
            <option value="">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading products from database...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">No matching products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Unit</th>
                  <th className="py-3 px-4">Current Price</th>
                  <th className="py-3 px-4">Previous Price</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Origin / Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-gray-900 block truncate max-w-[160px]">
                            {p.name}
                          </span>
                          {p.is_sample_data && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-sm inline-block">
                              Sample Data
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {p.category_name || categories.find((c) => c.id === p.category_id)?.name || 'Produce'}
                    </td>

                    <td className="py-3 px-4 font-semibold text-gray-700">{p.unit}</td>

                    {/* Quick Inline Price Update */}
                    <td className="py-3 px-4">
                      {editingPriceId === p.id ? (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 font-bold">₹</span>
                          <input
                            type="number"
                            autoFocus
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="w-16 px-2 py-1 bg-white border border-[#218838] rounded-md font-bold text-xs"
                          />
                          <button
                            onClick={() => handleQuickPriceUpdate(p)}
                            className="p-1 bg-[#218838] text-white rounded-md hover:bg-[#1a6f2d]"
                            title="Save new price"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="p-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingPriceId(p.id);
                            setNewPrice(String(p.current_price));
                          }}
                          className="flex items-center gap-1.5 font-black text-sm text-[#14532D] hover:text-[#218838] group cursor-pointer"
                          title="Click to quickly edit price"
                        >
                          <span>₹{p.current_price}</span>
                          <Edit2 className="w-3 h-3 text-gray-300 group-hover:text-[#218838]" />
                        </button>
                      )}
                    </td>

                    <td className="py-3 px-4 text-gray-400">
                      {p.previous_price ? `₹${p.previous_price}` : '—'}
                    </td>

                    {/* Availability toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAvailability(p)}
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] cursor-pointer transition-colors ${
                          p.is_available
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title="Click to toggle stock status"
                      >
                        {p.is_available ? '● In Stock' : '○ Out of Stock'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-gray-500 max-w-[140px] truncate">
                      {p.origin || 'Bengaluru Local'}
                    </td>

                    {/* Full Edit / Delete actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setCurrentEditProduct({ ...p });
                            setModalOpen(true);
                          }}
                          className="p-1.5 text-gray-500 hover:text-[#218838] hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Full Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Archive"
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
        )}
      </div>

      {/* Modal for Add / Edit Full Product */}
      {modalOpen && currentEditProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-lg text-gray-900">
                {currentEditProduct.id ? 'Edit Product Details' : 'Add New Produce Item'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFullProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={currentEditProduct.name || ''}
                  onChange={(e) =>
                    setCurrentEditProduct({ ...currentEditProduct, name: e.target.value })
                  }
                  placeholder="e.g. Farm Fresh Tomato (Hybrid)"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={currentEditProduct.category_id || 'cat-veg'}
                    onChange={(e) =>
                      setCurrentEditProduct({ ...currentEditProduct, category_id: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Unit Display (e.g. ₹/kg, ₹/500 g, ₹/pack) *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentEditProduct.unit || ''}
                    onChange={(e) =>
                      setCurrentEditProduct({ ...currentEditProduct, unit: e.target.value })
                    }
                    placeholder="₹/kg"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Current Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={currentEditProduct.current_price ?? ''}
                    onChange={(e) =>
                      setCurrentEditProduct({
                        ...currentEditProduct,
                        current_price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="38"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Previous Strike-through Price (₹ Optional)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={currentEditProduct.previous_price ?? ''}
                    onChange={(e) =>
                      setCurrentEditProduct({
                        ...currentEditProduct,
                        previous_price: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    placeholder="45"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Product Image URL (Optimized / Licensed WebP / CDN) *
                </label>
                <input
                  type="url"
                  required
                  value={currentEditProduct.image_url || ''}
                  onChange={(e) =>
                    setCurrentEditProduct({ ...currentEditProduct, image_url: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={currentEditProduct.description || ''}
                  onChange={(e) =>
                    setCurrentEditProduct({ ...currentEditProduct, description: e.target.value })
                  }
                  placeholder="Detailed produce description, taste profile, and culinary uses..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Origin
                  </label>
                  <input
                    type="text"
                    value={currentEditProduct.origin || ''}
                    onChange={(e) =>
                      setCurrentEditProduct({ ...currentEditProduct, origin: e.target.value })
                    }
                    placeholder="e.g. Kolar, Karnataka"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Storage Guidelines
                  </label>
                  <input
                    type="text"
                    value={currentEditProduct.storage_notes || ''}
                    onChange={(e) =>
                      setCurrentEditProduct({ ...currentEditProduct, storage_notes: e.target.value })
                    }
                    placeholder="e.g. Keep refrigerated"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={currentEditProduct.is_available ?? true}
                    onChange={(e) =>
                      setCurrentEditProduct({
                        ...currentEditProduct,
                        is_available: e.target.checked,
                      })
                    }
                    className="rounded text-[#218838] focus:ring-[#218838]"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={currentEditProduct.is_featured ?? false}
                    onChange={(e) =>
                      setCurrentEditProduct({
                        ...currentEditProduct,
                        is_featured: e.target.checked,
                      })
                    }
                    className="rounded text-[#218838] focus:ring-[#218838]"
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={currentEditProduct.is_sample_data ?? false}
                    onChange={(e) =>
                      setCurrentEditProduct({
                        ...currentEditProduct,
                        is_sample_data: e.target.checked,
                      })
                    }
                    className="rounded text-[#218838] focus:ring-[#218838]"
                  />
                  <span>Sample Test Produce</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#218838] hover:bg-[#1a6f2d] text-white font-bold rounded-xl shadow-md"
                >
                  Save Produce to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
