"use client";

import React, { useState } from 'react';
import { Sparkles, FileText, ShoppingBag, Check, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const SHOP_COOL_CAKES = [
  { name: "Vanilla", p05: 300, p1: 550 },
  { name: "Butterscotch", p05: 350, p1: 650 },
  { name: "Strawberry", p05: 350, p1: 700 },
  { name: "Pineapple", p05: 350, p1: 750 },
  { name: "Milky Butterscotch", p05: 450, p1: 900 },
  { name: "Blue Berry", p05: 400, p1: 800 },
  { name: "Black Current", p05: 400, p1: 800 },
  { name: "White Forest", p05: 450, p1: 900 },
  { name: "Choco Vennela", p05: 450, p1: 900 },
  { name: "Black Forest", p05: 400, p1: 850 },
  { name: "Chocolate", p05: 400, p1: 900 },
  { name: "Choco Chip", p05: 450, p1: 950 },
  { name: "Choco Almond", p05: 450, p1: 950 },
  { name: "Choco Crunch", p05: 450, p1: 950 },
  { name: "Double Chocolate", p05: 600, p1: 1250 },
  { name: "Fresh Fruit", p05: 550, p1: 1200 },
  { name: "RedVelvet", p05: 450, p1: 950 },
  { name: "Honey Almond", p05: 450, p1: 950 }
];

export default function ShopMenuBoard() {
  const { addToCart } = useCart();
  const [addedItem, setAddedItem] = useState('');

  const handleQuickAdd = (name, weight, price) => {
    const itemToAdd = {
      id: `shop-${name.toLowerCase().replace(/\s+/g, '-')}-${weight.replace(/\s+/g, '')}`,
      name: `${name} Cool Cake (${weight})`,
      price: price,
      weight: weight,
      image: '/images/blackforest.jpg',
      eggless: true
    };
    addToCart(itemToAdd);
    setAddedItem(`${name}-${weight}`);
    setTimeout(() => setAddedItem(''), 1500);
  };

  return (
    <section className="shop-menu-board-section" id="menu-board" style={{ padding: '40px 15px', background: '#121214' }}>
      <div className="container" style={{ maxWidth: '680px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
            ✨ Official In-Store Menu Card
          </span>
          <h2 style={{ color: '#ffffff', fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '6px 0 4px 0' }}>
            Cake Shoppee Physical Shop Menu
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
            Exact rate card used at our shop counter near Abes Centre, Narsipatnam Main Road.
          </p>
        </div>

        {/* ── Exact Shop Menu Card Representation ── */}
        <div style={{
          background: '#000000',
          border: '3px solid #ffffff',
          borderRadius: '16px',
          padding: '24px 20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif'
        }}>
          
          {/* Header Logo Text */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #ffffff', paddingBottom: '14px', marginBottom: '16px' }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2.5rem',
              fontWeight: '900',
              fontStyle: 'italic',
              margin: '0',
              letterSpacing: '1px',
              color: '#ffffff'
            }}>
              Cake Shoppee
            </h1>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '2rem',
              fontWeight: '900',
              letterSpacing: '8px',
              color: '#ffffff',
              marginTop: '4px'
            }}>
              CAKES
            </div>
          </div>

          {/* Table Column Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr 1fr 1fr',
            alignItems: 'center',
            borderBottom: '1px solid #333333',
            paddingBottom: '10px',
            marginBottom: '10px',
            fontSize: '1.25rem',
            fontWeight: '900'
          }}>
            <span style={{ color: '#dc2626', fontSize: '1.4rem' }}>cool cakes</span>
            <span style={{ color: '#dc2626', textAlign: 'center' }}>1/2 Kgs</span>
            <span style={{ color: '#dc2626', textAlign: 'right' }}>1Kgs</span>
          </div>

          {/* Menu Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SHOP_COOL_CAKES.map((item) => (
              <div
                key={item.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.8fr 1fr 1fr',
                  alignItems: 'center',
                  padding: '4px 0',
                  borderBottom: '1px solid #1a1a1a',
                  fontSize: '1rem',
                  fontWeight: '700'
                }}
              >
                <span style={{ color: '#ffffff' }}>{item.name}</span>

                {/* 1/2 Kg price button */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(item.name, '0.5 kg', item.p05)}
                    style={{
                      background: addedItem === `${item.name}-0.5 kg` ? '#15803d' : '#18181b',
                      color: '#ffffff',
                      border: '1px solid #3f3f46',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      transition: 'all 0.2s ease'
                    }}
                    title="Click to order 1/2 Kg"
                  >
                    {item.p05}/-
                  </button>
                </div>

                {/* 1 Kg price button */}
                <div style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(item.name, '1 kg', item.p1)}
                    style={{
                      background: addedItem === `${item.name}-1 kg` ? '#15803d' : '#18181b',
                      color: '#ffffff',
                      border: '1px solid #3f3f46',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      transition: 'all 0.2s ease'
                    }}
                    title="Click to order 1 Kg"
                  >
                    {item.p1}/-
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Big Bold Red Footer as seen in physical menu image */}
          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #333333'
          }}>
            <span style={{
              color: '#dc2626',
              fontSize: '2.1rem',
              fontWeight: '900',
              letterSpacing: '1px',
              fontFamily: "'Outfit', sans-serif"
            }}>
              eggless extra 100
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
