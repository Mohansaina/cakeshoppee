"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Check, Users, Sparkles } from 'lucide-react';
import { CELEBRATION_COMBOS } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function CelebrationCombos() {
  const { addToCart } = useCart();
  const [addedMap, setAddedMap] = useState({});

  const handleAddCombo = (combo) => {
    const item = {
      id: combo.id,
      name: combo.title,
      price: combo.price,
      image: combo.image,
      weight: combo.subtitle,
      eggless: combo.eggless !== false
    };
    addToCart(item);
    setAddedMap((prev) => ({ ...prev, [combo.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [combo.id]: false }));
    }, 1500);
  };

  return (
    <section 
      className="combos-section" 
      id="combos"
      style={{
        position: 'relative',
        zIndex: 10,
        background: '#ffffff',
        isolation: 'isolate'
      }}
    >
      <div className="container">
        
        <div className="section-head-bar">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff7ed', color: '#c2410c', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
              <Sparkles size={14} /> Official Bakery Combos
            </div>
            <h2 className="section-head-title">Party Celebration Combos</h2>
            <p className="section-head-sub">Crafted from our live kitchen menu • Bundled savings on fresh cakes, hot pizzas & crispy snacks</p>
          </div>
        </div>

        <div className="combos-grid">
          {CELEBRATION_COMBOS.map((combo) => (
            <div key={combo.id} className="combo-card">
              
              <span className="combo-badge-top">{combo.badge}</span>

              <div className="combo-image-wrap">
                <Image
                  src={combo.image}
                  alt={combo.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className="combo-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span className={`fssai-indicator ${combo.isVeg ? 'veg' : 'nonveg'}`} title={combo.isVeg ? '100% Vegetarian' : 'Contains Non-Veg'}>
                    <span className="fssai-dot" />
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={12} /> {combo.idealFor}
                  </span>
                </div>

                <h3 className="combo-title">{combo.title}</h3>
                <p className="combo-subtitle">{combo.subtitle}</p>

                <ul className="combo-items-list">
                  {combo.items.map((it, idx) => (
                    <li key={idx}>
                      <Check size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>

                <div className="combo-pricing">
                  <span className="combo-current-price">₹{combo.price}</span>
                  <span className="combo-original-price">₹{combo.originalPrice}</span>
                  <span className="combo-savings-tag">{combo.savings}</span>
                </div>

                <button
                  className="btn-primary btn-block"
                  style={{ minHeight: '46px', touchAction: 'manipulation' }}
                  onClick={() => handleAddCombo(combo)}
                >
                  {addedMap[combo.id] ? (
                    <>
                      <Check size={16} style={{ display: 'inline', marginRight: '6px' }} /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <Plus size={16} style={{ display: 'inline', marginRight: '6px' }} /> Add Combo to Cart
                    </>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}