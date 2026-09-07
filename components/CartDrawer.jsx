"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, Printer } from 'lucide-react';
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

  const [isEgglessRequested, setIsEgglessRequested] = useState(false);

  const deliveryCharge = orderType === 'delivery' ? 50 : 0;
  const egglessFee = isEgglessRequested ? 100 : 0;
  const grandTotalWithDelivery = cartTotal + deliveryCharge + egglessFee;

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

    if (isEgglessRequested) {
      text += `🌱 *Eggless Special:* 100% Pure Eggless (+₹100)\n`;
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
    text += `📦 *Items Subtotal:* ₹${cartTotal}\n`;
    if (isEgglessRequested) {
      text += `🌱 *Eggless Extra Charge:* +₹100\n`;
    }
    text += `🚚 *Delivery Charge:* ${orderType === 'delivery' ? `₹50` : 'FREE (Counter Takeaway)'}\n`;
    text += `💰 *TOTAL PAYABLE:* ₹${grandTotalWithDelivery}\n`;
    text += `------------------------------------\n`;
    if (orderType === 'delivery') {
      text += `📍 *Tip:* Tap the '+' button in this WhatsApp chat to share your Live Location pin!\n`;
    }
    text += `Please confirm my order and send UPI payment details.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/917660948403?text=${encoded}`, '_blank');
  };

  const handlePrintReceipt = () => {
    if (cartItems.length === 0) return;
    const printWin = window.open('', '_blank', 'width=450,height=600');
    if (!printWin) return;
    
    const itemsHtml = cartItems.map((item, idx) => `
      <tr>
        <td style="padding:6px 0; border-bottom:1px dashed #eee;">${idx+1}. ${item.name} (${item.weight || 'Std'})</td>
        <td style="padding:6px 0; border-bottom:1px dashed #eee; text-align:center;">x${item.quantity}</td>
        <td style="padding:6px 0; border-bottom:1px dashed #eee; text-align:right;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cake Shopee - Order Receipt</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; width: 320px; margin: 0 auto; padding: 15px; color: #000; }
            h2 { text-align: center; margin: 0 0 5px 0; font-size: 20px; }
            p { text-align: center; margin: 0 0 10px 0; font-size: 11px; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            table { width: 100%; font-size: 12px; border-collapse: collapse; }
            .total { font-weight: bold; font-size: 16px; margin-top: 10px; text-align: right; }
            .footer-msg { text-align: center; font-size: 11px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <h2>CAKE SHOPEE</h2>
          <p>📍 Near Abes Centre, Beside Himalaya Juice Center<br>Narsipatnam Main Road | 📞 7660948403</p>
          <div class="divider"></div>
          <div style="font-size:12px; margin-bottom:8px;">
            <strong>Order #:</strong> CS-${Date.now().toString().slice(-6)}<br>
            <strong>Date:</strong> ${new Date().toLocaleString()}<br>
            <strong>Type:</strong> ${orderType === 'delivery' ? 'DOOR DELIVERY' : 'COUNTER TAKEAWAY'}<br>
            <strong>Customer:</strong> ${customerName || 'Walk-in Customer'}<br>
            <strong>Phone:</strong> ${customerPhone || 'N/A'}<br>
            ${isEgglessRequested ? `<strong>Diet:</strong> 100% PURE EGGLESS (+₹100)<br>` : ''}
            ${orderType === 'delivery' ? `<strong>Address:</strong> ${selectedArea}, ${streetAddress}<br>` : ''}
            ${cakeMessage ? `<strong>Cake Text:</strong> "${cakeMessage}"<br>` : ''}
          </div>
          <div class="divider"></div>
          <table>
            <thead>
              <tr style="text-align:left; border-bottom:1px solid #000;">
                <th>Item</th>
                <th style="text-align:center;">Qty</th>
                <th style="text-align:right;">Amt</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="divider"></div>
          <div style="font-size:12px; margin-top:6px;">
            <div style="display:flex; justify-content:space-between;"><span>Items Subtotal:</span><span>₹${cartTotal}</span></div>
            ${isEgglessRequested ? `<div style="display:flex; justify-content:space-between;"><span>Eggless Fee:</span><span>+ ₹100</span></div>` : ''}
            <div style="display:flex; justify-content:space-between;"><span>Delivery Fee (${orderType === 'delivery' ? 'Local' : 'Takeaway'}):</span><span>${orderType === 'delivery' ? `₹50` : 'FREE'}</span></div>
          </div>
          <div class="divider"></div>
          <div class="total">TOTAL PAYABLE: ₹${grandTotalWithDelivery}</div>
          <div class="divider"></div>
          <div class="footer-msg">Thank you for ordering with Cake Shopee!<br>Freshly Baked with ❤️ in Narsipatnam</div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
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
                    🚚 Door Delivery (+₹50)
                  </button>
                  <button
                    type="button"
                    className={`order-type-btn ${orderType === 'takeaway' ? 'active' : ''}`}
                    onClick={() => setOrderType('takeaway')}
                  >
                    🛍️ Counter Takeaway (FREE)
                  </button>
                </div>
              </div>

              {/* Eggless Option Toggle Box */}
              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fff1f2', border: '1px solid #fda4af', borderRadius: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', fontWeight: '700', color: '#e11d48' }}>
                  <input
                    type="checkbox"
                    checked={isEgglessRequested}
                    onChange={(e) => setIsEgglessRequested(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#e11d48' }}
                  />
                  <span>🌱 Prepare Cake 100% Eggless (+₹100)</span>
                </label>
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
              <span>Items Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
              <span>₹{cartTotal}</span>
            </div>

            {isEgglessRequested && (
              <div className="cart-summary-row" style={{ fontSize: '0.86rem', color: '#e11d48', fontWeight: '600' }}>
                <span>Eggless Charge</span>
                <span>+ ₹100</span>
              </div>
            )}
            
            <div className="cart-summary-row" style={{ fontSize: '0.86rem', color: orderType === 'delivery' ? '#15803d' : '#64748b', fontWeight: '600' }}>
              <span>Delivery Fee ({orderType === 'delivery' ? 'Local Narsipatnam' : 'Takeaway'})</span>
              <span>{orderType === 'delivery' ? `+ ₹${deliveryCharge}` : 'FREE (₹0)'}</span>
            </div>

            <div className="cart-total-row">
              <span>Total Payable Amount</span>
              <span>₹{grandTotalWithDelivery}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
              <button
                className="btn btn-secondary"
                onClick={handlePrintReceipt}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', padding: '12px 10px' }}
              >
                <Printer size={16} /> Print KOT Slip
              </button>
              
              <button
                className="btn btn-primary"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', padding: '12px 10px' }}
              >
                <Send size={16} /> WhatsApp Order
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
