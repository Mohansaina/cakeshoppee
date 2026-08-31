"use client";

import React from 'react';
import Image from 'next/image';

const CIRCLE_ITEMS = [
  { id: 1, label: "Birthday Cakes", image: "/images/image4.jpg", catKey: "cakes" },
  { id: 2, label: "Chocolate Cakes", image: "/images/image5.png", catKey: "cakes" },
  { id: 3, label: "Bento Cakes", image: "/images/image4.jpg", catKey: "cakes" },
  { id: 4, label: "Kids Themes", image: "/images/image2.ong", catKey: "custom" },
  { id: 5, label: "Pastry Slices", image: "/images/image5.png", catKey: "pastries" },
  { id: 6, label: "Hot Puffs", image: "/images/image3.jpg", catKey: "savouries" },
  { id: 7, label: "Pizzas & Burgers", image: "/images/image1.png", catKey: "savouries" },
  { id: 8, label: "Party Combos", image: "/images/image7.jpg", catKey: "combos" }
];

export default function CategoryCirclesRow({ onSelectCategory }) {
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
    <section className="category-circles-section">
      <div className="container">
        <div className="circles-grid">
          {CIRCLE_ITEMS.map((item) => (
            <div 
              key={item.id} 
              className="circle-card-item"
              onClick={() => handleClick(item.catKey)}
            >
              <div className="circle-card-frame">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  sizes="120px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <span className="circle-card-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
