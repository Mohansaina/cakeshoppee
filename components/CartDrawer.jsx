"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, Trash2, Plus, Minus, Send, ShoppingBag, Printer, 
  AlertCircle, MapPin, Navigation, CheckCircle2, ArrowLeft, ArrowRight,
  Clock, Phone, User, Home, Building2, Compass, ShieldCheck
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

const NARSIPATNAM_AREAS = [
  "Near Abes Centre (Main Road)",
  "Beside Himalaya Juice Center (Main Road)",
  "Near RTC Bus Stand / Complex",
  "Peddaboddepalli Area",
  "Balighattam & Temple Road",
  "Lingarajupeta",
  "College Road / Station Road",
  "Tagarapu Veedhi",
  "Shanti Nagar / Housing Board",
  "Dharmavaram / Kotauratla Road",
  "Other Narsipatnam Locality"
];

export default function CartDrawer() {
  const { 
    cartItems = [], 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal = 0 
  } = useCart();
  
  // Checkout Steps: 'cart' (Step 1) -> 'address' (Step 2)
  const [checkoutStep, setCheckoutStep] = useState('cart');

  const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'takeaway'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  
  // Structured Address fields for accurate delivery in Narsipatnam
  const [selectedArea, setSelectedArea] = useState('Near Abes Centre (Main Road)');
  const [houseNumber, setHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('531116');

  // GPS Location Pin & Reverse-Geocoded Auto-Address
  const [gpsLocation, setGpsLocation] = useState(null); // { lat, lng }
  const [detectedAddress, setDetectedAddress] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [showManualFields, setShowManualFields] = useState(false);

  // Quick 1-Tap Narsipatnam Popular Spots
  const QUICK_SPOTS = [
    { label: "🏢 RTC Complex", area: "Near RTC Bus Stand / Complex", street: "Bus Stand Road", landmark: "Near RTC Main Gate" },
    { label: "🛍️ Abes Centre / Main Rd", area: "Near Abes Centre (Main Road)", street: "Main Road", landmark: "Near Abes Centre / Beside Himalaya Juice" },
    { label: "🏥 Area Hospital", area: "Other Narsipatnam Locality", street: "Hospital Road", landmark: "Near Area Hospital" },
    { label: "🛕 Sai Baba Temple", area: "Balighattam & Temple Road", street: "Temple Road", landmark: "Near Shirdi Sai Temple" },
    { label: "🎓 College Road", area: "College Road / Station Road", street: "College Road", landmark: "Near Govt Degree College" },
    { label: "🏘️ Pedaboddepalli", area: "Peddaboddepalli Area", street: "Peddaboddepalli Main Road", landmark: "Near Pedaboddepalli Junction" },
    { label: "🌿 Balighattam", area: "Balighattam & Temple Road", street: "Balighattam Road", landmark: "Near Varaha River / Temple" }
  ];

  // Additional order details
  const [cakeMessage, setCakeMessage] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('As soon as possible');
  const [validationError, setValidationError] = useState('');

  // Restore saved customer profile from localStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('cs_customer_profile');
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        if (p.name) setCustomerName(p.name);
        if (p.phone) setCustomerPhone(p.phone);
        if (p.altPhone) setAltPhone(p.altPhone);
        if (p.area) setSelectedArea(p.area);
        if (p.houseNumber) setHouseNumber(p.houseNumber);
        if (p.streetName) setStreetName(p.streetName);
        if (p.landmark) setLandmark(p.landmark);
        if (p.pincode) setPincode(p.pincode);
      }
    } catch (e) {
      console.warn('Could not read saved profile:', e);
    }
  }, []);

  // Auto-save customer address to localStorage
  const saveProfileToLocalStorage = () => {
    try {
      const profile = {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        altPhone: altPhone.trim(),
        area: selectedArea,
        houseNumber: houseNumber.trim(),
        streetName: streetName.trim(),
        landmark: landmark.trim(),
        pincode: pincode.trim() || '531116'
      };
      localStorage.setItem('cs_customer_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not save profile:', e);
    }
  };

  const deliveryCharge = orderType === 'delivery' ? 50 : 0;
  const grandTotalWithDelivery = cartTotal + deliveryCharge;

  if (!isCartOpen) return null;

  // Handle GPS location auto-detect & reverse-geocoding address fetch
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingGps(true);
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setGpsLocation({ lat: latitude, lng: longitude });

        // Reverse-geocode coordinates to fetch human-readable address
        try {
          let fetchedAddr = '';
          let fetchedStreet = '';
          let fetchedArea = '';
          let fetchedPostcode = '531116';

          // Try OpenStreetMap Nominatim reverse geocoding
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
            if (res.ok) {
              const data = await res.json();
              if (data && data.address) {
                const a = data.address;
                fetchedStreet = a.road || a.residential || a.suburb || a.neighbourhood || a.village || '';
                fetchedArea = a.suburb || a.residential || a.town || a.county || 'Narsipatnam';
                fetchedPostcode = a.postcode || '531116';
                fetchedAddr = data.display_name ? data.display_name.split(',').slice(0, 4).join(', ') : `${fetchedStreet}, ${fetchedArea}, Narsipatnam`;
              }
            }
          } catch (e) {
            console.warn('Nominatim reverse geocode error, trying fallback:', e);
          }

          // Fallback to BigDataCloud client API if Nominatim was blocked or failed
          if (!fetchedAddr) {
            try {
              const res2 = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
              if (res2.ok) {
                const data2 = await res2.json();
                fetchedStreet = data2.locality || data2.principalSubdivision || '';
                fetchedArea = data2.city || 'Narsipatnam';
                fetchedAddr = `${data2.locality || ''}, ${data2.city || 'Narsipatnam'}, ${data2.principalSubdivision || 'AP'}`;
              }
            } catch (e2) {
              console.warn('BigDataCloud reverse geocode fallback error:', e2);
            }
          }

          if (fetchedAddr) {
            setDetectedAddress(fetchedAddr);
            if (fetchedStreet && (!streetName || !streetName.trim())) {
              setStreetName(fetchedStreet);
            }
            if (fetchedPostcode) {
              setPincode(fetchedPostcode);
            }
            // Auto-select matching area or set landmark
            if (!landmark || !landmark.trim()) {
              setLandmark(`Near GPS Pin (${fetchedStreet || 'Auto-detected'})`);
            }
            if (!houseNumber || !houseNumber.trim()) {
              setHouseNumber('My Current Location');
            }
          } else {
            setDetectedAddress(`GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (Narsipatnam)`);
            if (!landmark) setLandmark('Attached GPS Location Pin');
            if (!houseNumber) setHouseNumber('My Current Location');
            if (!streetName) setStreetName('Narsipatnam');
          }
        } catch (err) {
          console.warn('Failed to parse reverse geocoded address:', err);
          setDetectedAddress(`GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (Narsipatnam)`);
        } finally {
          setIsDetectingGps(false);
          if (validationError) setValidationError('');
        }
      },
      (error) => {
        setIsDetectingGps(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('Location permission denied. You can tap any of the quick localities below!');
        } else {
          setGpsError('Could not fetch exact GPS. Please tap one of the quick localities below.');
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Quick 1-tap select for popular Narsipatnam spots (zero typing needed)
  const handleSelectQuickSpot = (spot) => {
    setSelectedArea(spot.area);
    setStreetName(spot.street);
    setLandmark(spot.landmark);
    setDetectedAddress(`${spot.label}: ${spot.street}, ${spot.area}`);
    if (!houseNumber || !houseNumber.trim()) {
      setHouseNumber('Near ' + spot.landmark);
    }
    if (validationError) setValidationError('');
  };

  // Proceed from Cart to Address step
  const handleProceedToAddress = () => {
    if (cartItems.length === 0) return;
    setValidationError('');
    setCheckoutStep('address');
  };

  // Final Order Validation & WhatsApp submission
  const handleCheckout = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) return;

    // Validate required fields
    const missing = [];
    if (!customerName || customerName.trim() === '') {
      missing.push('Your Full Name');
    }
    const cleanPhone = (customerPhone || '').replace(/\D/g, '');
    if (!customerPhone || cleanPhone.length < 10) {
      missing.push('10-digit WhatsApp Mobile Number');
    }
    
    if (orderType === 'delivery') {
      const hasAutoAddress = detectedAddress || gpsLocation;
      
      // If customer has not auto-detected and not typed manual fields, prompt for address
      if (!hasAutoAddress) {
        if (!houseNumber || houseNumber.trim() === '') {
          missing.push('House / Flat / Door No.');
        }
        if (!streetName || streetName.trim() === '') {
          missing.push('Street / Colony Name');
        }
      }
    }

    if (missing.length > 0) {
      setValidationError(`⚠️ Please complete: ${missing.join(', ')}.`);
      return;
    }

    setValidationError('');
    saveProfileToLocalStorage();

    const finalHouseNumber = houseNumber && houseNumber.trim() ? houseNumber.trim() : (detectedAddress ? 'Deliver to Detected Location' : 'Near Main Road');
    const finalStreet = streetName && streetName.trim() ? streetName.trim() : (detectedAddress || 'Narsipatnam');
    const finalLandmark = landmark && landmark.trim() ? landmark.trim() : (gpsLocation ? 'Live GPS Pin Attached' : 'Narsipatnam');

    // Construct beautiful formatted WhatsApp message
    let text = `🛍️ *NEW ORDER - CAKE SHOPPEE NARSIPATNAM*\n`;
    text += `════════════════════════════════════\n`;
    text += `👤 *Customer Name:* ${customerName.trim()}\n`;
    text += `📞 *Primary Mobile:* ${customerPhone.trim()}\n`;
    if (altPhone && altPhone.trim()) {
      text += `📞 *Alternate Phone:* ${altPhone.trim()}\n`;
    }
    text += `🚚 *Order Type:* ${orderType === 'delivery' ? 'Local Door Delivery' : 'Shop Takeaway Pickup'}\n`;
    
    if (orderType === 'delivery') {
      text += `\n📍 *DELIVERY ADDRESS:*\n`;
      text += `🏠 *House/Door/Flat:* ${finalHouseNumber}\n`;
      text += `🛣️ *Street/Colony:* ${finalStreet}\n`;
      text += `🏛️ *Locality:* ${selectedArea}\n`;
      text += `🚩 *Landmark:* ${finalLandmark}\n`;
      text += `📮 *Pin Code:* ${pincode.trim() || '531116'}\n`;
      if (detectedAddress) {
        text += `✨ *Auto-Fetched Location:* ${detectedAddress}\n`;
      }
      if (gpsLocation) {
        text += `🗺️ *Live GPS Pin:* https://maps.google.com/?q=${gpsLocation.lat},${gpsLocation.lng}\n`;
      }
    } else {
      text += `\n🏪 *Pickup Location:* Cake Shoppee Counter, Near Abes Centre, beside Himalaya Juice Center, Main Road, Narsipatnam.\n`;
    }

    if (cakeMessage && cakeMessage.trim()) {
      text += `🎂 *Message on Cake:* "${cakeMessage.trim()}"\n`;
    }
    
    text += `⏰ *Requested Timing:* ${deliveryTime}\n`;
    text += `════════════════════════════════════\n`;
    text += `📋 *ITEMS ORDERED:*\n`;

    cartItems.forEach((item, index) => {
      const dietNote = item.egglessTag ? ` [${item.eggless ? '🌱 100% Eggless' : '🥚 Regular'}]` : '';
      text += `${index + 1}. ${item.name} (${item.weight || 'Std'})${dietNote} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });

    text += `════════════════════════════════════\n`;
    text += `📦 *Items Subtotal:* ₹${cartTotal}\n`;
    text += `🚚 *Delivery Charge:* ${orderType === 'delivery' ? `₹50` : 'FREE (Takeaway)'}\n`;
    text += `💰 *TOTAL PAYABLE:* ₹${grandTotalWithDelivery}\n`;
    text += `════════════════════════════════════\n`;
    text += `Please confirm my order and send UPI QR / payment details for verification.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/917660948403?text=${encoded}`, '_blank');
  };

  // Thermal Receipt Generator
  const handlePrintReceipt = () => {
    if (cartItems.length === 0) return;
    const printWin = window.open('', '_blank', 'width=450,height=650');
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
          <title>Cake Shoppee - Order KOT</title>
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
          <h2>CAKE SHOPPEE</h2>
          <p>📍 Near Abes Centre, Beside Himalaya Juice Center<br>Narsipatnam Main Road | 📞 7660948403</p>
          <div class="divider"></div>
          <div style="font-size:12px; margin-bottom:8px;">
            <strong>Order #:</strong> CS-${Date.now().toString().slice(-6)}<br>
            <strong>Date:</strong> ${new Date().toLocaleString()}<br>
            <strong>Type:</strong> ${orderType === 'delivery' ? 'DOOR DELIVERY' : 'COUNTER TAKEAWAY'}<br>
            <strong>Customer:</strong> ${customerName || 'Customer'}<br>
            <strong>Phone:</strong> ${customerPhone || 'N/A'}<br>
            ${orderType === 'delivery' ? `<strong>Address:</strong> ${houseNumber || 'Door Delivery'}, ${streetName || ''}, ${selectedArea} ${landmark ? `(Landmark: ${landmark})` : ''} ${detectedAddress ? `<br><strong>Detected:</strong> ${detectedAddress}` : ''}<br>` : ''}
            ${gpsLocation ? `<strong>GPS Pin:</strong> Attached<br>` : ''}
            ${cakeMessage ? `<strong>Cake Text:</strong> "${cakeMessage}"<br>` : ''}
          </div>
          <div class="divider"></div>
          <table>
            <thead>
              <tr style="text-align:left; border-bottom:1px solid #000;">
                <th>Item</th>
                <th style="text-align:center;">Qty</th>
                <th style="text-align:right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="divider"></div>
          <div style="font-size:12px; text-align:right;">Subtotal: ₹${cartTotal}</div>
          ${orderType === 'delivery' ? `<div style="font-size:12px; text-align:right;">Delivery Fee: ₹50</div>` : ''}
          <div class="total">Total: ₹${grandTotalWithDelivery}</div>
          <div class="divider"></div>
          <div class="footer-msg">Thank you for ordering with Cake Shoppee Narsipatnam!</div>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
    }, 400);
  };

  return (
    <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <div 
        className="cart-drawer" 
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        
        {/* Drawer Header with Step Indicator */}
        <div className="cart-drawer-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {checkoutStep === 'address' && (
                <button
                  onClick={() => { setCheckoutStep('cart'); setValidationError(''); }}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  title="Back to cart items"
                >
                  <ArrowLeft size={16} color="#0f172a" />
                </button>
              )}
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {checkoutStep === 'cart' ? 'Your Fresh Cart' : 'Delivery Details'}
              </h3>
            </div>
            
            {/* Step Progress Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <span style={{ 
                fontSize: '0.74rem', 
                fontWeight: 700, 
                padding: '2px 8px', 
                borderRadius: '999px',
                background: checkoutStep === 'cart' ? '#ea580c' : '#16a34a',
                color: '#ffffff'
              }}>
                {checkoutStep === 'cart' ? 'Step 1 of 2: Cart Items' : 'Step 2 of 2: Address & Place Order'}
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
              </span>
            </div>
          </div>

          <button 
            className="close-drawer-btn" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} color="#64748b" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="cart-drawer-body" style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
          
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <ShoppingBag size={54} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ color: '#334155', fontWeight: 700, marginBottom: '6px' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>Explore our cool cakes, fast-food savouries & celebration combos.</p>
              <button 
                className="btn btn-primary"
                onClick={() => setIsCartOpen(false)}
                style={{ padding: '10px 20px', fontSize: '0.88rem' }}
              >
                Browse Our Menu
              </button>
            </div>
          ) : checkoutStep === 'cart' ? (
            
            /* ========================================================
               STEP 1: CART ITEMS & PREPARATION PREFERENCES
               ======================================================== */
            <>
              {/* Order Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <div className="cart-item-img" style={{ width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', position: 'relative', flexShrink: 0, background: '#f8fafc' }}>
                      <Image
                        src={item.image || '/images/cakes/vanilla-cool-cake.jpg'}
                        alt={item.name}
                        fill
                        sizes="56px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                        {item.weight || 'Standard'} • <strong style={{ color: '#ea580c' }}>₹{item.price}</strong>
                      </p>
                      {item.egglessTag && (
                        <div style={{ marginTop: '3px' }}>
                          <span style={{
                            display: 'inline-block',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: item.eggless ? '#15803d' : '#475569',
                            background: item.eggless ? '#dcfce7' : '#f1f5f9',
                            border: `1px solid ${item.eggless ? '#bbf7d0' : '#e2e8f0'}`,
                            padding: '1px 6px',
                            borderRadius: '4px'
                          }}>
                            {item.egglessTag}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ background: 'transparent', border: 'none', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} color="#475569" />
                      </button>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, minWidth: '22px', textAlign: 'center', color: '#0f172a' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ background: 'transparent', border: 'none', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} color="#475569" />
                      </button>
                    </div>

                    {/* Item Total & Remove */}
                    <div style={{ textAlign: 'right', minWidth: '55px' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                        ₹{item.price * item.quantity}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px', marginTop: '2px' }}
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery vs Takeaway Quick Selector */}
              <div style={{ marginTop: '16px' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                  How would you like to receive your order?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '10px',
                      border: orderType === 'delivery' ? '2px solid #ea580c' : '1px solid #cbd5e1',
                      background: orderType === 'delivery' ? '#fff7ed' : '#ffffff',
                      color: orderType === 'delivery' ? '#c2410c' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>🚚 Door Delivery</span>
                    <span style={{ fontSize: '0.74rem', color: '#ea580c' }}>+₹50 Local Fee</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '10px',
                      border: orderType === 'takeaway' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                      background: orderType === 'takeaway' ? '#f0fdf4' : '#ffffff',
                      color: orderType === 'takeaway' ? '#15803d' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>🏪 Shop Takeaway</span>
                    <span style={{ fontSize: '0.74rem', color: '#16a34a' }}>FREE (No Fee)</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            
            /* ========================================================
               STEP 2: EASY & ACCURATE DELIVERY ADDRESS FORM
               ======================================================== */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Validation Warning Alert */}
              {validationError && (
                <div style={{
                  padding: '10px 14px',
                  background: '#fef2f2',
                  border: '1.5px solid #fecaca',
                  borderRadius: '10px',
                  color: '#b91c1c',
                  fontSize: '0.84rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Order Mode Banner */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: orderType === 'delivery' ? '#fff7ed' : '#f0fdf4',
                border: `1px solid ${orderType === 'delivery' ? '#fed7aa' : '#bbf7d0'}`,
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} color={orderType === 'delivery' ? '#ea580c' : '#16a34a'} />
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                      {orderType === 'delivery' ? 'Local Door Delivery' : 'Shop Takeaway Pickup'}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {orderType === 'delivery' ? 'Delivered directly to your house in Narsipatnam' : 'Pickup at Cake Shoppee, Near Abes Centre'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOrderType(orderType === 'delivery' ? 'takeaway' : 'delivery')}
                  style={{ background: 'transparent', border: 'none', color: '#ea580c', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Change
                </button>
              </div>

              {/* Delivery Address Section (Only for Delivery) */}
              {orderType === 'delivery' && (
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Home size={16} color="#ea580c" /> Delivery Address
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: '999px' }}>
                      Narsipatnam Town
                    </span>
                  </div>

                  {/* 1-Tap Auto-Fetch Location Button */}
                  <div style={{ marginBottom: '14px' }}>
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      disabled={isDetectingGps}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: detectedAddress || gpsLocation ? '#ecfdf5' : '#ea580c',
                        border: detectedAddress || gpsLocation ? '1.5px solid #10b981' : 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        color: detectedAddress || gpsLocation ? '#065f46' : '#ffffff',
                        boxShadow: detectedAddress || gpsLocation ? 'none' : '0 2px 8px rgba(234, 88, 12, 0.25)',
                        transition: 'all 0.2s ease',
                        touchAction: 'manipulation'
                      }}
                    >
                      {isDetectingGps ? (
                        <>
                          <Compass className="animate-spin" size={18} /> Fetching your exact address & GPS...
                        </>
                      ) : detectedAddress || gpsLocation ? (
                        <>
                          <CheckCircle2 size={18} color="#059669" /> Exact Location Fetched!
                        </>
                      ) : (
                        <>
                          <Navigation size={18} /> 📍 Auto-Fetch My Current Location
                        </>
                      )}
                    </button>

                    {gpsError && (
                      <p style={{ margin: '6px 0 0 0', fontSize: '0.76rem', color: '#ef4444', fontWeight: 600 }}>{gpsError}</p>
                    )}
                  </div>

                  {/* Live Auto-Fetched Address Card (Customer can see perfectly) */}
                  {(detectedAddress || gpsLocation) && (
                    <div style={{
                      background: '#ffffff',
                      border: '1.5px solid #a7f3d0',
                      borderRadius: '10px',
                      padding: '12px',
                      marginBottom: '14px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} color="#059669" /> VERIFIED LOCATION
                        </span>
                        {gpsLocation && (
                          <a
                            href={`https://maps.google.com/?q=${gpsLocation.lat},${gpsLocation.lng}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 700, textDecoration: 'underline' }}
                          >
                            🗺️ Open in Google Maps
                          </a>
                        )}
                      </div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>
                        {detectedAddress || 'GPS Pin Attached (Narsipatnam)'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Rider gets direct 1-tap navigation to your door.
                        </span>
                        <button
                          type="button"
                          onClick={handleDetectGPS}
                          style={{ background: 'transparent', border: 'none', color: '#059669', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          🔄 Refresh
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 1-Tap Quick Locality Chips for Narsipatnam */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      ⚡ Or choose your nearby spot (1-Tap Auto Fill):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {QUICK_SPOTS.map((spot) => (
                        <button
                          key={spot.label}
                          type="button"
                          onClick={() => handleSelectQuickSpot(spot)}
                          style={{
                            padding: '6px 10px',
                            background: selectedArea === spot.area ? '#fff7ed' : '#ffffff',
                            border: selectedArea === spot.area ? '1.5px solid #ea580c' : '1px solid #cbd5e1',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: selectedArea === spot.area ? 700 : 600,
                            color: selectedArea === spot.area ? '#c2410c' : '#334155',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {spot.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* House / Flat / Door Number (The only typing needed!) */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      House / Flat / Door / Shop No. <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>(e.g. Flat 201, D.No 4-22, or Shop Name)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 201 / Door No. 4-22 / Near Landmark"
                      value={houseNumber}
                      onChange={(e) => {
                        setHouseNumber(e.target.value);
                        if (validationError) setValidationError('');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: validationError && (!houseNumber || !houseNumber.trim()) && !detectedAddress && !gpsLocation ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                        fontSize: '0.86rem',
                        background: '#ffffff'
                      }}
                    />
                  </div>

                  {/* Toggle to view/edit full manual fields */}
                  <div style={{ textAlign: 'center', margin: '4px 0' }}>
                    <button
                      type="button"
                      onClick={() => setShowManualFields(!showManualFields)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      {showManualFields ? '▲ Hide detailed address fields' : '▼ Need to change street or landmark manually? Tap here'}
                    </button>
                  </div>

                  {/* Collapsible Manual Fields */}
                  {showManualFields && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      
                      {/* Area Dropdown */}
                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                          Locality / Area
                        </label>
                        <select
                          value={selectedArea}
                          onChange={(e) => setSelectedArea(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '9px 10px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.84rem',
                            fontWeight: 600,
                            color: '#1e293b',
                            background: '#ffffff'
                          }}
                        >
                          {NARSIPATNAM_AREAS.map((area) => (
                            <option key={area} value={area}>📍 {area}</option>
                          ))}
                        </select>
                      </div>

                      {/* Street / Colony */}
                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                          Street / Colony
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Tagarapu Street / Behind Municipal Office"
                          value={streetName}
                          onChange={(e) => setStreetName(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '9px 10px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.84rem',
                            background: '#ffffff'
                          }}
                        />
                      </div>

                      {/* Landmark & Pincode */}
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                            Nearby Landmark
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Opposite SBI ATM"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '9px 10px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.84rem',
                              background: '#ffffff'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                            Pin Code
                          </label>
                          <input
                            type="text"
                            placeholder="531116"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '9px 10px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.84rem',
                              fontWeight: 600,
                              textAlign: 'center',
                              background: '#ffffff'
                            }}
                          />
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* Customer Contact Information */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <User size={16} color="#ea580c" /> Customer Contact Details
                </span>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Your Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: validationError && (!customerName || !customerName.trim()) ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                      fontSize: '0.86rem',
                      background: '#ffffff'
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      WhatsApp Number <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (validationError) setValidationError('');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: validationError && (!customerPhone || customerPhone.replace(/\D/g, '').length < 10) ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                        fontSize: '0.86rem',
                        background: '#ffffff'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Alt. Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="Secondary number"
                      value={altPhone}
                      onChange={(e) => setAltPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.86rem',
                        background: '#ffffff'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Special Cake Message & Delivery Timing */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Custom Message to Pipe on Cake (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Happy Birthday Rakesh!"
                    value={cakeMessage}
                    onChange={(e) => setCakeMessage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.86rem',
                      background: '#ffffff'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Preferred Timing
                  </label>
                  <select
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: '#1e293b',
                      background: '#ffffff'
                    }}
                  >
                    <option value="As soon as possible">As Soon As Possible (Within 30–45 mins)</option>
                    <option value="Today Evening (4:00 PM – 6:00 PM)">Today Evening (4:00 PM – 6:00 PM)</option>
                    <option value="Today Night (7:00 PM – 9:30 PM)">Today Night (7:00 PM – 9:30 PM)</option>
                    <option value="Tomorrow Morning (10:00 AM – 1:00 PM)">Tomorrow Morning (10:00 AM – 1:00 PM)</option>
                    <option value="Tomorrow Evening (4:00 PM – 8:00 PM)">Tomorrow Evening (4:00 PM – 8:00 PM)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#16a34a', justifyContent: 'center' }}>
                <ShieldCheck size={14} /> Your address details are safely saved on this device for instant 1-tap reordering!
              </div>

            </div>
          )}

        </div>

        {/* Footer with Step-Specific Actions */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer" style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            
            {/* Price Breakdown */}
            <div className="cart-summary-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#64748b', marginBottom: '4px' }}>
              <span>Items Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
              <span>₹{cartTotal}</span>
            </div>
            
            <div className="cart-summary-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: orderType === 'delivery' ? '#ea580c' : '#16a34a', fontWeight: '600', marginBottom: '8px' }}>
              <span>{orderType === 'delivery' ? 'Local Narsipatnam Delivery Fee' : 'Store Takeaway Pickup'}</span>
              <span>{orderType === 'delivery' ? `+ ₹${deliveryCharge}` : 'FREE (₹0)'}</span>
            </div>

            <div className="cart-total-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', paddingTop: '6px', borderTop: '1px dashed #cbd5e1', marginBottom: '12px' }}>
              <span>Total Payable</span>
              <span style={{ color: '#ea580c' }}>₹{grandTotalWithDelivery}</span>
            </div>

            {/* Step Action Buttons */}
            {checkoutStep === 'cart' ? (
              <button
                className="btn-primary btn-block"
                onClick={handleProceedToAddress}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '12px',
                  touchAction: 'manipulation'
                }}
              >
                <span>Proceed to Delivery Address</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handlePrintReceipt}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '0.84rem',
                    padding: '12px 8px',
                    borderRadius: '10px'
                  }}
                >
                  <Printer size={16} /> Print KOT
                </button>
                
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCheckout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    padding: '12px 10px',
                    borderRadius: '10px',
                    touchAction: 'manipulation'
                  }}
                >
                  <Send size={16} /> Place WhatsApp Order
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}