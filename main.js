/* ==========================================================================
   Cake Shopee - Main Application Logic
   ========================================================================== */

// Sample Menu Product Dataset
const PRODUCTS = [
  {
    id: "p1",
    name: "Classic Black Forest Cake",
    category: "cakes",
    price: 490,
    weight: "0.5 kg",
    rating: 4.9,
    eggless: true,
    bestseller: true,
    image: "images/image5.png",
    description: "Layers of moist chocolate sponge infused with sweet cherries, topped with fresh whipped cream and dark chocolate curls."
  },
  {
    id: "p2",
    name: "Custom 2-Tier Celebration Theme Cake",
    category: "cakes",
    price: 1200,
    weight: "1.5 kg",
    rating: 5.0,
    eggless: true,
    bestseller: true,
    image: "images/image2.ong",
    description: "Handcrafted 2-tier theme cake with fondant details, perfect for 1st birthdays, baby showers, and grand celebrations."
  },
  {
    id: "p3",
    name: "Pineapple Cream Delight Cake",
    category: "cakes",
    price: 450,
    weight: "0.5 kg",
    rating: 4.8,
    eggless: true,
    bestseller: false,
    image: "images/image4.jpg",
    description: "Fresh pineapple juicy chunks layered with soft vanilla sponge and rich vanilla whipped cream."
  },
  {
    id: "p4",
    name: "Chocolate Truffle Fudge Cake",
    category: "cakes",
    price: 550,
    weight: "0.5 kg",
    rating: 4.9,
    eggless: true,
    bestseller: true,
    image: "images/hero1.png",
    description: "Pure Belgian dark chocolate ganache cake for true chocolate lovers. Rich, dense, and melt-in-the-mouth."
  },
  {
    id: "p5",
    name: "Red Velvet Cream Cheese Pastry",
    category: "pastries",
    price: 90,
    weight: "1 Slice",
    rating: 4.7,
    eggless: true,
    bestseller: true,
    image: "images/image5.png",
    description: "Vibrant red velvet sponge layered with silky cream cheese frosting."
  },
  {
    id: "p6",
    name: "New York Style Cheesecake Slice",
    category: "pastries",
    price: 140,
    weight: "1 Slice",
    rating: 4.9,
    eggless: false,
    bestseller: true,
    image: "images/hero1.png",
    description: "Baked classic cream cheesecake slice with graham crust and strawberry drizzle."
  },
  {
    id: "p7",
    name: "Hot Crispy Veg Puff",
    category: "savouries",
    price: 35,
    weight: "1 Pc",
    rating: 4.6,
    eggless: true,
    bestseller: true,
    image: "images/image3.jpg",
    description: "Golden flaky puff pastry filled with spiced potatoes, green peas, and herbs."
  },
  {
    id: "p8",
    name: "Special Chicken Pepper Puff",
    category: "savouries",
    price: 55,
    weight: "1 Pc",
    rating: 4.8,
    eggless: false,
    bestseller: true,
    image: "images/image3.jpg",
    description: "Oven baked puff packed with shredded pepper chicken masala."
  },
  {
    id: "p9",
    name: "Fresh Cheese Pizza (Personal Size)",
    category: "savouries",
    price: 160,
    weight: "7 inch",
    rating: 4.7,
    eggless: true,
    bestseller: false,
    image: "images/image1.png",
    description: "Freshly baked pizza base topped with rich tomato sauce, mozzarella cheese, and capsicum."
  },
  {
    id: "p10",
    name: "Juicy Veg Cheese Burger",
    category: "savouries",
    price: 95,
    weight: "1 Burger",
    rating: 4.6,
    eggless: true,
    bestseller: false,
    image: "images/image1.png",
    description: "Crispy patty bun filled with melted cheese, lettuce, tomatoes, and house mayonnaise."
  },
  {
    id: "p11",
    name: "Thick Oreo Chocolate Milkshake",
    category: "shakes",
    price: 110,
    weight: "350 ml",
    rating: 4.9,
    eggless: true,
    bestseller: true,
    image: "images/image6.jpg",
    description: "Chilled thick milkshake blended with real Oreo cookies, rich chocolate ice cream, and whipped cream."
  },
  {
    id: "p12",
    name: "Cold Coffee with Ice Cream Float",
    category: "shakes",
    price: 100,
    weight: "350 ml",
    rating: 4.8,
    eggless: true,
    bestseller: false,
    image: "images/image6.jpg",
    description: "Creamy espresso cold coffee topped with a scoop of vanilla ice cream."
  },
  {
    id: "p13",
    name: "Birthday Party Props & Candle Set",
    category: "party",
    price: 150,
    weight: "Combo Pack",
    rating: 4.8,
    eggless: true,
    bestseller: false,
    image: "images/image7.jpg",
    description: "Includes sparkling birthday candles, party cap, party popper, and banner."
  },
  {
    id: "p14",
    name: "Assorted Premium Chocolates Box",
    category: "party",
    price: 220,
    weight: "200g Box",
    rating: 4.9,
    eggless: true,
    bestseller: false,
    image: "images/image7.jpg",
    description: "Delicious handpicked chocolates perfect for birthday gifts and sweet hampers."
  }
];

