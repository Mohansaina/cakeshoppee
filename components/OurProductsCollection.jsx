"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const PRODUCT_COLLECTIONS = [
  {
    id: 'cakes',
    title: 'Signature Cakes',
    image: '/images/blackforest.jpg',
    catKey: 'cakes',
    description: 'Black Forest, Red Velvet & Fresh Fruit Cakes'
  },
  {
    id: 'pastries',
    title: 'Gourmet Pastries',
    image: '/images/chocoalmond.jpg',
    catKey: 'pastries',
    description: 'Choco Almond & Fruit Pastry Slices'
  },
  {
    id: 'savouries',
    title: 'Hot Fast Food & Pizzas',
    image: '/images/vegpizza.jpg',
    catKey: 'savouries',
    description: 'Oven-Hot Pizzas, Burgers & Grilled Sandwiches'
  },
  {
    id: 'shakes',
    title: 'Thick Milkshakes',
    image: '/images/oreomilkshake.jpg',
    catKey: 'shakes',
    description: 'Oreo, Kulfi & Strawberry Thick Shakes'
  },
  {
    id: 'custom-theme',
    title: 'Custom Theme Cakes',
    image: '/images/hero-custom-wedding-cake.jpg',
    catKey: 'cakes',
    description: '2-Tier Wedding & Custom Birthday Cakes'
  }
];

export default function OurProductsCollection({ onSelectCategory }) {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCardClick = (catKey) => {
    if (catKey === 'combos') {
      const el = document.getElementById('combos');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (onSelectCategory) {
      onSelectCategory(catKey);
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
    <section className="magnolia-products-section" id="our-products-collection">
      <div className="magnolia-inner-container">
        
        {/* Navigation & Controls Bar */}
        <div className="magnolia-controls-bar">
          <a 
            href="#bestsellers" 
            onClick={handleViewMore}
            className="magnolia-view-more-link"
          >
            VIEW MORE
          </a>

          <div className="magnolia-arrows-group">
            <button 
              type="button" 
              className="magnolia-arrow-btn"
              onClick={() => scroll('left')}
              aria-label="Previous products"
            >
              <ArrowLeft size={18} />
            </button>
            <button 
              type="button" 
              className="magnolia-arrow-btn"
              onClick={() => scroll('right')}
              aria-label="Next products"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* 5-Card Product Carousel Track */}
        <div className="magnolia-carousel-wrapper">
          <div className="magnolia-carousel-track" ref={carouselRef}>
            {PRODUCT_COLLECTIONS.map((item) => (
              <div 
                key={item.id} 
                className="magnolia-product-card"
                onClick={() => handleCardClick(item.catKey)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(item.catKey); }}
              >
                <div className="magnolia-card-img-wrap">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 30vw, 280px"
                    className="magnolia-card-img"
                  />
                  <div className="magnolia-card-hover-overlay">
                    <span>Explore Selection →</span>
                  </div>
                </div>
                <h3 className="magnolia-card-title">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
