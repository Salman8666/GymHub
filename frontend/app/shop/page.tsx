'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { useCart } from '@/lib/cart-context';
import { Search, Star, ShoppingBag, Filter, CheckCircle2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  inStock: boolean;
}

export default function ShopPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    apiClient.products
      .getAll()
      .then((data) => {
        setProducts(data || []);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load products');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    if (categoryFilter === 'all') return matchesSearch;
    return matchesSearch && p.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, undefined, 1);
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 1500);
    } catch {
      // Error is surfaced in cart context
    }
  };

  const categories = ['all', 'Supplements', 'Gear', 'Apparel', 'Digital'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#1b1c1c] text-white p-8 rounded-xl border border-slate-800 space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          GYM HUB <span className="text-[#2dff5f]">SUPPLEMENTS & GEAR</span> MARKETPLACE
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          100% lab-tested protein isolates, clinical pre-workouts, genuine leather weightlifting belts, and official athlete training apparel.
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search products by keyword (e.g. Whey, Belt, Pre-Workout)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded text-xs text-white pl-10 pr-4 py-3 focus:outline-none focus:border-[#2dff5f]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap ${categoryFilter === cat ? 'bg-[#2dff5f] text-black' : 'bg-slate-800 text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Catalog Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <p className="text-sm text-slate-500 font-bold uppercase">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-sm text-red-500 font-bold">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div key={prod.id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] overflow-hidden flex flex-col justify-between shadow-sm">
              <div>
                <div className="relative h-52 bg-slate-100 dark:bg-slate-900 p-4">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-black/80 text-white">
                    {prod.category}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-extrabold text-sm uppercase line-clamp-2">{prod.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {prod.rating} ({prod.reviewsCount} reviews)
                  </div>
                  <p className="font-black text-lg text-emerald-600 dark:text-emerald-400">${prod.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-2">
                <button
                  onClick={() => handleAddToCart(prod)}
                  disabled={!prod.inStock || addedId === prod.id}
                  className="w-full py-2.5 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {addedId === prod.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Added
                    </>
                  ) : !prod.inStock ? (
                    'Out of Stock'
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" /> Add To Cart
                    </>
                  )}
                </button>
                <Link
                  href={`/shop/${prod.id}`}
                  className="w-full block text-center py-2 rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Product Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
