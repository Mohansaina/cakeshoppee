"use client";

import React from 'react';
import Image from 'next/image';

export default function ThreePromoBanners({ onSelectCategory }) {
  const handleClick = (catKey) => {
    if (catKey === 'custom') {
      const el = document.getElementById('custom-cake');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (catKey === 'combos') {
      const el = document.getElementById('combos');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (onSelectCategory) onSelectCategory(catKey);
      const el = document.getElementById('bestsellers');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="three-banners-section">
      <div className="container">
        <div className="three-banners-grid">
          
          {/* Card 1 */}
          <div className="banner-box" onClick={() => handleClick('cakes')}>
            <div className="banner-bg-img">
              <Image
                src="/images/image4.jpg"
                alt="Celebrate in Style with Every Slice"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="banner-overlay-content">
              <h3 className="banner-title">Celebrate in Style with Every Slice</h3>
              <p className="banner-subtitle">Signature Black Forest, Truffle & Fresh Fruit Cakes</p>
              <button className="banner-pill-btn btn-orange">
                Shop Cakes &gt;
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="banner-box" onClick={() => handleClick('combos')}>
            <div className="banner-bg-img">
              <Image
                src="/images/image5.png"
                alt="SALE Amazing Discounts on Combos"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="banner-overlay-content">
              <h3 className="banner-title">SALE - Amazing Discounts on Combos &amp; More!</h3>
              <p className="banner-subtitle">Save up to 20% on birthday party celebration bundles</p>
              <button className="banner-pill-btn btn-teal">
                Grab the Deals &gt;
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="banner-box" onClick={() => handleClick('custom')}>
            <div className="banner-bg-img">
              <Image
                src="/images/image2.ong"
                alt="Live Custom Theme Cakes"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="banner-overlay-content">
              <h3 className="banner-title">Live Custom Theme Cakes &amp; 2-Tiers</h3>
              <p className="banner-subtitle">Bring your theme or photo – frosted live in front of you</p>
              <button className="banner-pill-btn btn-pink">
                Customise Cake &gt;
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