// App State
let cart = JSON.parse(localStorage.getItem('cake_shopee_cart')) || [];
let activeCategory = 'all';
let searchQuery = '';
let egglessOnly = false;
let discountApplied = false;
let discountPercent = 0;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initStoreStatus();
  renderProducts();
  setupEventListeners();
  updateCartUI();
});

/* ==========================================================================
   1. Hero Slider Controls
   ========================================================================== */

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  
  if (!slides.length) return;
  
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function startAutoSlide() {
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000);
  }

  function stopAutoSlide() {
    clearInterval(slideInterval);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoSlide();
      showSlide(currentSlide - 1);
      startAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoSlide();
      showSlide(currentSlide + 1);
      startAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      stopAutoSlide();
      const slideIdx = parseInt(e.target.dataset.slide);
      showSlide(slideIdx);
      startAutoSlide();
    });
  });

  startAutoSlide();
}

/* ==========================================================================
   2. Store Operating Hours Status
   ========================================================================== */

function initStoreStatus() {
  const statusBadge = document.getElementById('storeStatusBadge');
  if (!statusBadge) return;

  const now = new Date();
  const currentHour = now.getHours();

  // Store hours: 10:00 AM (10) to 10:00 PM (22)
  const isOpen = currentHour >= 10 && currentHour < 22;

  const dot = statusBadge.querySelector('.status-dot');
  const text = statusBadge.querySelector('.status-text');

  if (isOpen) {
    if (dot) dot.className = 'status-dot online';
    if (text) text.textContent = 'Open • Closes 10 PM';
  } else {
    if (dot) dot.className = 'status-dot offline';
    if (text) text.textContent = 'Closed • Opens 10 AM';
  }
}

