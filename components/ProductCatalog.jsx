"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Eye, Plus, Check } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function ProductCatalog({ selectedCat, setSelectedCat }) {
  const { addToCart, setQuickViewProduct } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [egglessOnly, setEgglessOnly] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState({});

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.flavorNotes && p.flavorNotes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesEggless = egglessOnly ? p.eggless : true;

    return matchesCat && matchesSearch && matchesEggless;
  });

  return (
    <section className="section menu-section" id="bestsellers">
      <div className="container">
        
        <div className="section-header text-center">
          <span className="handwritten">Authentic Taste & Quality</span>
          <br />
          <span className="section-badge">ONLINE MENU & INSTANT ORDERING</span>
          <h2 className="section-title">Fresh Bakes & Counter Specials</h2>
          <p className="section-subtitle">
            Order fresh bakes for fast takeaway pickup or door delivery anywhere in Narsipatnam town.
          </p>
        </div>

        {/* Toolbar */}
        <div className="menu-toolbar">
          
          <div className="filter-pills">
            <button
              className={`filter-btn ${selectedCat === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCat('all')}
            >
              🍰 All Delights
            </button>
            <button
              className={`filter-btn ${selectedCat === 'cakes' ? 'active' : ''}`}
              onClick={() => setSelectedCat('cakes')}
            >
              🎂 Signature Cakes
            </button>
            <button
              className={`filter-btn ${selectedCat === 'pastries' ? 'active' : ''}`}
              onClick={() => setSelectedCat('pastries')}
            >
              🧁 Pastries & Slices
            </button>
            <button
              className={`filter-btn ${selectedCat === 'savouries' ? 'active' : ''}`}
              onClick={() => setSelectedCat('savouries')}
            >
              🥟 Puffs, Pizzas & Burgers
            </button>
            <button
              className={`filter-btn ${selectedCat === 'shakes' ? 'active' : ''}`}
              onClick={() => setSelectedCat('shakes')}
            >
              🥤 Thick Shakes & Drinks
            </button>
            <button
              className={`filter-btn ${selectedCat === 'party' ? 'active' : ''}`}
              onClick={() => setSelectedCat('party')}
            >
              🎁 Party Essentials
            </button>
          </div>

          <div className="toolbar-search-row">
            <div className="search-box">
              <Search size={18} color="#947e74" />
              <input
                type="text"
                placeholder="Search cakes, puffs, milkshakes, pizzas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="toggle-group">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={egglessOnly}
                  onChange={(e) => setEgglessOnly(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">🌱 100% Eggless Only</span>
            </div>
          </div>

        </div>

        {/* Product Cards */}
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="empty-notice text-center" style={{ gridColumn: '1 / -1', padding: '60px 20px' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🧁</div>
              <h3 style={{ fontSize: '1.4rem', color: '#1f110a', marginBottom: '6px' }}>No Delights Found</h3>
              <p style={{ color: '#695247' }}>Try adjusting your search keywords or switching category filters.</p>
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
                    style={{ objectFit: 'cover' }}
                  />
                  
                  <div
                    className={`diet-badge ${product.eggless ? 'eggless' : 'egg'}`}
                    title={product.eggless ? '100% Eggless' : 'Contains Egg'}
                  >
                    <span className="diet-badge-dot"></span>
                  </div>

                  {product.tag && (
                    <span className="product-tag">{product.tag}</span>
                  )}

                  <button
                    className="quick-view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(product);
                    }}
                  >
                    <Eye size={14} /> Quick View
                  </button>
                </div>

                <div className="product-details">
                  <div className="product-meta">
                    <span className="product-rating">★ {product.rating}</span>
                    <span className="product-weight">{product.weight}</span>
                  </div>
                  
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  
                  <div className="product-footer">
                    <span className="product-price">₹{product.price}</span>
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
