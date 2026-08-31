"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronRight } from 'lucide-react';

const CAKE_FEATURE_CARDS = [
  {
    id: "f1",
    title: "Custom Photo & Theme Cakes",
    priceText: "Starting From ₹550",
    image: "/images/image2.ong",
    badge: "100% Eggless",
    categoryKey: "custom"
  },
  {
    id: "f2",
    title: "Dark Chocolate & Gateau Cakes",
    priceText: "Starting From ₹490",
    image: "/images/image4.jpg",
    badge: "Bestseller",
    categoryKey: "cakes"
  },
  {
    id: "f3",
    title: "Bento & Fresh Pastry Slices",
    priceText: "Starting From ₹85",
    image: "/images/image5.png",
    badge: "Single Portion",
    categoryKey: "pastries"
  },
  {
    id: "f4",
    title: "Grand 2-Tier Celebration Cakes",
    priceText: "Starting From ₹1,200",
    image: "/images/image2.ong",
    badge: "Milestone Parties",
    categoryKey: "custom"
  }
];

export default function CakeShowcase({ onSelectCategory }) {
  return (
    <section className="cake-showcase-section">
      <div className="container">
        
        {/* Section Header with View All Button */}
        <div className="showcase-header-row">
          <div>
            <h2 className="showcase-title">Signature Cakes</h2>
            <p className="showcase-subtitle">Dreamy freshly baked cakes for every milestone & celebration</p>
          </div>
          <button 
            className="view-all-outline-btn"
            onClick={() => onSelectCategory('cakes')}
          >
            VIEW ALL <ChevronRight size={16} />
          </button>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="cake-showcase-grid">
          {CAKE_FEATURE_CARDS.map((card) => (
            <div 
              key={card.id} 
              className="showcase-card"
              onClick={() => onSelectCategory(card.categoryKey)}
            >
              <div className="showcase-img-wrap">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  style={{ objectFit: 'cover' }}
                />
                <span className="showcase-card-badge">{card.badge}</span>
              </div>
              <div className="showcase-card-body">
                <h4 className="showcase-card-title">{card.title}</h4>
                <span className="showcase-price-tag">{card.priceText}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
