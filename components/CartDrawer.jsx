"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, MapPin, Compass } from 'lucide-react';
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
  
  const [orderType, setOrderType] = useState('takeaway'); // 'takeaway' or 'delivery'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [selectedArea, setSelectedArea] = useState('Near Abes Centre (Main Road)');
  const [streetAddress, setStreetAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('As soon as possible');

  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [gpsCoords, setGpsCoords] = useState(null);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsCoords({ lat: latitude, lon: longitude });
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocError('Location permission denied. Please select your area below.');
        } else {
          setLocError('GPS signal weak. Select your area below.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  if (!isCartOpen) return null;

  const handleCheckout = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) return;

    let text = `🛍️ *NEW ORDER - CAKE SHOPEE NARSIPATNAM*\n`;
    text += `------------------------------------\n`;
    text += `👤 *Customer Name:* ${customerName || 'Customer'}\n`;
    text += `📞 *Phone:* ${customerPhone || 'Not specified'}\n`;
    text += `🚚 *Order Type:* ${orderType === 'delivery' ? 'Local Door Delivery' : 'Counter Takeaway Pickup'}\n`;
    if (orderType === 'delivery') {
      const fullAddress = `${streetAddress ? `${streetAddress}, ` : ''}${selectedArea}, Narsipatnam, AP (531116)`;
      text += `📍 *Delivery Address:* ${fullAddress}\n`;
      if (gpsCoords) {
        text += `🗺️ *Live GPS Pin Link:* https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lon}\n`;
      }
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
            <ShoppingBag size={20} color="#c48b3b" />
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

              {/* Order Settings */}
              <div style={{ marginTop: '10px' }}>
                <label style={{ fontSize: '0.86rem', fontWeight: '700', color: '#1f110a' }}>Fulfillment Option:</label>
                <div className="cart-order-type-switch">
                  <button
                    type="button"
                    className={`order-type-btn ${orderType === 'takeaway' ? 'active' : ''}`}
                    onClick={() => setOrderType('takeaway')}
                  >
                    🛍️ Takeaway / Pickup
                  </button>
                  <button
                    type="button"
                    className={`order-type-btn ${orderType === 'delivery' ? 'active' : ''}`}
                    onClick={() => setOrderType('delivery')}
                  >
                    🚚 Local Delivery (10-5)
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '10px' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: '600' }}>Your Name *</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.84rem', fontWeight: '600' }}>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              {orderType === 'delivery' && (
                <>
                  <div className="auto-location-banner">
                    <div className="location-banner-icon">
                      <MapPin size={16} />
                    </div>
                    <div className="location-banner-text">
                      <span className="location-banner-label">Delivery Town</span>
                      <span className="location-banner-value">Narsipatnam Town (Local Delivery)</span>
                    </div>
                    <button
                      type="button"
                      className="location-banner-change"
                      onClick={handleDetectLocation}
                      disabled={isLocating}
                    >
                      <Compass size={12} className={isLocating ? 'spin-icon' : ''} />
                      {isLocating ? 'Pinning...' : (gpsCoords ? '✓ GPS Pinned' : '📍 Add GPS Pin')}
                    </button>
                  </div>

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
                    <label style={{ fontSize: '0.84rem', fontWeight: '600' }}>House / Door No & Street Details *</label>
                    <input
                      type="text"
                      placeholder="e.g. Door No 4-12, Main Road, Beside SBI ATM"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      required
                    />
                  </div>
                  {locError && (
                    <span style={{ fontSize: '0.75rem', color: '#e11d48', marginBottom: '8px', display: 'block' }}>{locError}</span>
                  )}
                </>
              )}

              <div className="form-group">
                <label style={{ fontSize: '0.84rem', fontWeight: '600' }}>Requested Timing</label>
                <select value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)}>
                  <option value="As soon as possible">As Soon As Possible (Within 30 mins)</option>
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
              <Send size={18} /> Place Order via WhatsApp →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
