"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Search, Eye, Plus, Check } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";

const CATEGORIES = [
  {
    id: "all",
    label: "All Delights",
    emoji: "✨",
    image: "/images/blackforest.jpg",
    description: "Browse everything we make",
  },
  {
    id: "cakes",
    label: "Signature Cakes",
    emoji: "🎂",
    image: "/images/blackforest.jpg",
    description: "Black Forest, Red Velvet & Fruit Cakes",
  },
  {
    id: "pastries",
    label: "Gourmet Pastries",
    emoji: "🍰",
    image: "/images/chocoalmond.jpg",
    description: "Choco Almond & Fruit Pastry Slices",
  },
  {
    id: "savouries",
    label: "Hot Fast Food",
    emoji: "🍕",
    image: "/images/vegpizza.jpg",
    description: "Pizzas, Burgers & Grilled Sandwiches",
  },
  {
    id: "shakes",
    label: "Thick Milkshakes",
    emoji: "🥤",
    image: "/images/oreomilkshake.jpg",
    description: "Oreo, Kulfi & Strawberry Shakes",
  },
  {
    id: "party",
    label: "Party Essentials",
    emoji: "🎁",
    image: "/images/hero-custom-wedding-cake.jpg",
    description: "Combos & Celebration Bundles",
  },
];

