"use client";

import React from 'react';
import Image from 'next/image';
import { Sparkles, ChevronDown, Phone, Cake, UtensilsCrossed } from 'lucide-react';

// 4-pointed lens-flare sparkle star matching the iridescent luxury aesthetic
function SparkleStar({ size = 22, style = {}, delay = '0s' }) {
  return (
    <svg 
      className="cs-diamond-glint"
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        filter: 'drop-shadow(0 0 8px rgba(255,255,255,1)) drop-shadow(0 0 16px rgba(192,132,252,0.85))',
        zIndex: 5,
        animationDelay: delay,
        ...style
      }}
    >
      <path 
        d="M12 0 C12 6.5 6.5 12 0 12 C6.5 12 12 17.5 12 24 C12 17.5 17.5 12 24 12 C17.5 12 12 6.5 12 0 Z" 
        fill="#ffffff" 
      />
      <circle cx="12" cy="12" r="3" fill="#ffffff" />
      <circle cx="12" cy="12" r="1.5" fill="#fbcfe8" />
    </svg>
  );
}

export default function HeroSection() {
  const scrollToNext = () => {
    const nextEl = document.getElementById('curated-showcase') || document.getElementById('bestsellers');
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="hero-section-instant"
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
        background: '#1a100a',
        color: '#ffffff'
      }}
    >
      {/* High-Resolution Bakery Drip Background Photo (Instant 0ms load, zero lagging, zero frame downloads) */}
      <Image
        src="/hero-frames/frame_000.webp"
        alt="Cake Shoppee Live Cake Kitchen Narsipatnam"
        fill
        priority
        quality={95}
        sizes="100vw"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 1
        }}
      />

      {/* Cinematic Ambient Warmth & Contrast Overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(20, 12, 6, 0.45) 0%, rgba(20, 12, 6, 0.15) 45%, rgba(15, 8, 4, 0.65) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }} 
      />

      {/* Top & Bottom Vignette Shadow Gradients */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: 'linear-gradient(to bottom, rgba(12, 6, 3, 0.75) 0%, transparent 100%)',
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
          background: 'linear-gradient(to top, rgba(12, 6, 3, 0.85) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 2
        }} 
      />

      {/* Main Hero Centerpiece (Holographic Iridescent Aesthetic) */}
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
          maxWidth: '1240px',
          width: '100%',
          marginTop: '-20px'
        }}
      >
        {/* Bakery Pill Badge */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '7px 20px',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 800,
            color: '#fed7aa',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            marginBottom: '22px',
            letterSpacing: '0.04em'
          }}
        >
          <Sparkles size={14} color="#fb923c" />
          <span>Fresh Live Bakery &bull; Narsipatnam Town</span>
        </div>

        {/* Holographic Iridescent CAKE SHOPPEE Title with Lens Flare Glints */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <SparkleStar size={24} style={{ top: '-14px', left: '-18px' }} delay="0s" />
          <SparkleStar size={16} style={{ top: '22%', left: '16%' }} delay="0.5s" />
          <SparkleStar size={18} style={{ top: '8%', left: '33%' }} delay="1.2s" />
          <SparkleStar size={18} style={{ top: '44%', left: '52%' }} delay="0.8s" />
          <SparkleStar size={20} style={{ top: '16%', left: '74%' }} delay="1.5s" />
          <SparkleStar size={26} style={{ top: '-12px', right: '-20px' }} delay="0.3s" />

          <h1 
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
              fontSize: 'clamp(2.8rem, 8.2vw, 6.4rem)',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: 0,
              lineHeight: 1,
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 14%, #e0e7ff 30%, #fbcfe8 48%, #bae6fd 66%, #f5d0fe 82%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 24px rgba(255, 255, 255, 0.45)) drop-shadow(0 0 55px rgba(192, 132, 252, 0.4))',
              userSelect: 'none'
            }}
          >
            CAKE SHOPPEE
          </h1>
        </div>

        {/* Subtitle */}
        <p 
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.25rem)',
            color: '#f8fafc',
            letterSpacing: '0.03em',
            fontWeight: 500,
            margin: '20px 0 32px 0',
            textShadow: '0 2px 16px rgba(0,0,0,0.95)',
            maxWidth: '680px',
            lineHeight: 1.5,
            userSelect: 'none'
          }}
        >
          Turn a feeling, a memory, or an imagined celebration into cake.
        </p>

        {/* Action Buttons */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '14px', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <a 
            href="#custom-cake" 
            style={{
              background: 'linear-gradient(135deg, #ea580c 0%, #e11d48 100%)',
              color: '#ffffff',
              padding: '13px 28px',
              borderRadius: '999px',
              fontSize: '0.92rem',
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
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              padding: '13px 26px',
              borderRadius: '999px',
              fontSize: '0.92rem',
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
              border: '1px solid rgba(254, 215, 170, 0.35)',
              padding: '13px 22px',
              borderRadius: '999px',
              fontSize: '0.9rem',
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
      </div>

      {/* Bottom Scroll Prompt */}
      <div 
        onClick={scrollToNext}
        style={{
          position: 'absolute',
          bottom: '28px',
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
