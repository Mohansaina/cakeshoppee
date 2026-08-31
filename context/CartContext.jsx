"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState('Today (10 AM - 1 PM)');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState(null);

  // Sync from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cake_shopee_next_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not parse saved cart:', e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cake_shopee_next_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart:', e);
    }
  }, [cart]);

  const addToCart = (product, addQty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const currentQty = existing.quantity || existing.qty || 1;
        const newQty = currentQty + addQty;
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: newQty, qty: newQty }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          weight: product.weight || 'Std',
          quantity: addQty,
          qty: addQty,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const currentQty = item.quantity || item.qty || 1;
            const newQty = currentQty + delta;
            return newQty > 0 ? { ...item, quantity: newQty, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQty, qty: newQty } : item
        )
      );
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyPromoCode = (code) => {
    if (code && code.trim().toUpperCase() === 'FIRST15') {
      setDiscountApplied(true);
      setDiscountPercent(15);
      return { success: true, message: '🎉 Promo FIRST15 applied! 15% discount subtracted.' };
    }
    return { success: false, message: 'Invalid promo code. Try FIRST15' };
  };

  // Ensure items have both quantity and qty properties
  const normalizedCart = (cart || []).map((item) => {
    const q = item.quantity ?? item.qty ?? 1;
    return { ...item, quantity: q, qty: q };
  });

  const subtotal = normalizedCart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const discountAmount = discountApplied ? Math.round(subtotal * (discountPercent / 100)) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount);
  const cartCount = normalizedCart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart: normalizedCart,
        cartItems: normalizedCart,
        addToCart,
        updateCartQuantity,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        discountApplied,
        discountPercent,
        applyPromoCode,
        selectedSlot,
        setSelectedSlot,
        quickViewProduct,
        setQuickViewProduct,
        activeLightboxPhoto,
        setActiveLightboxPhoto,
        setLightboxPhoto: setActiveLightboxPhoto,
        subtotal,
        discountAmount,
        grandTotal,
        cartTotal: grandTotal,
        cartCount,
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

