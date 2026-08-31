"use client";

import React from 'react';
import Image from 'next/image';

const SHOWCASE_CAKES = [
  {
    id: 1,
    title: "Cocomelon Rainbow 2-Tier Theme Cake",
    image: "/images/bespoke-theme-1.jpg",
    alt: "2-Tier Cocomelon Rainbow Custom Theme Cake - Cake Shopee",
  },
  {
    id: 2,
    title: "Jungle Safari 2-Tier Animal Theme Cake",
    image: "/images/bespoke-theme-2.jpg",
    alt: "2-Tier Jungle Safari Animal Custom Theme Cake - Cake Shopee",
  },
  {
    id: 3,
    title: "Lavender & Gold Stars 2-Tier Theme Cake",
    image: "/images/bespoke-theme-3.jpg",
    alt: "2-Tier Lavender & Gold Stars Theme Cake - Cake Shopee",
  },
  {
    id: 4,
    title: "Turquoise Drip Teddy Bear 2-Tier Cake",
    image: "/images/bespoke-theme-4.jpg",
    alt: "2-Tier Turquoise Drip Teddy Bear Theme Cake - Cake Shopee",
  },
];

export default function EditorialCakesGrid() {
  const handleScrollToCustom = () => {
    const el = document.getElementById('custom-cake') || document.getElementById('bestsellers');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bloom-gallery-strip-section" id="curated-showcase">
      <div className="bloom-gallery-inner">
        <div className="bloom-gallery-grid">
          {SHOWCASE_CAKES.map((cake) => (
            <div 
              key={cake.id} 
              className="bloom-gallery-item"
              onClick={handleScrollToCustom}
              title={`Customise ${cake.title}`}
            >
              <div className="bloom-gallery-img-wrap">
                <Image
                  src={cake.image}
                  alt={cake.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 320px"
                  quality={95}
                  className="bloom-gallery-photo"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
