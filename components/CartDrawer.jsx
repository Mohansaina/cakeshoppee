"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { 
  X, Trash2, Plus, Minus, Send, ShoppingBag, Printer, 
  AlertCircle, MapPin, Navigation, CheckCircle2, ArrowLeft, ArrowRight,
  Clock, Phone, User, Home, Building2, Compass, ShieldCheck, Search, Crosshair
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

const LocationPickerModal = dynamic(() => import('./LocationPickerModal'), { ssr: false });

const BAKERY_COORDS = { lat: 17.66635, lng: 82.61015 };

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round((R * c) * 10) / 10;
}

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
  const [gpsAccuracy, setGpsAccuracy] = useState(null); // in meters
  const [detectedAddress, setDetectedAddress] = useState('');
  const [deliveryDistance, setDeliveryDistance] = useState(null); // in km from bakery
  const [deliveryEta, setDeliveryEta] = useState(null); // e.g. "20-25 mins"
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [showManualFields, setShowManualFields] = useState(false);
  const [showMapPreview, setShowMapPreview] = useState(true);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);

  // Colony & Landmark Live Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Quick 1-Tap Narsipatnam Popular Spots
  const QUICK_SPOTS = [
    { label: "📍 Tagarapu Veedhi", area: "Tagarapu Veedhi", street: "Tagarapu Veedhi", landmark: "Behind Municipal Office", lat: 17.6675, lng: 82.6115, dist: 0.3, eta: "15-20 mins" },
    { label: "🛍️ Abes Centre / Main Rd", area: "Near Abes Centre (Main Road)", street: "Main Road", landmark: "Beside Himalaya Juice Center", lat: 17.66635, lng: 82.61015, dist: 0.1, eta: "15-20 mins" },
    { label: "🏢 RTC Complex", area: "Near RTC Bus Stand / Complex", street: "RTC Complex Road", landmark: "Near RTC Main Gate", lat: 17.6710, lng: 82.6150, dist: 0.9, eta: "20-25 mins" },
    { label: "🏘️ Ayyannapalem", area: "Other Narsipatnam Locality", street: "Ayyannapalem Road", landmark: "Near Ayyannapalem Junction", lat: 17.6660, lng: 82.6090, dist: 0.4, eta: "15-20 mins" },
    { label: "🏥 Area Hospital", area: "Other Narsipatnam Locality", street: "Hospital Road", landmark: "Near Area Hospital", lat: 17.6625, lng: 82.6130, dist: 0.7, eta: "20-25 mins" },
    { label: "🛕 Sai Baba Temple", area: "Balighattam & Temple Road", street: "Temple Road", landmark: "Near Shirdi Sai Temple", lat: 17.6540, lng: 82.6030, dist: 1.6, eta: "25-30 mins" },
    { label: "🎓 College Road", area: "College Road / Station Road", street: "College Road", landmark: "Near Govt Degree College", lat: 17.6740, lng: 82.6080, dist: 1.1, eta: "20-25 mins" },
    { label: "🏘️ Pedaboddepalli", area: "Peddaboddepalli Area", street: "Peddaboddepalli Main Road", landmark: "Near Pedaboddepalli Junction", lat: 17.6820, lng: 82.6200, dist: 2.1, eta: "25-35 mins" },
    { label: "🏡 Shanti Nagar", area: "Shanti Nagar / Housing Board", street: "Shanti Nagar Main Road", landmark: "Near Housing Board Colony", lat: 17.6690, lng: 82.6050, dist: 0.8, eta: "20-25 mins" },
    { label: "🌿 Balighattam", area: "Balighattam & Temple Road", street: "Balighattam Road", landmark: "Near Varaha River", lat: 17.6580, lng: 82.6050, dist: 1.4, eta: "25-30 mins" }
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

  // Handle GPS location auto-detect: Captures 100% exact mobile coordinates & matches nearest colony cleanly
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingGps(true);
    setGpsError('');

    const processPosition = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      setGpsLocation({ lat: latitude, lng: longitude });
      if (accuracy) {
        setGpsAccuracy(Math.round(accuracy));
      }

      // Calculate exact distance from Cake Shoppee bakery
      const dist = getDistanceKm(BAKERY_COORDS.lat, BAKERY_COORDS.lng, latitude, longitude);
      setDeliveryDistance(dist);
      setDeliveryEta(dist <= 1.5 ? '15-20 mins' : dist <= 3 ? '20-25 mins' : '30-40 mins');

      // Find closest verified Narsipatnam colony from our list
      let closestSpot = QUICK_SPOTS[0];
      let minDist = 99999;
      for (const spot of QUICK_SPOTS) {
        const d = getDistanceKm(latitude, longitude, spot.lat, spot.lng);
        if (d < minDist) {
          minDist = d;
          closestSpot = spot;
        }
      }

      // Format clean, human-readable address strictly IN WORDS
      const meters = Math.round(minDist * 1000);
      let wordsAddress = '';
      if (meters <= 180) {
        wordsAddress = (closestSpot.street !== closestSpot.area ? `${closestSpot.street}, ` : '') + `${closestSpot.area}, Narsipatnam`;
      } else if (meters <= 500) {
        wordsAddress = `Near ${closestSpot.landmark}, ${closestSpot.area}, Narsipatnam`;
      } else if (meters <= 1200) {
        wordsAddress = `${closestSpot.area} (~${meters}m from ${closestSpot.landmark}), Narsipatnam`;
      } else {
        wordsAddress = `${closestSpot.area}, Narsipatnam`;
      }

      wordsAddress = wordsAddress.replace(/Tagarapu Veedhi, Tagarapu Veedhi/g, 'Tagarapu Veedhi');
      wordsAddress = wordsAddress.replace(/Lingarajupeta, Lingarajupeta/g, 'Lingarajupeta');
      wordsAddress = wordsAddress.replace(/Near Abes Centre \(Main Road\)/g, 'Abes Centre, Main Road');

      // Set clean words address immediately
      setDetectedAddress(wordsAddress);
      setSelectedArea(closestSpot.area);
      if (!streetName || !streetName.trim()) {
        setStreetName(closestSpot.street);
      }
      if (!landmark || !landmark.trim()) {
        setLandmark(closestSpot.landmark);
      }
      if (!houseNumber || !houseNumber.trim()) {
        setHouseNumber('Near ' + closestSpot.landmark);
      }

      // Background refinement via server geocoder API
      fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.wordsAddress) {
            setDetectedAddress(data.wordsAddress);
            if (data.area) setSelectedArea(data.area);
            if (data.street && (!streetName || streetName === closestSpot.street)) setStreetName(data.street);
            if (data.landmark && (!landmark || landmark === closestSpot.landmark)) setLandmark(data.landmark);
          }
        })
        .catch((err) => console.log('Background geocode refinement:', err));

      setIsDetectingGps(false);
      if (validationError) setValidationError('');
    };

    // Use high accuracy GPS with maximumAge: 0 for 100% live satellite accuracy
    navigator.geolocation.getCurrentPosition(
      (pos) => processPosition(pos),
      (err) => {
        console.log('Tier 1 GPS timeout, falling back:', err.message);
        navigator.geolocation.getCurrentPosition(
          (pos) => processPosition(pos),
          (err2) => {
            setIsDetectingGps(false);
            if (err2.code === err2.PERMISSION_DENIED) {
              setGpsError('Location permission was denied. Tap any quick colony below to set your area!');
            } else {
              setGpsError('Could not get GPS fix. Please tap your colony from the 1-tap options below.');
            }
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Search Narsipatnam colonies & landmarks via API
  const handleSearchLocation = async (query) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.results) {
          setSearchResults(data.results);
        } else {
          setSearchResults([]);
        }
      }
    } catch (e) {
      console.warn('Location search error:', e);
    } finally {
      setIsSearching(false);
    }
  };

  // Select a searched landmark/colony
  const handleSelectSearchResult = (result) => {
    setGpsLocation({ lat: result.lat, lng: result.lng });
    setGpsAccuracy(5);
    setDetectedAddress(result.formatted);
    setSelectedArea(result.area);
    setStreetName(result.street);
    setLandmark(result.landmark);
    setPincode(result.pincode);
    setDeliveryDistance(result.distanceKm);
    setDeliveryEta(result.estimatedTime);
    if (!houseNumber || !houseNumber.trim()) {
      setHouseNumber('Near ' + result.name);
    }
    setSearchResults([]);
    setSearchQuery('');
    if (validationError) setValidationError('');
  };

  // Handle location confirmed from Interactive Leaflet Map Picker
  const handleLocationFromMap = (loc) => {
    setGpsLocation({ lat: loc.lat, lng: loc.lng });
    setGpsAccuracy(5);
    setDetectedAddress(loc.address);
    if (loc.area) setSelectedArea(loc.area);
    if (loc.street) setStreetName(loc.street);
    if (loc.landmark) setLandmark(loc.landmark);
    if (loc.pincode) setPincode(loc.pincode);
    if (loc.distanceKm !== undefined) setDeliveryDistance(loc.distanceKm);
    if (loc.estimatedTime) setDeliveryEta(loc.estimatedTime);
    if (!houseNumber || !houseNumber.trim() || houseNumber === 'My Current Location') {
      setHouseNumber('My Current Location');
    }
    if (validationError) setValidationError('');
  };

  // Quick 1-tap select for popular Narsipatnam spots (zero typing needed)
  const handleSelectQuickSpot = (spot) => {
    setSelectedArea(spot.area);
    setStreetName(spot.street);
    setLandmark(spot.landmark);
    setGpsLocation({ lat: spot.lat, lng: spot.lng });
    setGpsAccuracy(5);
    setDeliveryDistance(spot.dist);
    setDeliveryEta(spot.eta);
    setDetectedAddress(`${spot.street}, ${spot.area}, Narsipatnam - 531116`);
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

    const finalHouseNumber = houseNumber && houseNumber.trim() ? houseNumber.trim() : (gpsLocation ? 'Deliver to GPS Doorstep Pin' : 'Near Main Road');
    const finalStreet = streetName && streetName.trim() ? streetName.trim() : selectedArea;
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
      text += `🏛️ *Colony / Locality:* ${selectedArea}\n`;
      if (streetName && streetName.trim() && streetName.trim() !== selectedArea) {
        text += `🛣️ *Street/Road:* ${streetName.trim()}\n`;
      }
      if (landmark && landmark.trim()) {
        text += `🚩 *Landmark:* ${landmark.trim()}\n`;
      }
      text += `📮 *Town:* Narsipatnam, AP - 531116\n`;
      if (detectedAddress && detectedAddress.trim()) {
        text += `✨ *Location in Words:* ${detectedAddress.trim()}\n`;
      }
      if (deliveryDistance !== null) {
        text += `🛵 *Distance from Shop:* ~${deliveryDistance} km (${deliveryEta || '20-30 mins'})\n`;
      }
      if (gpsLocation) {
        text += `🗺️ *Live Google Maps Pin:* https://maps.google.com/?q=${gpsLocation.lat},${gpsLocation.lng}\n`;
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

                  {/* 1-Tap Auto-Fetch & Map Pinpoint Action Buttons */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={handleDetectGPS}
                        disabled={isDetectingGps}
                        style={{
                          padding: '11px 10px',
                          background: detectedAddress || gpsLocation ? '#ecfdf5' : '#ea580c',
                          border: detectedAddress || gpsLocation ? '1.5px solid #10b981' : 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          color: detectedAddress || gpsLocation ? '#065f46' : '#ffffff',
                          boxShadow: detectedAddress || gpsLocation ? 'none' : '0 2px 8px rgba(234, 88, 12, 0.25)',
                          transition: 'all 0.2s ease',
                          touchAction: 'manipulation'
                        }}
                      >
                        {isDetectingGps ? (
                          <>
                            <Compass className="animate-spin" size={16} /> Fetching...
                          </>
                        ) : detectedAddress || gpsLocation ? (
                          <>
                            <CheckCircle2 size={16} color="#059669" /> Fetched!
                          </>
                        ) : (
                          <>
                            <Navigation size={16} /> 📍 Auto-Fetch GPS
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsMapPickerOpen(true)}
                        style={{
                          padding: '11px 10px',
                          background: '#fff7ed',
                          border: '1.5px solid #ea580c',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          color: '#ea580c',
                          transition: 'all 0.2s ease',
                          touchAction: 'manipulation'
                        }}
                      >
                        <Crosshair size={16} /> 🗺️ Pinpoint on Map
                      </button>
                    </div>

                    {gpsError && (
                      <p style={{ margin: '6px 0 0 0', fontSize: '0.76rem', color: '#ef4444', fontWeight: 600 }}>{gpsError}</p>
                    )}
                  </div>

                  {/* Quick Colony / Landmark Search (Instant Narsipatnam Lookup) */}
                  <div style={{ marginBottom: '14px', position: 'relative' }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="🔍 Search your colony, temple, or landmark in Narsipatnam..."
                        value={searchQuery}
                        onChange={(e) => handleSearchLocation(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          paddingLeft: '34px',
                          borderRadius: '8px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.84rem',
                          background: '#ffffff',
                          color: '#0f172a'
                        }}
                      />
                      <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      {isSearching && (
                        <Compass className="animate-spin" size={16} color="#ea580c" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      )}
                    </div>

                    {/* Instant Search Results Dropdown */}
                    {searchResults.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 30,
                        background: '#ffffff',
                        border: '1.5px solid #ea580c',
                        borderRadius: '10px',
                        marginTop: '4px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        maxHeight: '220px',
                        overflowY: 'auto'
                      }}>
                        {searchResults.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectSearchResult(item)}
                            style={{
                              padding: '10px 14px',
                              borderBottom: idx === searchResults.length - 1 ? 'none' : '1px solid #f1f5f9',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'background 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fff7ed'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                          >
                            <div>
                              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.86rem' }}>📍 {item.name}</div>
                              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{item.street}, {item.area}</div>
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ea580c', background: '#fff7ed', padding: '2px 8px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                              ~{item.distanceKm} km
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Live Auto-Fetched Address Card (Customer can see perfectly) */}
                  {(detectedAddress || gpsLocation) && (
                    <div style={{
                      background: '#ffffff',
                      border: '1.5px solid #a7f3d0',
                      borderRadius: '12px',
                      padding: '14px',
                      marginBottom: '14px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={15} color="#059669" /> VERIFIED LOCATION
                          </span>
                          {gpsAccuracy && (
                            <span style={{ fontSize: '0.68rem', color: '#065f46', background: '#d1fae5', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              🎯 ±{gpsAccuracy}m
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setIsMapPickerOpen(true)}
                            style={{
                              background: '#fff7ed',
                              border: '1.5px solid #ea580c',
                              borderRadius: '6px',
                              padding: '3px 8px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              color: '#ea580c',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Crosshair size={13} /> Drag Pin
                          </button>
                          {gpsLocation && (
                            <a
                              href={`https://maps.google.com/?q=${gpsLocation.lat},${gpsLocation.lng}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 700, textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '3px' }}
                            >
                              🗺️ Maps ↗
                            </a>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#065f46', lineHeight: 1.35, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>📍 {detectedAddress || `${selectedArea}, Narsipatnam`}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span>Colony: <strong>{selectedArea}</strong></span>
                          {streetName && streetName.trim() && streetName.trim() !== selectedArea && (
                            <span>• Road: <strong>{streetName.trim()}</strong></span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Doorstep GPS Pin Active ({gpsLocation ? `${gpsLocation.lat.toFixed(5)}, ${gpsLocation.lng.toFixed(5)}` : 'Captured'}) • 100% Exact Link
                        </div>
                      </div>

                      {/* Delivery Distance & Time Estimate */}
                      {deliveryDistance !== null && (
                        <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '6px' }}>
                          <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700 }}>
                            🛵 ~{deliveryDistance} km from Cake Shoppee • Est. Delivery: {deliveryEta || '20-30 mins'}
                          </span>
                        </div>
                      )}

                      {/* Embedded Live Google Maps Pin View (Customer sees their exact spot) */}
                      {gpsLocation && (
                        <div style={{ marginTop: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 700 }}>
                              📍 Live Satellite/Street Pin:
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowMapPreview(!showMapPreview)}
                              style={{ background: 'transparent', border: 'none', color: '#0284c7', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              {showMapPreview ? 'Hide Map' : 'Show Map'}
                            </button>
                          </div>

                          {showMapPreview && (
                            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', height: '140px', position: 'relative', background: '#f8fafc' }}>
                              <iframe
                                title="Delivery Location Map Pin"
                                src={`https://maps.google.com/maps?q=${gpsLocation.lat},${gpsLocation.lng}&hl=en&z=16&output=embed`}
                                width="100%"
                                height="140"
                                style={{ border: 0, display: 'block' }}
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Rider gets direct 1-tap navigation to your door.
                        </span>
                        <button
                          type="button"
                          onClick={handleDetectGPS}
                          disabled={isDetectingGps}
                          style={{ background: 'transparent', border: 'none', color: '#059669', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          🔄 Refresh Location
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 1-Tap Quick Locality Chips for Narsipatnam */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                      ⚡ 1-Tap Pick Your Narsipatnam Colony:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {QUICK_SPOTS.map((spot) => (
                        <button
                          key={spot.label}
                          type="button"
                          onClick={() => handleSelectQuickSpot(spot)}
                          style={{
                            padding: '7px 12px',
                            background: selectedArea === spot.area ? '#fff7ed' : '#ffffff',
                            border: selectedArea === spot.area ? '2px solid #ea580c' : '1px solid #cbd5e1',
                            borderRadius: '999px',
                            fontSize: '0.78rem',
                            fontWeight: selectedArea === spot.area ? 800 : 600,
                            color: selectedArea === spot.area ? '#c2410c' : '#334155',
                            cursor: 'pointer',
                            boxShadow: selectedArea === spot.area ? '0 2px 6px rgba(234, 88, 12, 0.15)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {spot.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clean, Visible Address Fields (Zero Guesswork) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                    
                    {/* Area Dropdown */}
                    <div>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                        1. Narsipatnam Colony / Locality <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        value={selectedArea}
                        onChange={(e) => {
                          setSelectedArea(e.target.value);
                          if (validationError) setValidationError('');
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          color: '#0f172a',
                          background: '#ffffff'
                        }}
                      >
                        {NARSIPATNAM_AREAS.map((area) => (
                          <option key={area} value={area}>📍 {area}</option>
                        ))}
                      </select>
                    </div>

                    {/* House / Flat / Door Number */}
                    <div>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                        2. House / Flat / Door No. & Building <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Door No. 4-22, 1st Floor / Sri Sai Residency"
                        value={houseNumber}
                        onChange={(e) => {
                          setHouseNumber(e.target.value);
                          if (validationError) setValidationError('');
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: validationError && (!houseNumber || !houseNumber.trim()) ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                          fontSize: '0.86rem',
                          background: '#ffffff'
                        }}
                        required
                      />
                    </div>

                    {/* Street Name & Landmark */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                          3. Street / Road
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Main Street"
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

                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                          4. Nearby Landmark
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Near SBI ATM"
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
                    </div>

                    {/* Pin Code prefilled */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#f1f5f9', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Town / Postal Code:</span>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155' }}>Narsipatnam, AP - 531116</span>
                    </div>

                  </div>

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

        {/* Interactive Full Map Pinpoint Modal */}
        <LocationPickerModal
          isOpen={isMapPickerOpen}
          onClose={() => setIsMapPickerOpen(false)}
          initialCoords={gpsLocation || { lat: 17.66635, lng: 82.61015 }}
          onSelectLocation={handleLocationFromMap}
        />

      </div>
    </div>
  );
}