"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function PromoBanners({ onSelectCategory }) {
  return (
    <section className="promo-banners-section">
      <div className="container">
        <div className="promo-banners-grid">
          
          {/* Card 1: Fresh Cream Cakes */}
          <div 
            className="promo-banner-card promo-card-1"
            onClick={() => onSelectCategory('cakes')}
          >
            <div className="promo-bg-image">
              <Image 
                src="/images/image4.jpg" 
                alt="Fresh Cream Cakes" 
                fill 
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover' }} 
              />
            </div>
            <div className="promo-card-overlay">
              <span className="promo-pill">🎂 FRESH FROM OVEN</span>
              <h3 className="promo-heading">Celebrate in Style with Every Slice</h3>
              <p className="promo-desc">Black forest, chocolate gateau & fruit cakes prepared fresh daily.</p>
              <button className="promo-action-btn">
                Shop Cakes <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 2: Party Combos */}
          <div 
            className="promo-banner-card promo-card-2"
            onClick={() => onSelectCategory('combos')}
          >
            <div className="promo-bg-image">
              <Image 
                src="/images/image5.png" 
                alt="Party Deals & Combos" 
                fill 
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover' }} 
              />
            </div>
            <div className="promo-card-overlay highlight-center">
              <span className="promo-pill sale-pill">⚡ SAVE UP TO 20%</span>
              <h3 className="promo-heading">Special Party Combos & Snack Boxes</h3>
              <p className="promo-desc">Cake + crispy puffs + party accessories bundled together.</p>
              <button className="promo-action-btn btn-grab">
                Grab The Deals <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 3: Custom Theme Cakes */}
          <div 
            className="promo-banner-card promo-card-3"
            onClick={() => onSelectCategory('custom')}
          >
            <div className="promo-bg-image">
              <Image 
                src="/images/image2.ong" 
                alt="Custom 2-Tier Theme Cakes" 
                fill 
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover' }} 
              />
            </div>
            <div className="promo-card-overlay">
              <span className="promo-pill live-pill">✨ LIVE DECOR COUNTER</span>
              <h3 className="promo-heading">Custom Theme Birthday & 2-Tier Cakes</h3>
              <p className="promo-desc">Your favorite photos and themes crafted live on-demand.</p>
              <button className="promo-action-btn">
                Order Custom <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
