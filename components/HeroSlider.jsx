"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: "✨ Narsipatnam's Premier Live Bakery",
    handwriting: "Freshly whipped with pure cream",
    title: "Artisanal Cakes & Oven-Hot Savouries",
    description: "Indulge in freshly baked Black Forest, Belgian Chocolate Truffle, and Mango Drizzle cakes. Prepared with 100% pure eggless options right here on Complex Road.",
    primaryText: "Explore Today's Menu",
    primaryLink: "#menu",
    secondaryText: "Custom Theme Cakes",
    secondaryLink: "#custom-cake",
    image: "/images/image4.jpg"
  },
  {
    id: 2,
    tag: "🎂 Live Decorating Counter",
    handwriting: "Crafted live in front of you",
    title: "Your Dream Celebration Cake, Made On-Demand",
    description: "From 2-tier theme birthday cakes to anniversary specials, share your dream idea and watch our master bakers bring it to life fresh for your celebration.",
    primaryText: "Design Your Custom Cake",
    primaryLink: "#custom-cake",
    secondaryText: "Call Baker: 7660948403",
    secondaryLink: "tel:7660948403",
    image: "/images/image8.jpg"
  },
  {
    id: 3,
    tag: "🥟 Hot Savouries & Coolers",
    handwriting: "Crispy, savory & delicious",
    title: "Pizzas, Golden Puffs & Thick Oreo Shakes",
    description: "Drop in for hot flaky chicken pepper puffs, fresh personal pizzas, juicy cheeseburgers, and creamy milkshakes. Open daily till 10:00 PM.",
    primaryText: "View Party Combos",
    primaryLink: "#combos",
    secondaryText: "Get Driving Directions",
    secondaryLink: "#find-us",
    image: "/images/image1.png"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-section" id="hero">
      <div className="hero-slider">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="hero-image-bg">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="hero-overlay"></div>
            
            <div className="container hero-container">
              <div className="hero-content">
                <span className="hero-tag-pill">{slide.tag}</span>
                <br />
                <span className="handwritten large" style={{ color: '#eab33a' }}>{slide.handwriting}</span>
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-description">{slide.description}</p>
                
                <div className="hero-actions">
                  <a href={slide.primaryLink} className="btn btn-primary btn-lg">
                    {slide.primaryText} <ArrowRight size={18} />
                  </a>
                  <a href={slide.secondaryLink} className="btn btn-secondary btn-lg">
                    {slide.secondaryText}
                  </a>
                </div>

                <div className="hero-stats">
                  <div className="hero-stat-item">
                    <span className="stat-number">5,000+</span>
                    <span className="stat-label">Cakes Celebrated</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Pure Eggless Choices</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="stat-number">20 Min</span>
                    <span className="stat-label">Live Express Decor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-controls">
        <button
          className="slider-btn"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="slider-dots">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`slider-dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(i)}
            ></div>
          ))}
        </div>

        <button
          className="slider-btn"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
