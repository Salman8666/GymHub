'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

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
  addToCart: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const cart = await apiClient.cart.get();
      setCartItems(cart?.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load cart');
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (productId: string, variantId?: string, quantity = 1) => {
    setError(null);
    try {
      const cart = await apiClient.cart.add(productId, variantId, quantity);
      setCartItems(cart?.items || []);
      setIsCartOpen(true);
    } catch (err: any) {
      setError(err.message || 'Failed to add item to cart');
      throw err;
    }
  };

  const removeFromCart = async (itemId: string) => {
    setError(null);
    try {
      const cart = await apiClient.cart.remove(itemId);
      setCartItems(cart?.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to remove item from cart');
      throw err;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    setError(null);
    try {
      const cart = await apiClient.cart.updateQuantity(itemId, quantity);
      setCartItems(cart?.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to update cart quantity');
      throw err;
    }
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
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
