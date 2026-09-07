'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Store, Plus, Package, Loader2, X, ImageIcon, ListChecks, AlignLeft } from 'lucide-react';

interface StoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
}

const EMPTY_IMAGES = ['', '', ''];

export default function StoreManagementPage() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Supplements');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [images, setImages] = useState<string[]>(EMPTY_IMAGES);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('50');

  const fetchProducts = async () => {
    try {
      const data = await apiClient.trainers.me();
      setProducts(data.store?.products || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load your store products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setName('');
    setCategory('Supplements');
    setDescription('');
    setFeatures('');
    setImages(EMPTY_IMAGES);
    setPrice('');
    setStock('50');
    setError(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description) return;

    const featureList = features
      .split(/\n|,/)
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const imageList = images.map((u) => u.trim()).filter((u) => u.length > 0);
    if (imageList.length === 0) {
      setError('Provide at least one product image URL.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await apiClient.products.create({
        name,
        category,
        description,
        features: featureList,
        price: parseFloat(price),
        stock: parseInt(stock, 10) || 50,
        image: imageList[0],
        images: imageList,
      });
      resetForm();
      setShowForm(false);
      await fetchProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#2dff5f] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#16191f] p-6 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-black uppercase text-white">MY STORE MANAGER</h1>
          <p className="text-xs text-slate-400">Manage your own digital downloads, merch, supplements, and inventory stock.</p>
        </div>
        <button
          onClick={() => {
            setShowForm((v) => !v);
            if (showForm) resetForm();
          }}
          className="px-4 py-2.5 rounded bg-[#2dff5f] text-[#002105] font-black text-xs uppercase tracking-wider hover:bg-[#00e54e] transition flex items-center gap-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {showForm ? 'Cancel' : 'Add Product Item'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-bold">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="bg-[#16191f] rounded-xl border border-slate-800 p-6 space-y-5">
          <h3 className="font-extrabold text-sm uppercase text-[#2dff5f]">Add New Product</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elite ISO-Whey Protein Isolate"
                required
                minLength={3}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white"
              >
                <option>Supplements</option>
                <option>Gear</option>
                <option>Apparel</option>
                <option>Digital</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5" /> Product Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product, its benefits, and ideal use case..."
              required
              minLength={10}
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
              <ListChecks className="w-3.5 h-3.5" /> Product Features
            </label>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Enter one feature per line or comma-separated, e.g. 27g protein per scoop, Zero added sugar, Fast absorption"
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white"
            />
            <p className="text-[10px] text-slate-500 mt-1">One feature per line or comma-separated.</p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" /> Product Images (up to 3)
            </label>
            {images.map((url, index) => (
              <input
                key={index}
                type="url"
                value={url}
                onChange={(e) => {
                  const next = [...images];
                  next[index] = e.target.value;
                  setImages(next);
                }}
                placeholder={`Image URL ${index + 1}`}
                required={index === 0}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="29.99"
                min="0.01"
                step="0.01"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Quantity In Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2.5 rounded bg-[#2dff5f] text-[#002105] font-black text-xs uppercase tracking-wider hover:bg-[#00e54e] transition disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      )}

      <div className="bg-[#16191f] rounded-xl border border-slate-800 p-6">
        {products.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Package className="w-10 h-10 text-slate-600 mx-auto" />
            <h2 className="text-sm font-black uppercase text-white">Your Store Is Empty</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Only products you create will appear here. You cannot see or edit other trainers' inventory.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900/60 border-b border-slate-800">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-semibold text-slate-300">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/40">
                    <td className="p-3 flex items-center gap-2.5">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-8 h-8 object-cover rounded bg-white" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                          <Package className="w-4 h-4 text-slate-500" />
                        </div>
                      )}
                      <span className="font-bold text-white">{p.name}</span>
                    </td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3 text-[#2dff5f] font-black">${Number(p.price).toFixed(2)}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[#2dff5f] border border-emerald-500/40 text-[10px] font-black uppercase">
                        {p.stock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