/* ==========================================================================
   3. Products Filtering & Rendering
   ========================================================================== */

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  let filtered = PRODUCTS.filter(p => {
    const matchesCat = (activeCategory === 'all') || (p.category === activeCategory);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEggless = egglessOnly ? p.eggless : true;

    return matchesCat && matchesSearch && matchesEggless;
  });

  grid.replaceChildren();

  if (filtered.length === 0) {
    const emptyNotice = document.createElement('div');
    emptyNotice.className = 'empty-notice text-center';
    emptyNotice.style.gridColumn = '1 / -1';
    emptyNotice.style.padding = '40px';
    
    const icon = document.createElement('div');
    icon.style.fontSize = '3rem';
    icon.textContent = '🧁';

    const h3 = document.createElement('h3');
    h3.textContent = 'No Delights Found';

    const p = document.createElement('p');
    p.textContent = 'Try adjusting your search query or selecting a different category filter.';

    emptyNotice.appendChild(icon);
    emptyNotice.appendChild(h3);
    emptyNotice.appendChild(p);
    grid.appendChild(emptyNotice);
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Thumbnail container
    const thumb = document.createElement('div');
    thumb.className = 'product-thumb';

    const img = document.createElement('img');
    img.src = p.image;
    img.alt = p.name;
    img.loading = 'lazy';
    thumb.appendChild(img);

    // Diet badge
    const badge = document.createElement('div');
    badge.className = `diet-badge ${p.eggless ? 'eggless' : 'egg'}`;
    badge.title = p.eggless ? '100% Eggless' : 'Contains Egg';
    thumb.appendChild(badge);

    // Quick view button
    const quickBtn = document.createElement('button');
    quickBtn.className = 'quick-view-btn';
    quickBtn.textContent = '👁️ Quick View';
    quickBtn.onclick = (e) => {
      e.stopPropagation();
      openQuickViewModal(p);
    };
    thumb.appendChild(quickBtn);

    card.appendChild(thumb);

    // Details container
    const details = document.createElement('div');
    details.className = 'product-details';

    const meta = document.createElement('div');
    meta.className = 'product-meta';

    const rating = document.createElement('span');
    rating.className = 'product-rating';
    rating.textContent = `★ ${p.rating}`;

    const weight = document.createElement('span');
    weight.className = 'product-weight';
    weight.textContent = p.weight;

    meta.appendChild(rating);
    meta.appendChild(weight);
    details.appendChild(meta);

    const title = document.createElement('h3');
    title.className = 'product-title';
    title.textContent = p.name;
    details.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'product-desc';
    desc.textContent = p.description;
    details.appendChild(desc);

    const footer = document.createElement('div');
    footer.className = 'product-footer';

    const price = document.createElement('span');
    price.className = 'product-price';
    price.textContent = `₹${p.price}`;

    const addBtn = document.createElement('button');
    addBtn.className = 'add-cart-btn';
    addBtn.textContent = '+ Add to Cart';
    addBtn.onclick = () => addToCart(p);

    footer.appendChild(price);
    footer.appendChild(addBtn);
    details.appendChild(footer);

    card.appendChild(details);
    grid.appendChild(card);
  });
}

/* ==========================================================================
   4. Cart Operations & UI Updates
   ========================================================================== */

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
}

function updateCartQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('cake_shopee_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const cartCountEl = document.getElementById('cartCount');
  const mobileCartCountEl = document.getElementById('mobileCartCount');

  if (cartCountEl) cartCountEl.textContent = totalCount;
  if (mobileCartCountEl) mobileCartCountEl.textContent = totalCount;

  renderCartItems();
}

