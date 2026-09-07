'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { apiClient } from '@/lib/api-client';
import { CheckCircle2, CreditCard, Truck, ArrowRight, Lock, Loader2 } from 'lucide-react';

function CheckoutContent() {
  const { cartItems, subtotal, refreshCart } = useCart();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'USA',
  });

  const shippingCost = 9.99;
  const total = subtotal + shippingCost;

  const successOrder = searchParams.get('success') === 'true' ? searchParams.get('order') : null;
  const isCanceled = searchParams.get('canceled') === 'true';

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  useEffect(() => {
    if (successOrder) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [successOrder]);

  const handleCompleteOrder = async () => {
    setCheckoutError(null);
    setIsSubmitting(true);
    try {
      const result = await apiClient.checkout.createSession(undefined, shippingAddress);
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      setCheckoutError(err.message || 'Checkout failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (successOrder) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="p-10 rounded-xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-xl max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black uppercase">ORDER CONFIRMED #{successOrder}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Thank you for your order! Your payment has been processed securely through Stripe.
          </p>

          <div className="p-4 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Estimated Delivery:</span>
              <span className="font-extrabold">2-3 Business Days (Express)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Payment Provider:</span>
              <span className="font-extrabold">Stripe</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              href="/orders"
              className="px-6 py-3 rounded bg-slate-900 dark:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider"
            >
              Track Order History
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-extrabold text-xs uppercase tracking-wider"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Progress Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 text-xs font-bold uppercase tracking-wider">
        <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-black">1</span>
          <span>Shipping Details</span>
        </div>
        <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-black">2</span>
          <span>Payment Method</span>
        </div>
        <div className={`flex items-center gap-2 ${step === 'review' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-black">3</span>
          <span>Order Review</span>
        </div>
      </div>

      {isCanceled && (
        <div className="p-4 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-bold">
          Your previous checkout was canceled. You can review your cart and try again.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Form Area */}
        <div className="lg:col-span-8 space-y-6">
          {step === 'shipping' && (
            <div className="p-6 rounded-xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="font-extrabold text-base uppercase">Shipping Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress((s) => ({ ...s, fullName: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 text-xs font-bold mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Country</label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress((s) => ({ ...s, country: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 text-xs font-bold mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Street Address</label>
                <input
                  type="text"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress((s) => ({ ...s, address: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 text-xs font-bold mt-1"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">City</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress((s) => ({ ...s, city: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 text-xs font-bold mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">State</label>
                  <input
                    type="text"
                    value={shippingAddress.province}
                    onChange={(e) => setShippingAddress((s) => ({ ...s, province: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 text-xs font-bold mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Zip Code</label>
                  <input
                    type="text"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress((s) => ({ ...s, postalCode: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2.5 text-xs font-bold mt-1"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep('payment')}
                className="w-full py-3.5 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition mt-4"
              >
                Continue To Payment &rarr;
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="p-6 rounded-xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="font-extrabold text-base uppercase">Payment Method</h3>
              <div className="p-4 rounded border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-emerald-500" />
                  <div>
                    <h4 className="font-bold text-xs">Credit / Debit Card via Stripe</h4>
                    <p className="text-[11px] text-slate-400">256-Bit Encrypted Secure Checkout</p>
                  </div>
                </div>
                <Lock className="w-4 h-4 text-emerald-500" />
              </div>

              <p className="text-xs text-slate-500">
                You will be redirected to Stripe's secure checkout page to complete payment.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('shipping')}
                  className="flex-1 py-3.5 rounded border border-slate-300 dark:border-slate-700 font-black text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('review')}
                  className="flex-1 py-3.5 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition"
                >
                  Review Order Details &rarr;
                </button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="p-6 rounded-xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="font-extrabold text-base uppercase">Final Order Review</h3>
              
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs font-bold border-b border-slate-100 dark:border-slate-800/60 pb-2">
                    <span>{item.name} {item.variantName ? `(${item.variantName})` : ''} x {item.quantity}</span>
                    <span>${item.itemTotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {checkoutError && (
                <div className="p-3 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-bold">
                  {checkoutError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('payment')}
                  className="flex-1 py-4 rounded border border-slate-300 dark:border-slate-700 font-black text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleCompleteOrder}
                  disabled={isSubmitting || cartItems.length === 0}
                  className="flex-1 py-4 rounded bg-[#006e21] dark:bg-[#2dff5f] text-white dark:text-black font-black text-sm uppercase tracking-wider hover:opacity-90 transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Redirecting to Stripe...
                    </>
                  ) : (
                    <>Pay ${total.toFixed(2)} & Complete Order</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Summary Box */}
        <div className="lg:col-span-4">
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16191f] space-y-4 shadow-sm">
            <h4 className="font-extrabold text-sm uppercase border-b border-slate-200 dark:border-slate-800 pb-2">
              Order Summary ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items)
            </h4>
            <div className="space-y-2 text-xs font-bold text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Shipping:</span>
                <span className="text-slate-900 dark:text-white">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-black text-slate-900 dark:text-white">
                <span>Total Charge:</span>
                <span className="text-emerald-600 dark:text-emerald-400">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-3" />
          <p className="text-sm text-slate-500 font-bold uppercase">Loading checkout...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
