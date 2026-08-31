"use client";

import React from 'react';

export default function HeroSection() {
  return (
    <section id="hero" className="hero-section">
      {/* Decorative blobs */}
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />

      <div className="hero-grid-container">
        {/* LEFT — Text Content */}
        <div className="hero-text-content">
          {/* Badge */}
          <div className="hero-badge">
            ✨ Narsipatnam&apos;s Premier Live Bakery
          </div>

          {/* Headline */}
          <h1 className="hero-headline">
            Your Dream Cake,<br />
            <span className="hero-headline-gradient">Crafted Live</span><br />
            <span className="hero-headline-sub">For You</span>
          </h1>

          {/* Description */}
          <p className="hero-description">
            From elegant 2-tier wedding cakes to custom theme birthday cakes —
            every tier baked fresh at our live decor counter on Complex Road.
          </p>

          {/* Buttons */}
          <div className="hero-cta-group">
            <a href="#custom-cake" className="hero-btn-primary">
              🎂 Design Your Cake
            </a>
            <a href="tel:7660948403" className="hero-btn-secondary">
              📞 Call Master Baker
            </a>
          </div>

          {/* Stats */}
          <div className="hero-stats-row">
            {[
              { num: '5,000+', label: 'Celebrations' },
              { num: '100%', label: 'Pure Eggless' },
              { num: '20 Min', label: 'Express Decor' },
            ].map((s, i) => (
              <div key={i} className="hero-stat-item">
                <div className="hero-stat-num">{s.num}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Fresh Cake Image */}
        <div className="hero-image-container">
          <div className="hero-glow-ring" />
          <img
            src="/images/bespoke-wedding-cake.jpg"
            alt="Custom 2-Tier Wedding Cake by Cake Shopee Narsipatnam"
            className="hero-cake-img"
          />
        </div>
      </div>
    </section>
  );
}