function renderCartItems() {
  const cartBody = document.getElementById('cartBody');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartTotalEl = document.getElementById('cartTotal');
  const discountRow = document.getElementById('discountRow');
  const cartDiscountEl = document.getElementById('cartDiscount');

  if (!cartBody) return;

  cartBody.replaceChildren();

  if (cart.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-cart';

    const icon = document.createElement('div');
    icon.className = 'empty-cart-icon';
    icon.textContent = '🛒';

    const p = document.createElement('p');
    p.textContent = 'Your cart is currently empty.';

    emptyDiv.appendChild(icon);
    emptyDiv.appendChild(p);
    cartBody.appendChild(emptyDiv);

    if (cartSubtotalEl) cartSubtotalEl.textContent = '₹0';
    if (cartTotalEl) cartTotalEl.textContent = '₹0';
    if (discountRow) discountRow.classList.add('hidden');
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    const row = document.createElement('div');
    row.className = 'cart-item';

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.className = 'cart-item-img';

    const info = document.createElement('div');
    info.className = 'cart-item-info';

    const t = document.createElement('h4');
    t.className = 'cart-item-title';
    t.textContent = item.name;

    const p = document.createElement('div');
    p.className = 'cart-item-price';
    p.textContent = `₹${item.price} x ${item.qty} = ₹${itemTotal}`;

    const ctrls = document.createElement('div');
    ctrls.className = 'cart-item-controls';

    const minus = document.createElement('button');
    minus.className = 'qty-btn';
    minus.textContent = '-';
    minus.onclick = () => updateCartQuantity(item.id, -1);

    const val = document.createElement('span');
    val.className = 'qty-val';
    val.textContent = item.qty;

    const plus = document.createElement('button');
    plus.className = 'qty-btn';
    plus.textContent = '+';
    plus.onclick = () => updateCartQuantity(item.id, 1);

    ctrls.appendChild(minus);
    ctrls.appendChild(val);
    ctrls.appendChild(plus);

    info.appendChild(t);
    info.appendChild(p);
    info.appendChild(ctrls);

    row.appendChild(img);
    row.appendChild(info);
    cartBody.appendChild(row);
  });

  let discountAmount = discountApplied ? Math.round(subtotal * (discountPercent / 100)) : 0;
  let finalTotal = Math.max(0, subtotal - discountAmount);

  if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal}`;
  if (cartTotalEl) cartTotalEl.textContent = `₹${finalTotal}`;

  if (discountApplied && discountRow && cartDiscountEl) {
    discountRow.classList.remove('hidden');
    cartDiscountEl.textContent = `-₹${discountAmount}`;
  } else if (discountRow) {
    discountRow.classList.add('hidden');
  }
}

/* ==========================================================================
   5. Cart Drawer & Modal Controls
   ========================================================================== */

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer) drawer.classList.add('active');
  if (backdrop) backdrop.classList.add('active');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer) drawer.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
}

function openQuickViewModal(product) {
  const backdrop = document.getElementById('productModalBackdrop');
  const modal = document.getElementById('productModal');
  const content = document.getElementById('productModalContent');

  if (!content) return;

  content.replaceChildren();

  const wrap = document.createElement('div');
  wrap.style.display = 'grid';
  wrap.style.gridTemplateColumns = '1fr 1fr';
  wrap.style.gap = '20px';

  const img = document.createElement('img');
  img.src = product.image;
  img.alt = product.name;
  img.style.borderRadius = '12px';
  img.style.width = '100%';

  const details = document.createElement('div');
  
  const title = document.createElement('h2');
  title.style.fontSize = '1.5rem';
  title.style.marginBottom = '10px';
  title.textContent = product.name;

  const price = document.createElement('div');
  price.style.fontSize = '1.4rem';
  price.style.fontWeight = '700';
  price.style.color = '#c88a4c';
  price.style.marginBottom = '12px';
  price.textContent = `₹${product.price} (${product.weight})`;

  const desc = document.createElement('p');
  desc.style.color = '#6e5f58';
  desc.style.marginBottom = '20px';
  desc.textContent = product.description;

  const addBtn = document.createElement('button');
  addBtn.className = 'btn btn-primary btn-block';
  addBtn.textContent = 'Add to Shopping Cart';
  addBtn.onclick = () => {
    addToCart(product);
    closeQuickViewModal();
  };

  details.appendChild(title);
  details.appendChild(price);
  details.appendChild(desc);
  details.appendChild(addBtn);

  wrap.appendChild(img);
  wrap.appendChild(details);
  content.appendChild(wrap);

  if (backdrop) backdrop.classList.add('active');
  if (modal) modal.classList.add('active');
}

function closeQuickViewModal() {
  const backdrop = document.getElementById('productModalBackdrop');
  const modal = document.getElementById('productModal');
  if (backdrop) backdrop.classList.remove('active');
  if (modal) modal.classList.remove('active');
}

/* ==========================================================================
   6. WhatsApp Checkout Payload Builder
   ========================================================================== */

function handleWhatsAppCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty! Please add some cakes or savouries first.');
    return;
  }

  const slotSelect = document.getElementById('deliverySlotSelect');
  const selectedSlot = slotSelect ? slotSelect.value : 'Today (10 AM - 5 PM)';

  let text = `🍰 *NEW ORDER - CAKE SHOPEE NARSIPATNAM*\n`;
  text += `------------------------------------\n`;

  let subtotal = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    text += `${index + 1}. *${item.name}* x ${item.qty} = ₹${itemTotal}\n`;
  });

  let discountAmount = discountApplied ? Math.round(subtotal * (discountPercent / 100)) : 0;
  let finalTotal = Math.max(0, subtotal - discountAmount);

  text += `------------------------------------\n`;
  text += `*Subtotal:* ₹${subtotal}\n`;
  if (discountApplied) {
    text += `*Discount (FIRST15):* -₹${discountAmount}\n`;
  }
  text += `*Grand Total:* ₹${finalTotal}\n`;
  text += `------------------------------------\n`;
  text += `🕒 *Delivery/Pickup Slot:* ${selectedSlot}\n`;
  text += `📍 *Delivery Location:* Complex road, Narsipatnam\n\n`;
  text += `Please confirm my order! Thank you.`;

  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/917660948403?text=${encodedText}`;

  window.open(whatsappUrl, '_blank');
}

/* ==========================================================================
   7. Event Listeners Setup
   ========================================================================== */

