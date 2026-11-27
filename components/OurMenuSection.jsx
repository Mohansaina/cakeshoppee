"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Search, Plus, Check } from "lucide-react";
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
    image: "/images/menu/pizza-veg-supreme.jpeg",
    description: "8-Inch Hand-Crafted Oven Pizzas",
  },
  {
    id: "burgers",
    label: "Burgers",
    emoji: "🍔",
    image: "/images/menu/burger-chicken.jpeg",
    description: "Crispy Veg, Paneer and Chicken Burgers",
  },
  {
    id: "sandwiches",
    label: "Sandwiches",
    emoji: "🥪",
    image: "/images/menu/sandwich-chicken-club.jpeg",
    description: "Fresh Toasted, Corn and Club Sandwiches",
  },
  {
    id: "chinese",
    label: "Chinese",
    emoji: "🥢",
    image: "/images/menu/chinese-chicken-fried-rice.jpeg",
    description: "Wok Fried Rice and Hakka Noodles",
  },
  {
    id: "snacks",
    label: "Snacks",
    emoji: "🍟",
    image: "/images/menu/snack-french-fries.jpeg",
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
  const { addToCart } = useCart();
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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
    return matchesCat && matchesSearch;
  });

  return (
    <section 
      className="our-menu-section" 
      id="bestsellers"
      style={{
        position: 'relative',
        zIndex: 10,
        background: '#f8fafc',
        isolation: 'isolate',
        overflow: 'hidden',
        padding: '64px 0 80px 0'
      }}
    >
      <div className="our-menu-inner" style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

        {/* Section Header */}
        <div className="our-menu-header" style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="our-menu-eyebrow">Fresh Kitchen &amp; Fast Food Menu</span>
          <br />
          <span className="section-badge" style={{ marginTop: '4px' }}>ONLINE MENU &amp; INSTANT ORDERING</span>
          <h2 className="our-menu-title" style={{ margin: '8px 0 10px 0' }}>Fresh Pizzas, Burgers &amp; Fast Food</h2>
          <p className="our-menu-subtitle" style={{ margin: '0 auto', maxWidth: '640px' }}>
            Oven-hot 8-inch pizzas, crispy burgers, toasted sandwiches, wok noodles &amp; fried rice with local door delivery in Narsipatnam town.
          </p>
        </div>

        {/* Visual Category Photo Cards (Desktop Grid & Smooth Touch-Swipeable Mobile Strip) */}
        <div className="our-menu-cat-strip" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCat === cat.id;
            const count = cat.id === "all"
              ? PRODUCTS.length
              : PRODUCTS.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`our-menu-cat-tile ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectCat(cat.id)}
                title={cat.description}
              >
                <div 
                  className="our-menu-cat-img-wrap"
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: '#f1f5f9'
                  }}
                >
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 640px) 115px, 160px"
                    className="our-menu-cat-img"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="our-menu-cat-overlay" />
                  <span className="our-menu-cat-floating-emoji">{cat.emoji}</span>
                  {isActive && <div className="our-menu-cat-active-ring" />}
                </div>
                <div className="our-menu-cat-label">
                  <span className="our-menu-cat-name">{cat.label}</span>
                  <span className="our-menu-cat-count">{count} Items</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="our-menu-toolbar" ref={gridRef} style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', padding: '12px 18px', marginBottom: '24px' }}>
          <div className="our-menu-toolbar-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
            <div 
              className="search-box" 
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                height: '44px',
                maxHeight: '44px',
                width: '100%',
                maxWidth: '520px',
                borderRadius: '999px',
                padding: '0 18px',
                boxSizing: 'border-box'
              }}
            >
              <Search size={18} color="#947e74" />
              <input
                type="text"
                placeholder="Search pizzas, burgers, sandwiches, noodles, puffs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '14px',
                  color: '#334155',
                  width: '100%'
                }}
              />
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
                <div key={product.id} className="product-card" style={{ position: 'relative', background: '#ffffff', overflow: 'hidden' }}>
                  <div className="product-thumb" style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', background: '#f8fafc' }}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: "cover", objectPosition: "center" }}
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
