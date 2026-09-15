'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Flame,
  Layers,
  Package,
} from 'lucide-react';
import { Product, Category } from '@/types';
import { formatPKR } from '@/lib/formatters';
import { useToast } from '@/context/ToastContext';
import { fetchApi } from '@/lib/api';

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    shortDesc: '',
    price: '',
    salePrice: '',
    costPrice: '',
    stock: '',
    categoryId: '',
    brand: 'Zavier Signature',
    tags: '',
    isFeatured: false,
    isBestSeller: false,
    isPublished: true,
    imageUrl: '',
    specificationsText: '',
  });

  const loadData = async () => {
    setIsLoading(true);
    const [prodRes, catRes] = await Promise.all([
      fetchApi<Product[]>(`/admin/products?search=${encodeURIComponent(search)}&category=${categoryFilter}`),
      fetchApi<Category[]>('/categories'),
    ]);

    if (prodRes.success && prodRes.data) setProducts(prodRes.data);
    if (catRes.success && catRes.data) setCategories(catRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [search, categoryFilter]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `ZAV-${Math.floor(100 + Math.random() * 900)}`,
      description: '',
      shortDesc: '',
      price: '',
      salePrice: '',
      costPrice: '',
      stock: '20',
      categoryId: categories[0]?.id || '',
      brand: 'Zavier Signature',
      tags: '',
      isFeatured: false,
      isBestSeller: false,
      isPublished: true,
      imageUrl: '',
      specificationsText: 'Material: Genuine Leather\nDimensions: 12" x 8"\nClosure: Zip',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    let specsStr = '';
    if (p.specifications) {
      try {
        const obj = JSON.parse(p.specifications);
        specsStr = Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join('\n');
      } catch {
        specsStr = p.specifications;
      }
    }

    setFormData({
      name: p.name,
      sku: p.sku,
      description: p.description,
      shortDesc: p.shortDesc || '',
      price: String(p.price),
      salePrice: p.salePrice ? String(p.salePrice) : '',
      costPrice: p.costPrice ? String(p.costPrice) : '',
      stock: String(p.stock),
      categoryId: p.categoryId,
      brand: p.brand || 'Zavier',
      tags: p.tags || '',
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
      isPublished: p.isPublished,
      imageUrl: p.images?.[0]?.url || '',
      specificationsText: specsStr,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse specifications from key: value lines
    const specsObj: Record<string, string> = {};
    if (formData.specificationsText.trim()) {
      formData.specificationsText.split('\n').forEach((line) => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          specsObj[parts[0].trim()] = parts.slice(1).join(':').trim();
        }
      });
    }

    const payload = {
      name: formData.name,
      sku: formData.sku,
      description: formData.description,
      shortDesc: formData.shortDesc || null,
      price: parseFloat(formData.price),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
      stock: parseInt(formData.stock, 10) || 0,
      categoryId: formData.categoryId,
      brand: formData.brand,
      tags: formData.tags,
      isFeatured: formData.isFeatured,
      isBestSeller: formData.isBestSeller,
      isPublished: formData.isPublished,
      specifications: JSON.stringify(specsObj),
      images: formData.imageUrl ? [{ url: formData.imageUrl, alt: formData.name }] : undefined,
    };

    let res;
    if (editingProduct) {
      res = await fetchApi(`/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetchApi('/admin/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }

    if (res.success) {
      showToast(editingProduct ? 'Product updated successfully!' : 'Product created successfully!', 'success');
      setIsModalOpen(false);
      loadData();
    } else {
      showToast(res.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const res = await fetchApi(`/admin/products/${id}`, { method: 'DELETE' });
      if (res.success) {
        showToast('Product deleted', 'info');
        loadData();
      } else {
        showToast(res.message || 'Failed to delete', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">Product Inventory</h1>
          <p className="text-xs text-zinc-500">Manage SKUs, prices, stock levels & categories.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU..."
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-800 focus:outline-none"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 focus:ring-2 focus:ring-brand-800 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-zinc-200">
            <thead className="bg-zinc-50 text-zinc-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">SKU</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Stock</th>
                <th className="px-6 py-3.5">Badges</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const img = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=120&q=80';
                  return (
                    <tr key={p.id} className="hover:bg-zinc-50/80 transition">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="relative w-12 h-14 bg-zinc-100 rounded-lg overflow-hidden shrink-0 border border-zinc-200">
                          <Image src={img} alt={p.name} fill sizes="48px" className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-zinc-400">{p.brand || 'Zavier'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-zinc-700">{p.sku}</td>
                      <td className="px-6 py-4 text-zinc-600">{p.category?.name || '—'}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-zinc-900 font-sans">{formatPKR(p.price)}</span>
                        {p.salePrice && (
                          <span className="text-[10px] text-emerald-700 block font-semibold">
                            Sale: {formatPKR(p.salePrice)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.stock <= 5 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-1">
                        {p.isFeatured && (
                          <span className="px-2 py-0.5 bg-brand-100 text-brand-900 text-[10px] font-bold rounded">
                            Featured
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded">
                            Best Seller
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-zinc-600 hover:text-brand-900 rounded-lg hover:bg-zinc-100"
                          aria-label="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-base font-bold text-zinc-950">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Sale Discount Price (PKR)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                  >
                    <option value="">Select Category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Full Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Specifications (Format: "Key: Value" per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.specificationsText}
                  onChange={(e) => setFormData({ ...formData, specificationsText: e.target.value })}
                  placeholder="Material: Full Grain Leather&#10;Dimensions: 10x8 inches"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  />
                  <span>Mark as Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  />
                  <span>Published in Store</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-zinc-100 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-900 text-white font-bold rounded-xl shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