function setupEventListeners() {
  // Category Filter Pills
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeCategory = e.target.dataset.filter;
      renderProducts();
    });
  });

  // Search Input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Eggless Toggle
  const egglessToggle = document.getElementById('egglessToggle');
  if (egglessToggle) {
    egglessToggle.addEventListener('change', (e) => {
      egglessOnly = e.target.checked;
      renderProducts();
    });
  }

  // Category Cards Click -> Filter
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      if (cat === 'custom') {
        const target = document.getElementById('custom-cake');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      activeCategory = cat;
      const navBtn = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
      if (navBtn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        navBtn.classList.add('active');
      }
      renderProducts();
      const menuSection = document.getElementById('menu');
      if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Cart Triggers
  const cartBtn = document.getElementById('cartBtn');
  const mobileCartBtn = document.getElementById('mobileCartBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBackdrop = document.getElementById('cartBackdrop');

  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
  if (mobileCartBtn) mobileCartBtn.addEventListener('click', openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);

  // Promo Code
  const applyPromoBtn = document.getElementById('applyPromoBtn');
  const promoInput = document.getElementById('promoInput');
  const promoMessage = document.getElementById('promoMessage');

  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', () => {
      const code = promoInput ? promoInput.value.trim().toUpperCase() : '';
      if (code === 'FIRST15') {
        discountApplied = true;
        discountPercent = 15;
        if (promoMessage) {
          promoMessage.textContent = '🎉 Coupon FIRST15 applied! 15% discount subtracted.';
          promoMessage.className = 'promo-message success';
        }
        updateCartUI();
      } else {
        if (promoMessage) {
          promoMessage.textContent = 'Invalid promo code. Try FIRST15';
          promoMessage.className = 'promo-message';
        }
      }
    });
  }

  // Checkout Button
  const whatsappCheckoutBtn = document.getElementById('whatsappCheckoutBtn');
  if (whatsappCheckoutBtn) {
    whatsappCheckoutBtn.addEventListener('click', handleWhatsAppCheckout);
  }

  // Custom Cake Form
  const customCakeForm = document.getElementById('customCakeForm');
  if (customCakeForm) {
    customCakeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('customerName').value;
      const phone = document.getElementById('customerPhone').value;
      const occasion = document.getElementById('cakeOccasion').value;
      const flavor = document.getElementById('cakeFlavor').value;
      const weight = document.getElementById('cakeWeight').value;
      const dietary = document.getElementById('dietaryPref').value;
      const date = document.getElementById('deliveryDate').value;
      const message = document.getElementById('cakeMessage').value;
      const instructions = document.getElementById('specialInstructions').value;

      let payload = `🎂 *CUSTOM LIVE CAKE REQUEST - CAKE SHOPEE*\n`;
      payload += `------------------------------------\n`;
      payload += `👤 *Customer Name:* ${name}\n`;
      payload += `📞 *Phone:* ${phone}\n`;
      payload += `🎉 *Occasion:* ${occasion}\n`;
      payload += `🍰 *Flavor:* ${flavor}\n`;
      payload += `⚖️ *Weight:* ${weight}\n`;
      payload += `🌱 *Diet:* ${dietary}\n`;
      payload += `📅 *Event Date:* ${date}\n`;
      if (message) payload += `✍️ *Text on Cake:* "${message}"\n`;
      if (instructions) payload += `📝 *Notes/Theme:* ${instructions}\n`;
      payload += `------------------------------------\n`;
      payload += `Please provide me a price quote and confirm availability.`;

      const encoded = encodeURIComponent(payload);
      window.open(`https://wa.me/917660948403?text=${encoded}`, '_blank');
    });
  }

  // Gallery Lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.dataset.img;
      const title = item.dataset.title;

      if (lightboxImg) lightboxImg.src = imgSrc;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxModal) lightboxModal.classList.add('active');
    });
  });

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('lightbox-close') || e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // Quick View Modal Close
  const productModalClose = document.getElementById('productModalClose');
  const productModalBackdrop = document.getElementById('productModalBackdrop');
  if (productModalClose) productModalClose.addEventListener('click', closeQuickViewModal);
  if (productModalBackdrop) productModalBackdrop.addEventListener('click', closeQuickViewModal);
}
