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
    emoji: "??",
    image: "/images/blackforest.jpg",
    description: "Browse everything we make",
  },
  {
    id: "cakes",
    label: "Signature Cakes",
    emoji: "??",
    image: "/images/blackforest.jpg",
    description: "Black Forest, Red Velvet & Fruit Cakes",
  },
  {
    id: "pastries",
    label: "Gourmet Pastries",
    emoji: "??",
    image: "/images/chocoalmond.jpg",
    description: "Choco Almond & Fruit Pastry Slices",
  },
  {
    id: "savouries",
    label: "Hot Fast Food",
    emoji: "??",
    image: "/images/vegpizza.jpg",
    description: "Pizzas, Burgers & Grilled Sandwiches",
  },
  {
    id: "shakes",
    label: "Thick Milkshakes",
    emoji: "??",
    image: "/images/oreomilkshake.jpg",
    description: "Oreo, Kulfi & Strawberry Shakes",
  },
  {
    id: "party",
    label: "Party Essentials",
    emoji: "??",
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

  const handleAddToCart = (product) => {
    addToCart(product);
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
          <span className="our-menu-eyebrow">Authentic Taste &amp; Quality</span>
          <span className="section-badge">ONLINE MENU &amp; INSTANT ORDERING</span>
          <h2 className="our-menu-title">Fresh Bakes &amp; Counter Specials</h2>
          <p className="our-menu-subtitle">
            Order fresh bakes for fast takeaway pickup or door delivery anywhere in Narsipatnam town.
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
              <span className="toggle-label">?? 100% Eggless Only</span>
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
                  ?
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
              <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>??</div>
              <h3 style={{ fontSize: "1.4rem", color: "#1f110a", marginBottom: "6px" }}>
                No Delights Found
              </h3>
              <p style={{ color: "#695247" }}>
                Try adjusting your search keywords or switching category filters.
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-thumb">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />

                  {/* Clean product photo without overlay badges */}
                </div>

                <div className="product-details">
                  <div className="product-meta">
                    <span className="product-rating">? {product.rating}</span>
                    <span className="product-weight">{product.weight}</span>
                  </div>

                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>

                  <div className="product-footer">
                    <span className="product-price">Rs.{product.price}</span>
                    <button
                      className="add-cart-btn"
                      onClick={() => handleAddToCart(product)}
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
            ))
          )}
        </div>

      </div>
    </section>
  );
}
