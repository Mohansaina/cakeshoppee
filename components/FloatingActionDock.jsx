"use client";

import React from 'react';
import { ShoppingBag, MessageSquare } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function FloatingActionDock() {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <div className="floating-action-dock">
      
      <a
        href="https://wa.me/917660948403?text=Hi%20Cake%20Shopee,%20I%20would%20like%20to%20place%20an%20order%20or%20inquire%20about%20cakes!"
        className="floating-whatsapp-btn"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare size={18} />
        <span>WhatsApp Order</span>
      </a>

      {cartCount > 0 && (
        <button
          className="floating-cart-pill"
          onClick={() => setIsCartOpen(true)}
          aria-label="View Shopping Cart"
        >
          <ShoppingBag size={18} />
          <span>Cart ({cartCount})</span>
        </button>
      )}

    </div>
  );
}
