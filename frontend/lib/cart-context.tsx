'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  unitPrice: number;
  quantity: number;
  image: string;
  variantName?: string;
  category?: string;
  itemTotal: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  error: string | null;
  addToCart: (
    productId: string,
    variantId?: string,
    quantity?: number,
    itemDetails?: Partial<CartItem>
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  totalItems: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'gymhub_cart_items';

function getLocalCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Initialize cart from localStorage immediately on mount
  useEffect(() => {
    const local = getLocalCart();
    if (local.length > 0) {
      setCartItems(local);
    }
  }, []);

  const loadCart = useCallback(async () => {
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('gymhub-auth-token');
    const local = getLocalCart();

    if (!hasToken) {
      // Guest cart: read from localStorage
      setCartItems(local);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const cart = await apiClient.cart.get();
      if (cart?.items && Array.isArray(cart.items) && cart.items.length > 0) {
        setCartItems(cart.items);
        saveLocalCart(cart.items);
      } else if (local.length > 0) {
        // Keep local cart items so user cart is never wiped out unexpectedly
        setCartItems(local);
      } else {
        setCartItems([]);
      }
    } catch {
      // Fallback to local cart on network/auth error
      setCartItems(local);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (
    productId: string,
    variantId?: string,
    quantity = 1,
    itemDetails?: Partial<CartItem>
  ) => {
    setError(null);
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('gymhub-auth-token');

    // If authenticated, try syncing with backend
    if (hasToken) {
      try {
        const cart = await apiClient.cart.add(productId, variantId, quantity);
        if (cart?.items && Array.isArray(cart.items)) {
          setCartItems(cart.items);
          saveLocalCart(cart.items);
          setIsCartOpen(true);
          return;
        }
      } catch (err: any) {
        // If backend fails (e.g. mock product not in DB, network error), fallback to local cart smoothly
        console.warn('[Cart] Backend add failed, falling back to local cart:', err.message);
      }
    }

    // Local cart fallback / Guest cart
    const matchedMock = MOCK_PRODUCTS.find((p) => p.id === productId);
    const name = itemDetails?.name || matchedMock?.name || 'Performance Gear';
    const unitPrice = itemDetails?.unitPrice ?? matchedMock?.price ?? 0;
    const image = itemDetails?.image || matchedMock?.image || '/weblogo.jpeg';
    const category = itemDetails?.category || matchedMock?.category || 'Gear';
    const variantName = itemDetails?.variantName;
    const itemId = `${productId}-${variantId || 'default'}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.productId === productId && (item.variantId || undefined) === (variantId || undefined)
      );

      let nextItems: CartItem[];
      if (existingIndex > -1) {
        nextItems = [...prevItems];
        const existing = nextItems[existingIndex];
        const newQty = existing.quantity + quantity;
        nextItems[existingIndex] = {
          ...existing,
          quantity: newQty,
          itemTotal: parseFloat((existing.unitPrice * newQty).toFixed(2)),
        };
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId,
          variantId,
          name,
          unitPrice,
          quantity,
          image,
          variantName,
          category,
          itemTotal: parseFloat((unitPrice * quantity).toFixed(2)),
        };
        nextItems = [...prevItems, newItem];
      }

      saveLocalCart(nextItems);
      return nextItems;
    });

    setIsCartOpen(true);
  };

  const removeFromCart = async (itemId: string) => {
    setError(null);
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('gymhub-auth-token');

    if (hasToken) {
      try {
        const cart = await apiClient.cart.remove(itemId);
        if (cart?.items && Array.isArray(cart.items)) {
          setCartItems(cart.items);
          saveLocalCart(cart.items);
          return;
        }
      } catch (err: any) {
        console.warn('[Cart] Backend remove failed, applying locally:', err.message);
      }
    }

    setCartItems((prev) => {
      const next = prev.filter((item) => item.id !== itemId);
      saveLocalCart(next);
      return next;
    });
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    setError(null);
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('gymhub-auth-token');

    if (hasToken) {
      try {
        const cart = await apiClient.cart.updateQuantity(itemId, quantity);
        if (cart?.items && Array.isArray(cart.items)) {
          setCartItems(cart.items);
          saveLocalCart(cart.items);
          return;
        }
      } catch (err: any) {
        console.warn('[Cart] Backend updateQuantity failed, applying locally:', err.message);
      }
    }

    setCartItems((prev) => {
      const next = prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            itemTotal: parseFloat((item.unitPrice * quantity).toFixed(2)),
          };
        }
        return item;
      });
      saveLocalCart(next);
      return next;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const subtotal = parseFloat(cartItems.reduce((sum, item) => sum + item.itemTotal, 0).toFixed(2));
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        totalItems,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