export default function OurMenuSection({ onSelectCategory }) {
  const { addToCart, setQuickViewProduct } = useCart();
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [egglessOnly, setEgglessOnly] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState({});
  const gridRef = useRef(null);

  const handleSelectCat = (catId) => {
    setSelectedCat(catId);
    if (onSelectCategory) onSelectCategory(catId);
    setTimeout(() => {
      if (gridRef.current) {
        gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);
  };

  const [selectedWeightMap, setSelectedWeightMap] = useState({});

  const handleWeightChange = (productId, weight) => {
    setSelectedWeightMap((prev) => ({ ...prev, [productId]: weight }));
  };

  const getItemWeightAndPrice = (product) => {
    if (!product.weightOptions || product.weightOptions.length === 0) {
      return { weight: product.weight || 'Std', price: product.price };
    }
    const currentWeight = selectedWeightMap[product.id] || product.weightOptions[0].weight;
    const opt = product.weightOptions.find((o) => o.weight === currentWeight) || product.weightOptions[0];
    return { weight: opt.weight, price: opt.price };
  };

  const handleAddToCartWithWeight = (product) => {
    const { weight, price } = getItemWeightAndPrice(product);
    const itemToAdd = {
      ...product,
      id: `${product.id}-${weight.replace(/\s+/g, '')}`,
      name: `${product.name} (${weight})`,
      weight: weight,
      price: price
    };
    addToCart(itemToAdd);
    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCat = selectedCat === "all" || p.category === selectedCat;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.flavorNotes &&
        p.flavorNotes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesEggless = egglessOnly ? p.eggless : true;
    return matchesCat && matchesSearch && matchesEggless;
  });

  return (
    <section className="our-menu-section" id="bestsellers">
      <div className="our-menu-inner">

        {/* Section Header */}
        <div className="our-menu-header">
          <span className="our-menu-eyebrow">Authentic Shop Menu &amp; Quality</span>
          <span className="section-badge">ONLINE MENU &amp; INSTANT ORDERING</span>
          <h2 className="our-menu-title">Fresh Cool Cakes &amp; Counter Specials</h2>
          <p className="our-menu-subtitle">
            Exact shop menu card prices for 1/2 Kg (0.5 kg) and 1 Kg cakes with local door delivery in Narsipatnam town.
          </p>
        </div>

        {/* Category Tiles */}
        <div className="our-menu-cat-strip" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                className={"our-menu-cat-tile" + (isActive ? " active" : "")}
                onClick={() => handleSelectCat(cat.id)}
                title={cat.description}
              >
                <div className="our-menu-cat-img-wrap">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 640px) 40vw, 160px"
                    className="our-menu-cat-img"
                  />
                  <div className="our-menu-cat-overlay" />
                  {isActive && <div className="our-menu-cat-active-ring" />}
                </div>
                <div className="our-menu-cat-label">
                  <span className="our-menu-cat-emoji">{cat.emoji}</span>
                  <span className="our-menu-cat-name">{cat.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="our-menu-toolbar" ref={gridRef}>
          <div className="our-menu-toolbar-inner">
            <div className="search-box">
              <Search size={18} color="#947e74" />
              <input
                type="text"
                placeholder="Search cakes, puffs, milkshakes, pizzas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
            </div>

            <div className="toggle-group">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={egglessOnly}
                  onChange={(e) => setEgglessOnly(e.target.checked)}
                  aria-label="Show eggless only"
                />
                <span className="toggle-slider" />
              </label>
              <span className="toggle-label">🌱 100% Eggless Only</span>
            </div>

            {selectedCat !== "all" && (
              <div className="our-menu-active-filter">
                <span>
                  {CATEGORIES.find((c) => c.id === selectedCat)?.emoji}{" "}
                  {CATEGORIES.find((c) => c.id === selectedCat)?.label}
                </span>
                <button
                  className="our-menu-clear-filter"
                  onClick={() => handleSelectCat("all")}
                  aria-label="Clear filter"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="products-grid" id="our-menu-grid">
          {filteredProducts.length === 0 ? (
            <div
              className="empty-notice text-center"
              style={{ gridColumn: "1 / -1", padding: "60px 20px" }}
            >
              <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>🧁</div>
              <h3 style={{ fontSize: "1.4rem", color: "#1f110a", marginBottom: "6px" }}>
                No Delights Found
              </h3>
              <p style={{ color: "#695247" }}>
                Try adjusting your search keywords or switching category filters.
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const { weight, price } = getItemWeightAndPrice(product);
              return (
                <div key={product.id} className="product-card">
                  <div className="product-thumb">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className="product-details">
                    <div className="product-meta">
                      <span className="product-rating">★ {product.rating}</span>
                      <span className="product-weight">{weight}</span>
                    </div>

                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-desc">{product.description}</p>

                    {/* Weight Option Selector Pill */}
                    {product.weightOptions && product.weightOptions.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', margin: '8px 0 12px 0' }}>
                        {product.weightOptions.map((opt) => {
                          const isSelected = (selectedWeightMap[product.id] || product.weightOptions[0].weight) === opt.weight;
                          return (
                            <button
                              key={opt.weight}
                              type="button"
                              onClick={() => handleWeightChange(product.id, opt.weight)}
                              style={{
                                flex: 1,
                                padding: '4px 8px',
                                borderRadius: '99px',
                                border: isSelected ? '1.5px solid #e11d48' : '1px solid #e2e8f0',
                                background: isSelected ? '#fff1f2' : '#ffffff',
                                color: isSelected ? '#e11d48' : '#64748b',
                                fontSize: '0.78rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {opt.weight} (₹{opt.price})
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="product-footer">
                      <span className="product-price">₹{price}</span>
                      <button
                        className="add-cart-btn"
                        onClick={() => handleAddToCartWithWeight(product)}
                      >
                        {addedItemMap[product.id] ? (
                          <>
                            <Check size={15} color="#15803d" /> Added!
                          </>
                        ) : (
                          <>
                            <Plus size={15} /> Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Red Note Banner at Menu Bottom matching shop menu board */}
        <div style={{
          marginTop: '32px',
          padding: '20px 24px',
          background: '#09090b',
          border: '2px solid #ef4444',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.25)'
        }}>
          <h4 style={{
            color: '#ef4444',
            fontFamily: 'var(--font-outfit)',
            fontSize: '1.75rem',
            fontWeight: '900',
            letterSpacing: '1px',
            textTransform: 'lowercase',
            margin: 0
          }}>
            eggless extra 100
          </h4>
          <p style={{ color: '#f87171', fontSize: '0.9rem', margin: '6px 0 0 0', fontWeight: '600' }}>
            (For 100% Pure Eggless cake preparation, extra ₹100 charge applies)
          </p>
        </div>

      </div>
    </section>
  );
}
