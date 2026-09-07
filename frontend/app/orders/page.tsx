'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Package, Truck, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  product?: { name: string; image: string; category: string };
}

interface StoreOrder {
  id: string;
  status: string;
  subtotal: number;
  store: { name: string };
  items: OrderItem[];
}

interface Order {
  id: string;
  parentOrderNumber: string;
  status: string;
  totalAmount: number;
  discountAmount: number;
  createdAt: string;
  storeOrders: StoreOrder[];
}

const statusStyles: Record<string, string> = {
  PAID: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  PENDING: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
  CANCELLED: 'bg-red-500/20 text-red-600 dark:text-red-400',
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.orders
      .getAll()
      .then((data) => setOrders(data || []))
      .catch((err) => setError(err.message || 'Failed to load orders'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-3xl font-black uppercase tracking-tight">PURCHASE & ORDER HISTORY</h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
          TRACK MARKETPLACE GEAR SHIPMENTS AND DIGITAL PURCHASES
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-3" />
          <p className="text-sm text-slate-500 font-bold uppercase">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-sm text-red-500 font-bold">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#16191f] rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <Package className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-extrabold text-lg uppercase">No orders yet</h3>
          <p className="text-xs text-slate-500">Your completed purchases will appear here.</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-extrabold text-xs uppercase tracking-wider"
          >
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
                <div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase">
                    ORDER #{order.parentOrderNumber}
                  </span>
                  <p className="text-xs text-slate-500 font-bold">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded font-extrabold text-xs uppercase ${statusStyles[order.status] || 'bg-slate-500/20 text-slate-600 dark:text-slate-400'}`}
                >
                  {order.status === 'PAID' ? 'Paid' : order.status === 'PENDING' ? 'Awaiting Payment' : order.status}
                </span>
              </div>

              <div className="space-y-3">
                {order.storeOrders.map((storeOrder) =>
                  storeOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.product?.image || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=150&q=80'}
                        alt={item.product?.name || item.name}
                        className="w-14 h-14 object-cover rounded border border-slate-200 dark:border-slate-800"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-xs uppercase">{item.product?.name || item.name}</h4>
                        <p className="text-[11px] text-slate-500 font-bold">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-black text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 font-bold">
                  {order.storeOrders.reduce((sum, so) => sum + so.items.reduce((s, i) => s + i.quantity, 0), 0)} items
                </p>
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  Total: ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
