'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, subtotal, isLoading } = useCart();
  const shipping = subtotal > 0 ? 9.99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-3xl font-black uppercase tracking-tight">YOUR SHOPPING CART</h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
          {cartItems.reduce((sum, i) => sum + i.quantity, 0)} ITEMS IN CART
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <p className="text-sm text-slate-500">Loading your cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#16191f] rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-extrabold text-lg uppercase">Your cart is currently empty</h3>
          <p className="text-xs text-slate-500">Explore our supplements, lifting gear, and training apparel catalog.</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-extrabold text-xs uppercase tracking-wider"
          >
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] flex flex-col sm:flex-row gap-5 items-center justify-between"
              >
                <div className="flex gap-4 items-center w-full sm:w-auto">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded border border-slate-200 dark:border-slate-800" />
                  <div>
                    <h4 className="font-bold text-sm uppercase line-clamp-1">{item.name}</h4>
                    {item.variantName && <p className="text-xs text-slate-500 font-bold">{item.variantName}</p>}
                    <p className="font-black text-emerald-600 dark:text-emerald-400 mt-1">${item.unitPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-extrabold text-sm px-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-black text-base">${item.itemTotal.toFixed(2)}</span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Box */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] space-y-6 shadow-sm">
              <h3 className="font-extrabold text-lg uppercase border-b border-slate-200 dark:border-slate-800 pb-3">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs font-bold text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 dark:text-white font-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="text-slate-900 dark:text-white font-black">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-sm font-black text-slate-900 dark:text-white">
                  <span>Estimated Total</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-lg">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition shadow-md"
              >
                Proceed To Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
