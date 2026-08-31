"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Plus, Check } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function BestsellerProductsRow({ selectedCat, setSelectedCat, searchQuery }) {
  const { addToCart, setQuickViewProduct } = useCart();
  const [addedMap, setAddedMap] = useState({});

  const handleAdd = (p) => {
    addToCart(p);
    setAddedMap((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [p.id]: false }));
    }, 1500);
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
            <p className="section-head-sub">Prepared fresh daily • 100% pure eggless options available</p>
          </div>
          {setSelectedCat && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                className="view-all-button"
                style={{ background: selectedCat === 'all' ? '#e11d48' : '#f1f5f9', color: selectedCat === 'all' ? '#fff' : '#334155' }}
                onClick={() => setSelectedCat('all')}
              >
                All
              </button>
              <button 
                className="view-all-button"
                style={{ background: selectedCat === 'cakes' ? '#e11d48' : '#f1f5f9', color: selectedCat === 'cakes' ? '#fff' : '#334155' }}
                onClick={() => setSelectedCat('cakes')}
              >
                Cakes
              </button>
              <button 
                className="view-all-button"
                style={{ background: selectedCat === 'pastries' ? '#e11d48' : '#f1f5f9', color: selectedCat === 'pastries' ? '#fff' : '#334155' }}
                onClick={() => setSelectedCat('pastries')}
              >
                Pastries
              </button>
              <button 
                className="view-all-button"
                style={{ background: selectedCat === 'savouries' ? '#e11d48' : '#f1f5f9', color: selectedCat === 'savouries' ? '#fff' : '#334155' }}
                onClick={() => setSelectedCat('savouries')}
              >
                Savouries
              </button>
            </div>
          )}
        </div>

        <div className="products-4-grid">
          {filtered.map((product) => {
            const originalPrice = Math.round(product.price * 1.25);
            const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

            return (
              <div 
                key={product.id} 
                className="product-item-card"
                onClick={() => setQuickViewProduct(product)}
              >
                <div className="product-item-thumb">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                  {product.bestseller && (
                    <span className="product-mini-tag">Bestseller</span>
                  )}
                </div>

                <div className="product-item-body">
                  <h4 className="product-item-title">{product.name} ({product.weight})</h4>
                  
                  <div className="product-price-row">
                    <div className="price-flex-group">
                      <span className="main-price">₹{product.price}</span>
                      <span className="old-price">₹{originalPrice}</span>
                      <span className="off-tag">{discount}% off</span>
                    </div>

                    <span className="rating-pill-badge">
                      {product.rating} <Star size={10} fill="#ffffff" color="#ffffff" />
                    </span>
                  </div>

                  <button
                    className="card-add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(product);
                    }}
                  >
                    {addedMap[product.id] ? (
                      <>
                        <Check size={14} style={{ display: 'inline', marginRight: '4px' }} /> Added!
                      </>
                    ) : (
                      <>
                        <Plus size={14} style={{ display: 'inline', marginRight: '4px' }} /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
