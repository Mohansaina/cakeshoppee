"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, MapPin, Compass } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const NARSIPATNAM_AREAS = [
  "Near Abes Centre",
  "Beside Himalaya Juice Center",
  "Near RTC Bus Stand",
  "Peddaboddepalli",
  "Balighattam",
  "College Road",
  "Tagarapu Veedhi"
];

export default function CartDrawer() {
  const { cartItems = [], isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, cartTotal = 0 } = useCart();
  
  const [orderType, setOrderType] = useState('takeaway'); // 'takeaway' or 'delivery'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('As soon as possible');

  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [gpsCoords, setGpsCoords] = useState(null);

  // Automatically fetch customer location when opening cart drawer / switching to delivery
  useEffect(() => {
    if (isCartOpen && orderType === 'delivery' && !deliveryAddress && !isLocating) {
      handleDetectLocation();
    }
  }, [isCartOpen, orderType]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setGpsCoords({ lat: latitude, lon: longitude });

        let address = '';

        // Provider 1: BigDataCloud Reverse Geocoding (Client-Side, Highly Accurate in India)
        try {
          const bdcRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const bdcData = await bdcRes.json();

          if (bdcData) {
            const locality = bdcData.locality || bdcData.city || bdcData.principalSubdivision;
            const subLocality = bdcData.localityInfo?.informative?.find(i => i.order === 4 || i.order === 5)?.name || '';
            const city = bdcData.city || 'Narsipatnam';
            const postcode = bdcData.postcode ? `PIN: ${bdcData.postcode}` : '';

            const parts = [subLocality, locality, city, postcode].filter(Boolean);
            if (parts.length > 0) {
              address = parts.join(', ');
            }
          }
        } catch (e) {
          // Ignore & fallback
        }

        // Provider 2: Nominatim OpenStreetMap Fallback
        if (!address) {
          try {
            const osmRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const osmData = await osmRes.json();
            if (osmData && osmData.address) {
              const parts = [
                osmData.address.road || osmData.address.suburb || osmData.address.neighbourhood,
                osmData.address.village || osmData.address.town || osmData.address.city || 'Narsipatnam',
                osmData.address.postcode ? `PIN: ${osmData.address.postcode}` : ''
              ].filter(Boolean);
              address = parts.join(', ');
            }
          } catch (e) {
            // Ignore & fallback
          }
        }

        // Final fallback to GPS coordinates
        if (!address) {
          address = `Narsipatnam Area (GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        }

        setDeliveryAddress(address);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocError('Location permission denied. Select your Narsipatnam area below.');
        } else {
          setLocError('GPS signal weak. Pick your area below or type address.');
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
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
      text += `📍 *Delivery Address:* ${deliveryAddress}\n`;
      if (gpsCoords) {
        text += `🗺️ *Live GPS Maps Link:* https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lon}\n`;
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
                <div className="auto-location-banner">
                  <div className="location-banner-icon">
                    <MapPin size={16} className={isLocating ? 'spin-icon' : ''} />
                  </div>
                  <div className="location-banner-text">
                    <span className="location-banner-label">Delivering To</span>
                    <span className="location-banner-value">
                      {isLocating ? 'Detecting live location...' : (deliveryAddress || 'Detecting location...')}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="location-banner-change"
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                  >
                    {isLocating ? '...' : 'Refresh'}
                  </button>
                </div>
              )}

              {orderType === 'delivery' && (
                <div className="form-group">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: '600' }}>Delivery Address & Landmark *</label>
                    <button
                      type="button"
                      className="detect-loc-btn"
                      onClick={handleDetectLocation}
                      disabled={isLocating}
                    >
                      <Compass size={12} className={isLocating ? 'spin-icon' : ''} />
                      {isLocating ? 'Detecting Location...' : '📍 Auto-Detect Location'}
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="House no, Street, Landmark in Narsipatnam"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                  ></textarea>

                  {/* 1-Tap Narsipatnam Local Area Selector */}
                  <div className="narsipatnam-areas-list">
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600', width: '100%' }}>
                      Quick Narsipatnam Area Select:
                    </span>
                    {NARSIPATNAM_AREAS.map((area) => (
                      <button
                        key={area}
                        type="button"
                        className="area-pill-btn"
                        onClick={() => {
                          setDeliveryAddress((prev) => {
                            if (!prev) return `${area}, Narsipatnam`;
                            if (prev.includes(area)) return prev;
                            return `${area}, ${prev}`;
                          });
                        }}
                      >
                        + {area}
                      </button>
                    ))}
                  </div>

                  {locError && (
                    <span style={{ fontSize: '0.75rem', color: '#e11d48', marginTop: '4px', display: 'block' }}>{locError}</span>
                  )}
                </div>
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
