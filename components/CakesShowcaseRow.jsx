"use client";

import React from 'react';
import Image from 'next/image';

const CAKES_4 = [
  {
    id: "c1",
    title: "Photo Cakes",
    priceText: "Starting From ₹550",
    image: "/images/image2.ong",
    catKey: "custom"
  },
  {
    id: "c2",
    title: "Pinata & Heart Cakes",
    priceText: "Starting From ₹699",
    image: "/images/image4.jpg",
    catKey: "cakes"
  },
  {
    id: "c3",
    title: "Bento Cakes",
    priceText: "Starting From ₹199",
    image: "/images/image5.png",
    catKey: "pastries"
  },
  {
    id: "c4",
    title: "Kids Theme Cakes",
    priceText: "Starting From ₹749",
    image: "/images/image2.ong",
    catKey: "custom"
  }
];

export default function CakesShowcaseRow({ onSelectCategory }) {
  const handleClick = (catKey) => {
    if (catKey === 'custom') {
      const el = document.getElementById('custom-cake');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (onSelectCategory) onSelectCategory(catKey);
      const el = document.getElementById('bestsellers');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="cakes-showcase-section">
      <div className="container">
        
        <div className="section-head-bar">
          <div>
            <h2 className="section-head-title">Cakes</h2>
            <p className="section-head-sub">Dreamy cakes for every occasion</p>
          </div>
          <button 
            className="view-all-button"
            onClick={() => handleClick('cakes')}
          >
            VIEW ALL
          </button>
        </div>

        <div className="cakes-4-grid">
          {CAKES_4.map((card) => (
            <div 
              key={card.id} 
              className="cake-feature-card"
              onClick={() => handleClick(card.catKey)}
            >
              <div className="cake-img-box">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="cake-feature-info">
                <h4 className="cake-feature-name">{card.title}</h4>
                <span className="cake-feature-price">{card.priceText}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
