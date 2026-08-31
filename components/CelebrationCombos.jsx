"use client";

import React from 'react';
import Image from 'next/image';
import { Plus, Check } from 'lucide-react';
import { CELEBRATION_COMBOS } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function CelebrationCombos() {
  const { addToCart } = useCart();
  const [addedMap, setAddedMap] = React.useState({});

  const handleAddCombo = (combo) => {
    const item = {
      id: combo.id,
      name: combo.title,
      price: combo.price,
      image: combo.image,
      weight: combo.subtitle,
      eggless: true
    };
    addToCart(item);
    setAddedMap((prev) => ({ ...prev, [combo.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [combo.id]: false }));
    }, 1500);
  };

  return (
    <section className="combos-section" id="combos">
      <div className="container">
        
        <div className="section-head-bar">
          <div>
            <h2 className="section-head-title">Party Celebration Combos</h2>
            <p className="section-head-sub">Complete party packages • Bundled savings on cakes & snacks</p>
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className="combo-body">
                <h3 className="combo-title">{combo.title}</h3>
                <p className="combo-subtitle">{combo.subtitle}</p>

                <ul className="combo-items-list">
                  {combo.items.map((it, idx) => (
                    <li key={idx}>
                      <Check size={14} color="#16a34a" />
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
                  onClick={() => handleAddCombo(combo)}
                >
                  {addedMap[combo.id] ? (
                    <>
                      <Check size={16} style={{ display: 'inline', marginRight: '4px' }} /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <Plus size={16} style={{ display: 'inline', marginRight: '4px' }} /> Add Combo to Cart
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
