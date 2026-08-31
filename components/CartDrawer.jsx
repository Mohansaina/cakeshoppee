"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, Send, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const NARSIPATNAM_AREAS = [
  "Near Abes Centre (Main Road)",
  "Beside Himalaya Juice Center",
  "Near RTC Bus Stand",
  "Peddaboddepalli",
  "Balighattam",
  "Lingarajupeta",
  "College Road / Station Road",
  "Tagarapu Veedhi",
  "Other Narsipatnam Area"
];

export default function CartDrawer() {
  const { cartItems = [], isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, cartTotal = 0 } = useCart();
  
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' or 'takeaway'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [selectedArea, setSelectedArea] = useState('Near Abes Centre (Main Road)');
  const [streetAddress, setStreetAddress] = useState('');
  const [cakeMessage, setCakeMessage] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('As soon as possible');

  if (!isCartOpen) return null;

  const handleCheckout = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) return;

    let text = `🛍️ *NEW ORDER - CAKE SHOPEE NARSIPATNAM*\n`;
    text += `------------------------------------\n`;
    text += `👤 *Customer Name:* ${customerName || 'Customer'}\n`;
    text += `📞 *Primary Phone:* ${customerPhone || 'Not specified'}\n`;
    if (altPhone) {
      text += `📞 *Alternate Phone:* ${altPhone}\n`;
    }
    text += `🚚 *Order Type:* ${orderType === 'delivery' ? 'Local Door Delivery' : 'Counter Takeaway Pickup'}\n`;
    
    if (orderType === 'delivery') {
      text += `📍 *Narsipatnam Area:* ${selectedArea}\n`;
      text += `🏠 *House/Door No & Street:* ${streetAddress || 'Not specified'}\n`;
    }

    if (cakeMessage) {
      text += `🎂 *Message on Cake:* "${cakeMessage}"\n`;
    }
    
    text += `⏰ *Requested Timing:* ${deliveryTime}\n`;
    text += `------------------------------------\n`;
    text += `*ITEMS ORDERED:*\n`;

    cartItems.forEach((item, index) => {
      text += `${index + 1}. ${item.name} (${item.weight || 'Std'}) x ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });

    text += `------------------------------------\n`;
    text += `💰 *TOTAL AMOUNT:* ₹${cartTotal}\n`;
    text += `------------------------------------\n`;
    if (orderType === 'delivery') {
      text += `📍 *Tip:* Tap the '+' button in this WhatsApp chat to share your Live Location pin!\n`;
    }
    text += `Please confirm my order and send UPI payment details.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/917660948403?text=${encoded}`, '_blank');
  };

  return (
    <div className={`cart-drawer-backdrop ${isCartOpen ? 'active' : ''}`} onClick={() => setIsCartOpen(false)}>
      <div className={`cart-drawer ${isCartOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#e11d48" />
            <h3>Your Order Cart</h3>
          </div>
          <button className="close-drawer-btn" onClick={() => setIsCartOpen(false)} aria-label="Close Cart">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="text-center" style={{ padding: '60px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🧁</div>
              <h4 style={{ color: '#1f110a', marginBottom: '6px' }}>Your Cart is Empty</h4>
              <p style={{ color: '#695247', fontSize: '0.9rem', marginBottom: '20px' }}>
                Add your favorite cakes, pastries, puffs or shakes to get started!
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setIsCartOpen(false)}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-img">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div className="cart-item-info">
                    <h5 className="cart-item-title">{item.name}</h5>
                    <span className="cart-item-price">₹{item.price}</span>
                  </div>

                  <div className="cart-item-qty">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', minWidth: '16px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'transparent', border: 'none', color: '#947e74', cursor: 'pointer' }}
                    title="Remove Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {/* Order Fulfillment Selection */}
              <div style={{ marginTop: '14px' }}>
                <label style={{ fontSize: '0.86rem', fontWeight: '700', color: '#1f110a' }}>Fulfillment Option:</label>
                <div className="cart-order-type-switch">
                  <button
                    type="button"
                    className={`order-type-btn ${orderType === 'delivery' ? 'active' : ''}`}
                    onClick={() => setOrderType('delivery')}
                  >
                    🚚 Door Delivery
                  </button>
                  <button
                    type="button"
                    className={`order-type-btn ${orderType === 'takeaway' ? 'active' : ''}`}
                    onClick={() => setOrderType('takeaway')}
                  >
                    🛍️ Counter Takeaway
                  </button>
                </div>
              </div>

              {/* Customer Details Form */}
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: '600' }}>Your Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label style={{ fontSize: '0.84rem', fontWeight: '600' }}>Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile no."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.84rem', fontWeight: '600' }}>Alt. Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="Secondary number"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                  />
                </div>
              </div>

              {orderType === 'delivery' && (
                <>
                  <div className="form-group">
                    <label style={{ fontSize: '0.84rem', fontWeight: '600' }}>Select Narsipatnam Area / Landmark *</label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      style={{ fontWeight: '600', color: '#1e293b' }}
                    >
                      {NARSIPATNAM_AREAS.map((area) => (
                        <option key={area} value={area}>📍 {area}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.84rem', fontWeight: '600' }}>Door / House No & Street Address *</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Door No 4-12, Tagarapu Street, Opposite SBI ATM"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </>
              )}

              <div className="form-group">
                <label style={{ fontSize: '0.84rem', fontWeight: '600' }}>Custom Message on Cake (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Happy Birthday Sai!"
                  value={cakeMessage}
                  onChange={(e) => setCakeMessage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.84rem', fontWeight: '600' }}>Requested Delivery Timing</label>
                <select value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)}>
                  <option value="As soon as possible">As Soon As Possible (Within 30-45 mins)</option>
                  <option value="Today Evening (4:00 PM – 6:00 PM)">Today Evening (4:00 PM – 6:00 PM)</option>
                  <option value="Today Night (7:00 PM – 9:30 PM)">Today Night (7:00 PM – 9:30 PM)</option>
                  <option value="Tomorrow Morning (10:00 AM – 1:00 PM)">Tomorrow Morning (10:00 AM – 1:00 PM)</option>
                  <option value="Tomorrow Evening (4:00 PM – 8:00 PM)">Tomorrow Evening (4:00 PM – 8:00 PM)</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span>Items Total ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
              <span>₹{cartTotal}</span>
            </div>
            
            <div className="cart-total-row">
              <span>Payable Amount</span>
              <span>₹{cartTotal}</span>
            </div>

            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              <Send size={18} /> Send Order to WhatsApp →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
