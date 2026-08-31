"use client";

import React from 'react';
import Image from 'next/image';

const CURATED_5 = [
  {
    id: 1,
    title: "Birthday Cakes",
    desc: "Baked to Celebrate Every Wish",
    image: "/images/image4.jpg",
    catKey: "cakes"
  },
  {
    id: 2,
    title: "Bento & Pastries",
    desc: "Single Portion Goodness",
    image: "/images/image5.png",
    catKey: "pastries"
  },
  {
    id: 3,
    title: "Hot Savouries",
    desc: "Oven-Hot Puffs & Pizzas",
    image: "/images/image3.jpg",
    catKey: "savouries"
  },
  {
    id: 5,
    title: "Customised Combos",
    desc: "Celebrate Your Way",
    image: "/images/image2.ong",
    catKey: "custom"
  }
];

export default function CuratedCategoriesGrid({ onSelectCategory }) {
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
    <section className="curated-categories-section">
      <div className="container">
        <div className="curated-5-grid">
          {CURATED_5.map((item) => (
            <div 
              key={item.id} 
              className="curated-card"
              onClick={() => handleClick(item.catKey)}
            >
              <h4 className="curated-title">{item.title}</h4>
              <p className="curated-desc">{item.desc}</p>
              <div className="curated-img-frame">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
