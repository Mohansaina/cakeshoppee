"use client";

import React from 'react';
import Image from 'next/image';
import { X, Plus, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCart();

  if (!quickViewProduct) return null;

  return (
    <div className="modal-backdrop" onClick={() => setQuickViewProduct(null)}>
      <div className="quick-view-card" onClick={(e) => e.stopPropagation()}>
        
        <button
          className="modal-close-btn"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close product preview"
        >
          <X size={20} />
        </button>

        <div className="quick-view-media">
          <Image
            src={quickViewProduct.image}
            alt={quickViewProduct.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className="quick-view-info">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className={`diet-badge ${quickViewProduct.eggless ? 'eggless' : 'egg'}`} style={{ position: 'static' }}>
              <span className="diet-badge-dot"></span>
            </span>
            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: quickViewProduct.eggless ? '#15803d' : '#b91c1c' }}>
              {quickViewProduct.eggless ? '100% Pure Eggless' : 'Contains Egg'}
            </span>
            {quickViewProduct.tag && (
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', background: '#f5ecd9', color: '#c48b3b', padding: '3px 10px', borderRadius: '99px', fontWeight: '700' }}>
                {quickViewProduct.tag}
              </span>
            )}
          </div>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#1f110a', marginBottom: '8px' }}>
            {quickViewProduct.name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ fontWeight: '700', color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: '99px', fontSize: '0.82rem' }}>
              ★ {quickViewProduct.rating || 4.9}
            </span>
            <span style={{ fontSize: '0.86rem', color: '#695247', fontWeight: '600' }}>
              Portion / Weight: {quickViewProduct.weight}
            </span>
          </div>

          <p style={{ fontSize: '0.92rem', color: '#695247', lineHeight: '1.6', marginBottom: '16px' }}>
            {quickViewProduct.description}
          </p>

          {quickViewProduct.flavorNotes && (
            <div style={{ background: '#f9f5ee', padding: '10px 14px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ebdcd1' }}>
              <span style={{ fontSize: '0.8rem', color: '#947e74', fontWeight: '600', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tasting Notes
              </span>
              <span style={{ fontSize: '0.88rem', color: '#1f110a', fontWeight: '600' }}>
                {quickViewProduct.flavorNotes}
              </span>
            </div>
          )}

          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px dashed #ebdcd1' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: '700', color: '#1f110a' }}>
              ₹{quickViewProduct.price}
            </span>

            <button
              className="btn btn-primary"
              onClick={() => {
                addToCart(quickViewProduct);
                setQuickViewProduct(null);
              }}
            >
              <Plus size={16} /> Add to Cart
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
