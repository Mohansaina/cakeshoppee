"use client";

import React from 'react';
import Image from 'next/image';

export default function HeroBanner() {
  return (
    <section className="bloom-hero-section">
      <div className="bloom-hero-container">
        <div className="bloom-hero-visual-wrap">
          <Image
            src="/images/bloom-hero-wedding-cake.jpg"
            alt="Cake Shopee Bespoke Wedding Cake Showcase"
            fill
            priority
            quality={100}
            className="bloom-hero-image"
            style={{ objectFit: 'cover', objectPosition: 'center 42%' }}
          />
        </div>
      </div>
    </section>
  );
}

