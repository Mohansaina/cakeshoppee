"use client";

import React, { useRef } from 'react';
import { Sparkles, ChevronDown, Cake, UtensilsCrossed, Phone, Clock, Award, ShieldCheck } from 'lucide-react';

export default function HeroSection() {
  const heroRef = useRef(null);

  const scrollToNext = () => {
    const nextEl = document.getElementById('curated-showcase') || document.getElementById('bestsellers');
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      ref={heroRef}
      className="hero-section-fluid"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a0e07',
        color: '#ffffff'
      }}
    >
      {/* Native Hardware-Accelerated 60FPS Video Background (Zero lag, zero stuck scroll, smooth continuous motion) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-frames/frame_000.webp"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 1
        }}
      >
        <source src="/videos/hero-scroll.mp4" type="video/mp4" />
      </video>

      {/* Warm Golden Bakery Ambient Overlay (Replaces the dark/black gloomy aesthetic) */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(30, 14, 6, 0.25) 0%, rgba(20, 10, 4, 0.55) 70%, rgba(15, 7, 3, 0.75) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }} 
      />

      {/* Top & Bottom Warm Vignette Blends */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: 'linear-gradient(to bottom, rgba(20, 10, 4, 0.75) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 2
        }} 
      />
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to top, rgba(18, 9, 3, 0.85) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 2
        }} 
      />

      {/* Centerpiece Hero Content (Warm, Distinct, Artisan Bakery Styling) */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 20px',
          maxWidth: '1200px',
          width: '100%',
          marginTop: '-15px'
        }}
      >
        {/* Bakery Heritage Eyebrow Pill */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(254, 215, 170, 0.35)',
            padding: '7px 22px',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 800,
            color: '#fed7aa',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            marginBottom: '20px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}
        >
          <Sparkles size={14} color="#fb923c" />
          <span>Live Cake Counter &bull; Est. 2018 Narsipatnam</span>
        </div>

        {/* Brand Headline: Warm Golden-Caramel Artisan Luxury */}
        <h1 
          style={{
            fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
            fontSize: 'clamp(2.8rem, 8.5vw, 6.2rem)',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: '0 0 8px 0',
            lineHeight: 1.05,
            background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 35%, #fed7aa 70%, #fb923c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 4px 24px rgba(0, 0, 0, 0.65))',
            userSelect: 'none'
          }}
        >
          CAKE SHOPPEE
        </h1>

        <span 
          style={{
            fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
            fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#fdba74',
            marginBottom: '16px',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}
        >
          Artisan Patisserie &bull; Fresh Oven Kitchen
        </span>

        {/* Subtitle */}
        <p 
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
            color: '#f8fafc',
            letterSpacing: '0.02em',
            fontWeight: 500,
            margin: '0 0 28px 0',
            textShadow: '0 2px 14px rgba(0,0,0,0.95)',
            maxWidth: '680px',
            lineHeight: 1.5,
            userSelect: 'none'
          }}
        >
          Turn a feeling, a memory, or an imagined celebration into cake.
          <br />
          <span style={{ fontSize: '0.9em', color: '#fed7aa', fontWeight: 600 }}>
            Custom 2-tier theme cakes, 8-inch oven pizzas &amp; burgers crafted fresh in town.
          </span>
        </p>

        {/* Action Buttons */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '14px', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '26px'
          }}
        >
          <a 
            href="#custom-cake" 
            style={{
              background: 'linear-gradient(135deg, #ea580c 0%, #e11d48 100%)',
              color: '#ffffff',
              padding: '13px 30px',
              borderRadius: '999px',
              fontSize: '0.94rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(234, 88, 12, 0.45)',
              transition: 'all 0.2s ease'
            }}
          >
            <Cake size={16} />
            <span>Design Custom Cake</span>
          </a>

          <a 
            href="#bestsellers" 
            style={{
              background: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: '#ffffff',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              padding: '13px 26px',
              borderRadius: '999px',
              fontSize: '0.94rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <UtensilsCrossed size={16} />
            <span>View Kitchen Menu</span>
          </a>

          <a 
            href="tel:7660948403" 
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: '#fed7aa',
              border: '1px solid rgba(254, 215, 170, 0.4)',
              padding: '13px 22px',
              borderRadius: '999px',
              fontSize: '0.92rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'all 0.2s ease'
            }}
          >
            <Phone size={15} />
            <span>7660948403</span>
          </a>
        </div>

        {/* Feature Trust Pills (Live in Narsipatnam) */}
        <div 
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <span style={{
            fontSize: '0.78rem',
            color: '#fed7aa',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '5px 14px',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <ShieldCheck size={13} color="#4ade80" />
            100% Pure Dairy &amp; Eggless
          </span>

          <span style={{
            fontSize: '0.78rem',
            color: '#fed7aa',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '5px 14px',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <Clock size={13} color="#38bdf8" />
            Same-Day Door Delivery
          </span>

          <span style={{
            fontSize: '0.78rem',
            color: '#fed7aa',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '5px 14px',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <Award size={13} color="#fb923c" />
            Handcrafted Sugar Art
          </span>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div 
        onClick={scrollToNext}
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          color: '#ffffff',
          cursor: 'pointer',
          textShadow: '0 2px 10px rgba(0,0,0,0.85)',
          userSelect: 'none'
        }}
      >
        <span style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fed7aa' }}>
          Explore Signature Cakes &amp; Menu
        </span>
        <ChevronDown size={18} className="bounce-arrow" color="#fb923c" />
      </div>
    </section>
  );
}
