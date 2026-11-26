"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Check, Sparkles, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function EgglessChoiceModal() {
  const { pendingEgglessCake, setPendingEgglessCake, confirmEgglessCake } = useCart();
  const [selectedOption, setSelectedOption] = useState('eggless'); // default to 'eggless' as bakery bestseller

  if (!pendingEgglessCake) return null;

  const basePrice = Number(pendingEgglessCake.price) || 350;
  const egglessPrice = basePrice + 100;
  const currentPrice = selectedOption === 'eggless' ? egglessPrice : basePrice;

  const handleConfirm = (option) => {
    const isEggless = (option || selectedOption) === 'eggless';
    confirmEgglessCake(pendingEgglessCake, isEggless);
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={() => setPendingEgglessCake(null)}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(3px)'
      }}
    >
      <div 
        className="eggless-choice-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header Strip with Cake Summary */}
        <div style={{
          position: 'relative',
          padding: '18px 20px',
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          borderBottom: '1px solid #fed7aa',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            position: 'relative',
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            overflow: 'hidden',
            flexShrink: 0,
            border: '2px solid #ffffff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <Image
              src={pendingEgglessCake.image || '/images/cakes/vanilla-cool-cake.jpg'}
              alt={pendingEgglessCake.name}
              fill
              sizes="64px"
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#ea580c' }}>
              Cake Sponge Recipe
            </span>
            <h3 style={{ margin: '2px 0 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {pendingEgglessCake.name}
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
              Portion: {pendingEgglessCake.weight || '0.5 kg'}
            </span>
          </div>

          <button
            onClick={() => setPendingEgglessCake(null)}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            <X size={16} color="#64748b" />
          </button>
        </div>

        {/* Modal Body with 2 Options */}
        <div style={{ padding: '20px' }}>
          <p style={{ margin: '0 0 14px 0', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
            Would you like this cake prepared <strong style={{ color: '#16a34a' }}>100% Pure Eggless</strong> or Regular?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* OPTION 1: 100% Pure Eggless (+₹100) */}
            <div
              onClick={() => setSelectedOption('eggless')}
              style={{
                padding: '14px 16px',
                borderRadius: '14px',
                border: selectedOption === 'eggless' ? '2.5px solid #16a34a' : '1.5px solid #e2e8f0',
                background: selectedOption === 'eggless' ? '#f0fdf4' : '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  border: selectedOption === 'eggless' ? '6px solid #16a34a' : '2px solid #cbd5e1',
                  background: '#ffffff',
                  marginTop: '2px',
                  flexShrink: 0
                }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#14532d' }}>
                      🌱 100% Pure Eggless
                    </span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ffffff', background: '#16a34a', padding: '1px 7px', borderRadius: '99px' }}>
                      +₹100
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: '#15803d' }}>
                    100% Pure Vegetarian sponge baked with milk solids & natural vanilla.
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#14532d' }}>
                  ₹{egglessPrice}
                </div>
                <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>
                  (₹{basePrice} + ₹100)
                </span>
              </div>
            </div>

            {/* OPTION 2: Regular (With Egg) */}
            <div
              onClick={() => setSelectedOption('regular')}
              style={{
                padding: '14px 16px',
                borderRadius: '14px',
                border: selectedOption === 'regular' ? '2.5px solid #ea580c' : '1.5px solid #e2e8f0',
                background: selectedOption === 'regular' ? '#fff7ed' : '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  border: selectedOption === 'regular' ? '6px solid #ea580c' : '2px solid #cbd5e1',
                  background: '#ffffff',
                  marginTop: '2px',
                  flexShrink: 0
                }} />
                <div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                    🥚 Regular Recipe (With Egg)
                  </div>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Traditional bakery sponge made with fresh farm eggs. Light & airy.
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                  ₹{basePrice}
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                  Standard Rate
                </span>
              </div>
            </div>

          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={() => handleConfirm(selectedOption)}
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: selectedOption === 'eggless' ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              color: '#ffffff',
              fontSize: '0.96rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: selectedOption === 'eggless' ? '0 10px 20px -5px rgba(22, 163, 74, 0.4)' : '0 10px 20px -5px rgba(234, 88, 12, 0.4)',
              touchAction: 'manipulation'
            }}
          >
            <span>Add to Cart • ₹{currentPrice}</span>
            <Check size={18} />
          </button>

          <p style={{ margin: '10px 0 0 0', fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center' }}>
            Freshly baked at Cake Shoppee Narsipatnam live counter
          </p>
        </div>

      </div>
    </div>
  );
}
