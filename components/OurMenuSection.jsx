"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Search, Eye, Plus, Check } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";

const CATEGORIES = [
  {
    id: "all",
    label: "All Items",
    emoji: "✨",
    image: "/images/menu/vegetablepizza8inches.jpg",
    description: "Browse our complete menu",
  },
  {
    id: "pizzas",
    label: "Pizzas",
    emoji: "🍕",
    image: "/images/menu/vegetablepizza8inches.jpg",
    description: "8-Inch Hand-Crafted Oven Pizzas",
  },
  {
    id: "burgers",
    label: "Burgers",
    emoji: "🍔",
    image: "/images/menu/chicken-burger.jpg",
    description: "Crispy Veg, Paneer and Chicken Burgers",
  },
  {
    id: "sandwiches",
    label: "Sandwiches",
    emoji: "🥪",
    image: "/images/menu/chicken-club-sandwich.jpg",
    description: "Fresh Toasted, Corn and Club Sandwiches",
  },
  {
    id: "chinese",
    label: "Chinese",
    emoji: "🥢",
    image: "/images/menu/chicken-fried-rice.jpg",
    description: "Wok Fried Rice and Hakka Noodles",
  },
  {
    id: "snacks",
    label: "Snacks",
    emoji: "🍟",
    image: "/images/menu/french-fries.jpg",
    description: "Crispy Puffs, French Fries, Pops and Nuggets",
  },
  {
    id: "cakes",
    label: "Cool Cakes",
    emoji: "🎂",
    image: "/images/cakes/black-forest-cake.jpg",
    description: "18 In-Store Flavors (0.5 kg & 1 kg)",
  },
];

export default function OurMenuSection({ onSelectCategory }) {
  const { addToCart, setQuickViewProduct } = useCart();
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [egglessOnly, setEgglessOnly] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState({});
  const [isSeriesPaused, setIsSeriesPaused] = useState(false);
  const gridRef = useRef(null);
  const trackRef = useRef(null);

  const handleSelectCat = (catId) => {
    setSelectedCat(catId);
    if (onSelectCategory) onSelectCategory(catId);
    setTimeout(() => {
      if (gridRef.current) {
        gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);
  };

  const scrollTrack = (direction) => {
    if (trackRef.current && trackRef.current.parentElement) {
      const scrollAmount = direction === "left" ? -280 : 280;
      trackRef.current.parentElement.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
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
          <span className="our-menu-eyebrow">Fresh Kitchen &amp; Fast Food Menu</span>
          <span className="section-badge">ONLINE MENU &amp; INSTANT ORDERING</span>
          <h2 className="our-menu-title">Fresh Pizzas, Burgers &amp; Fast Food</h2>
          <p className="our-menu-subtitle">
            Oven-hot 8-inch pizzas, crispy burgers, toasted sandwiches, wok noodles &amp; fried rice with local door delivery in Narsipatnam town.
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

        {/* Continuous Moving Series Carousel Row (Pause on Touch / Hover) */}
        <div className="series-motion-container">
          <div className="series-motion-header">
            <div className="series-motion-title-wrap">
              <span className="series-motion-badge">Series Row</span>
              <h3 className="series-motion-title">
                {selectedCat === 'all' ? 'Kitchen Specials Moving Series' : `${CATEGORIES.find(c => c.id === selectedCat)?.label || ''} Series Row`}
              </h3>
            </div>

            <div className="series-motion-controls">
              <button
                type="button"
                className="series-status-indicator"
                onClick={() => setIsSeriesPaused((prev) => !prev)}
                title="Tap to pause or resume motion"
              >
                {isSeriesPaused ? (
                  <>⏸️ <span>Paused (Tap to Move)</span></>
                ) : (
                  <>🟢 <span>Moving in Series • Touch to Stop</span></>
                )}
              </button>

              <button
                type="button"
                className="series-nav-arrow"
                onClick={() => scrollTrack("left")}
                aria-label="Scroll left"
              >
                ‹
              </button>
              <button
                type="button"
                className="series-nav-arrow"
                onClick={() => scrollTrack("right")}
                aria-label="Scroll right"
              >
                ›
              </button>
            </div>
          </div>

          <div
            className="series-motion-wrapper"
            onMouseEnter={() => setIsSeriesPaused(true)}
            onMouseLeave={() => setIsSeriesPaused(false)}
            onTouchStart={() => setIsSeriesPaused(true)}
            onTouchEnd={() => setIsSeriesPaused(false)}
          >
            <div
              ref={trackRef}
              className={`series-motion-track${isSeriesPaused ? " is-paused" : ""}`}
            >
              {[...(filteredProducts.slice(0, 10)), ...(filteredProducts.slice(0, 10))].map((product, idx) => {
                const isItemAdded = addedItemMap[product.id];
                return (
                  <div
                    key={`${product.id}-series-${idx}`}
                    className="series-item-pill"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    <div className="series-item-thumb">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="240px"
                      />
                      <div className="series-diet-badge-top">
                        {product.isVeg ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '14px', height: '14px', border: '1.5px solid #16a34a', borderRadius: '3px', background: '#ffffff' }} title="Pure Vegetarian">
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} />
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '14px', height: '14px', border: '1.5px solid #dc2626', borderRadius: '3px', background: '#ffffff' }} title="Non-Vegetarian">
                            <span style={{ width: '0', height: '0', borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderBottom: '6px solid #dc2626' }} />
                          </span>
                        )}
                      </div>
                      {product.tag && (
                        <span className="series-tag-top">{product.tag}</span>
                      )}
                    </div>

                    <div className="series-item-body">
                      <h4 className="series-item-title" title={product.name}>{product.name}</h4>
                      <p className="series-item-desc">{product.description}</p>

                      <div className="series-item-footer">
                        <span className="series-item-price">₹{product.price}</span>
                        <button
                          type="button"
                          className="series-item-add-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCartWithWeight(product);
                          }}
                        >
                          {isItemAdded ? (
                            <>
                              <Check size={13} /> Added!
                            </>
                          ) : (
                            <>
                              <Plus size={13} /> Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="our-menu-toolbar" ref={gridRef}>
          <div className="our-menu-toolbar-inner">
            <div className="search-box">
              <Search size={18} color="#947e74" />
              <input
                type="text"
                placeholder="Search pizzas, burgers, sandwiches, noodles, puffs..."
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
                      {product.isVeg ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '15px', height: '15px', border: '1.5px solid #16a34a', borderRadius: '3px', background: '#ffffff' }} title="Pure Vegetarian">
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a' }} />
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '15px', height: '15px', border: '1.5px solid #dc2626', borderRadius: '3px', background: '#ffffff' }} title="Non-Vegetarian">
                          <span style={{ width: '0', height: '0', borderLeft: '3.5px solid transparent', borderRight: '3.5px solid transparent', borderBottom: '6px solid #dc2626' }} />
                        </span>
                      )}
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
                                border: isSelected ? '1.5px solid #ea580c' : '1px solid #e2e8f0',
                                background: isSelected ? '#fff7ed' : '#ffffff',
                                color: isSelected ? '#ea580c' : '#64748b',
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
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #fff1f2 0%, #fee2e2 100%)',
          borderRadius: '16px',
          border: '1.5px solid #fecdd3',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '1.5rem' }}>📢</span>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#9f1239', fontWeight: '600', lineHeight: 1.5 }}>
            <strong>Direct Kitchen Note:</strong> We use fresh vegetables, pure dairy mozzarella &amp; cottage cheese, and premium cuts. Fast food items take 8–15 minutes fresh from our kitchen.
          </p>
        </div>

      </div>
    </section>
  );
}
