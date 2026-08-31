"use client";

import React from 'react';
import Image from 'next/image';

const CATEGORY_BUBBLES = [
  {
    id: "cat-1",
    key: "cakes",
    title: "Signature Cakes",
    image: "/images/image4.jpg",
    badge: "Fresh Daily"
  },
  {
    id: "cat-2",
    key: "custom",
    title: "Custom Live Cakes",
    image: "/images/image2.ong",
    badge: "Live Counter"
  },
  {
    id: "cat-3",
    key: "pastries",
    title: "Pastries & Slices",
    image: "/images/image5.png",
    badge: "100% Eggless"
  },
  {
    id: "cat-4",
    key: "savouries",
    title: "Hot Oven Puffs",
    image: "/images/image3.jpg",
    badge: "Crispy"
  },
  {
    id: "cat-5",
    key: "savouries",
    title: "Pizzas & Burgers",
    image: "/images/image1.png",
    badge: "Made to Order"
  },
  {
    id: "cat-6",
    key: "shakes",
    title: "Thick Shakes",
    image: "/images/image6.jpg",
    badge: "Ice Cold"
  },
  {
    id: "cat-7",
    key: "combos",
    title: "Party Combos",
    image: "/images/image5.png",
    badge: "Save 20%"
  },
  {
    id: "cat-8",
    key: "party",
    title: "Party Props",
    image: "/images/image7.jpg",
    badge: "Candles & Caps"
  }
];

export default function CategoryBubbles({ onSelectCategory }) {
  return (
    <section className="category-bubbles-section">
      <div className="container">
        <div className="bubbles-scroll-container">
          {CATEGORY_BUBBLES.map((cat) => (
            <div
              key={cat.id}
              className="bubble-item"
              onClick={() => onSelectCategory(cat.key)}
            >
              <div className="bubble-img-frame">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="120px"
                  style={{ objectFit: 'cover' }}
                />
                {cat.badge && (
                  <span className="bubble-badge">{cat.badge}</span>
                )}
              </div>
              <span className="bubble-title">{cat.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
