"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Star, Plus, Check } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function BestsellerProductsRow({ selectedCat, setSelectedCat, searchQuery }) {
  const { addToCart, setQuickViewProduct } = useCart();
  const [addedMap, setAddedMap] = useState({});
  const [isSeriesPaused, setIsSeriesPaused] = useState(false);
  const trackRef = useRef(null);

  const handleAdd = (p) => {
    addToCart(p);
    setAddedMap((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [p.id]: false }));
    }, 1500);
  };

  const scrollTrack = (direction) => {
    if (trackRef.current && trackRef.current.parentElement) {
      const scrollAmount = direction === "left" ? -280 : 280;
      trackRef.current.parentElement.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const filtered = PRODUCTS.filter((p) => {
    const matchesCat = !selectedCat || selectedCat === 'all' || p.category === selectedCat;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section className="bestsellers-section" id="bestsellers">
      <div className="container">
        
        <div className="section-head-bar">
          <div>
            <h2 className="section-head-title">Fresh Counter Bestsellers</h2>
            <p className="section-head-sub">Moving series showcase • Touch or hover anywhere to pause</p>
          </div>
          {setSelectedCat && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                className="view-all-button"
                style={{ background: selectedCat === 'all' ? '#ea580c' : '#f1f5f9', color: selectedCat === 'all' ? '#fff' : '#334155' }}
                onClick={() => setSelectedCat('all')}
              >
                All
              </button>
              <button 
                className="view-all-button"
                style={{ background: selectedCat === 'cakes' ? '#ea580c' : '#f1f5f9', color: selectedCat === 'cakes' ? '#fff' : '#334155' }}
                onClick={() => setSelectedCat('cakes')}
              >
                Cakes
              </button>
              <button 
                className="view-all-button"
                style={{ background: selectedCat === 'pizzas' ? '#ea580c' : '#f1f5f9', color: selectedCat === 'pizzas' ? '#fff' : '#334155' }}
                onClick={() => setSelectedCat('pizzas')}
              >
                Pizzas
              </button>
              <button 
                className="view-all-button"
                style={{ background: selectedCat === 'burgers' ? '#ea580c' : '#f1f5f9', color: selectedCat === 'burgers' ? '#fff' : '#334155' }}
                onClick={() => setSelectedCat('burgers')}
              >
                Burgers
              </button>
              <button 
                className="view-all-button"
                style={{ background: selectedCat === 'sandwiches' ? '#ea580c' : '#f1f5f9', color: selectedCat === 'sandwiches' ? '#fff' : '#334155' }}
                onClick={() => setSelectedCat('sandwiches')}
              >
                Sandwiches
              </button>
              <button 
                className="view-all-button"
                style={{ background: selectedCat === 'chinese' ? '#ea580c' : '#f1f5f9', color: selectedCat === 'chinese' ? '#fff' : '#334155' }}
                onClick={() => setSelectedCat('chinese')}
              >
                Chinese
              </button>
              <button 
                className="view-all-button"
                style={{ background: selectedCat === 'snacks' ? '#ea580c' : '#f1f5f9', color: selectedCat === 'snacks' ? '#fff' : '#334155' }}
                onClick={() => setSelectedCat('snacks')}
              >
                Snacks
              </button>
            </div>
          )}
        </div>

        {/* Continuous Moving Series Carousel Row (Pause on Touch / Hover) */}
        <div className="series-motion-container">
          <div className="series-motion-header" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
              Showing {filtered.length} items gliding in series
            </span>

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
              {[...filtered, ...filtered].map((product, idx) => {
                const isItemAdded = addedMap[product.id];
                return (
                  <div
                    key={`${product.id}-bestseller-series-${idx}`}
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
                            handleAdd(product);
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

      </div>
    </section>
  );
}
