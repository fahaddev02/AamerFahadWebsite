'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, X, Layers } from 'lucide-react';
import { Category } from '../../../types/index';
import { useToast } from '../../../context/ToastContext';
import { fetchApi } from '../../../lib/api';

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true,
  });

  const loadCategories = async () => {
    setIsLoading(true);
    const res = await fetchApi<Category[]>('/categories');
    if (res.success && res.data) {
      setCategories(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '', isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      description: c.description || '',
      image: c.image || '',
      isActive: c.isActive !== undefined ? c.isActive : true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let res;
    if (editingCategory) {
      res = await fetchApi(`/admin/categories/${editingCategory.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
    } else {
      res = await fetchApi('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
    }

    if (res.success) {
      showToast(editingCategory ? 'Category updated!' : 'Category created!', 'success');
      setIsModalOpen(false);
      loadCategories();
    } else {
      showToast(res.message || 'Action failed', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const res = await fetchApi(`/admin/categories/${id}`, { method: 'DELETE' });
      if (res.success) {
        showToast('Category deleted', 'info');
        loadCategories();
      } else {
        showToast(res.message || 'Cannot delete category with existing products', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">Categories</h1>
          <p className="text-xs text-zinc-500">Manage catalog categories and taxonomy.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 text-center py-12 text-zinc-400 text-xs">Loading categories...</div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex items-start gap-4"
            >
              <div className="relative w-20 h-20 bg-zinc-100 rounded-2xl overflow-hidden shrink-0 border border-zinc-200">
                {cat.image && (
                  <Image src={cat.image} alt={cat.name} fill sizes="80px" className="object-cover" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 truncate">{cat.name}</h3>
                <p className="text-xs text-zinc-500 line-clamp-2">{cat.description || 'No description'}</p>
                <span className="text-[11px] font-semibold text-brand-800 block pt-1">
                  {cat.productCount || 0} Products
                </span>
              </div>

              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 text-zinc-600 hover:text-brand-900 rounded-lg hover:bg-zinc-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-base font-bold text-zinc-950">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-zinc-100 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-900 text-white font-bold rounded-xl shadow"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

