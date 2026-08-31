"use client";

import React from 'react';
import Image from 'next/image';

const OCCASION_ITEMS = [
  {
    id: 'bestsellers',
    title: 'Best Sellers',
    image: '/images/occasion-bestsellers-fresh.jpg',
    catKey: 'all',
    filterType: 'bestseller'
  },
  {
    id: 'birthday',
    title: 'Birthday Cakes',
    image: '/images/occasion-birthday-fresh.jpg',
    catKey: 'cakes',
    filterType: 'birthday'
  },
  {
    id: 'gifts',
    title: 'Gifts & Combos',
    image: '/images/occasion-gifts-fresh.jpg',
    catKey: 'combos',
    filterType: 'budget'
  },
  {
    id: 'chocolate',
    title: 'Lotsa Chocolate!',
    image: '/images/occasion-chocolate-fresh.jpg',
    catKey: 'cakes',
    filterType: 'chocolate'
  }
];

export default function OccasionTreatsSection({ onSelectCategory, onSearch }) {
  const handleCardClick = (item) => {
    if (item.id === 'chocolate') {
      if (onSearch) onSearch('chocolate');
      if (onSelectCategory) onSelectCategory('all');
      const el = document.getElementById('bestsellers');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (item.id === 'gifts') {
      const el = document.getElementById('combos');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    if (onSelectCategory) {
      onSelectCategory(item.catKey);
    }
    const el = document.getElementById('bestsellers');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewMore = (e) => {
    e.preventDefault();
    if (onSelectCategory) onSelectCategory('all');
    const el = document.getElementById('bestsellers');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="occasion-treats-section" id="occasions-collection">
      <div className="occasion-inner-container">
        {/* Section Header */}
        <div className="occasion-header-center">
          <h2 className="occasion-main-title">Treats for any Occasion</h2>
          <p className="occasion-subtitle">
            We&apos;ve got you covered for any holiday, birthday celebration, or sweet craving in Narsipatnam.
          </p>
          <a 
            href="#bestsellers" 
            onClick={handleViewMore}
            className="occasion-view-more-link"
          >
            VIEW MORE
          </a>
        </div>

        {/* 4-Card Occasions Grid */}
        <div className="occasion-cards-grid">
          {OCCASION_ITEMS.map((item) => (
            <div 
              key={item.id} 
              className="occasion-card"
              onClick={() => handleCardClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(item); }}
            >
              <div className="occasion-card-img-wrap">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  className="occasion-card-img"
                />
                <div className="occasion-card-hover-overlay">
                  <span>View Treats →</span>
                </div>
              </div>
              <h3 className="occasion-card-title">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
