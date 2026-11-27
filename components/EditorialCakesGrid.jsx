"use client";

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

const SIGNATURE_CAKES = [
  {
    id: 1,
    src: "/images/bespoke-theme-1.jpg",
    alt: "Signature Theme Cake 1 - Cake Shoppee",
    glowColor: "rgba(251, 146, 60, 0.22)"
  },
  {
    id: 2,
    src: "/images/bespoke-theme-2.jpg",
    alt: "Signature Theme Cake 2 - Cake Shoppee",
    glowColor: "rgba(34, 197, 94, 0.20)"
  },
  {
    id: 3,
    src: "/images/bespoke-theme-3.jpg",
    alt: "Signature Theme Cake 3 - Cake Shoppee",
    glowColor: "rgba(192, 132, 252, 0.22)"
  },
  {
    id: 4,
    src: "/images/bespoke-theme-4.jpg",
    alt: "Signature Theme Cake 4 - Cake Shoppee",
    glowColor: "rgba(56, 189, 248, 0.20)"
  },
  {
    id: 5,
    src: "/images/bespoke-wedding-cake.jpg",
    alt: "Signature Theme Cake 5 - Cake Shoppee",
    glowColor: "rgba(244, 114, 182, 0.22)"
  }
];

export default function EditorialCakesGrid() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const dotRefs = useRef([]);
  const stageGlowRef = useRef(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animFrameIdRef = useRef(null);

  const setCardRef = (el, idx) => {
    cardRefs.current[idx] = el;
  };

  const setDotRef = (el, idx) => {
    dotRefs.current[idx] = el;
  };

  useEffect(() => {
    let active = true;

    // Series Motion Render Loop: Pictures transition one by one in series
    const renderLoop = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0004) {
        currentProgressRef.current += diff * 0.12;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const totalCards = SIGNATURE_CAKES.length;
      const floatIndex = currentProgressRef.current * (totalCards - 1);
      const activeInt = Math.min(totalCards - 1, Math.floor(floatIndex + 0.5));

      // 1. Update Ambient Glow Backdrop
      if (stageGlowRef.current) {
        const activeItem = SIGNATURE_CAKES[activeInt];
        stageGlowRef.current.style.background = `radial-gradient(circle at 50% 50%, ${activeItem.glowColor} 0%, rgba(255, 255, 255, 0) 70%)`;
      }

      // 2. Series Motion: Each picture moves one by one in series across the center stage
      SIGNATURE_CAKES.forEach((_, i) => {
        const cardEl = cardRefs.current[i];
        if (!cardEl) return;

        const rel = i - floatIndex;

        if (Math.abs(rel) >= 1.25) {
          // Off screen
          cardEl.style.opacity = '0';
          cardEl.style.transform = `translate3d(${rel > 0 ? 115 : -115}%, 0, 0) scale(0.85)`;
          cardEl.style.pointerEvents = 'none';
        } else {
          // Active series glide
          const translateX = rel * 105;
          const scale = Math.max(0.82, 1 - Math.abs(rel) * 0.14);
          const opacity = Math.max(0, 1 - Math.pow(Math.abs(rel), 1.4) * 1.05);
          const rotate = rel * -3.5;

          cardEl.style.opacity = opacity;
          cardEl.style.transform = `translate3d(${translateX}%, 0, 0) scale(${scale}) rotate(${rotate}deg)`;
          cardEl.style.zIndex = Math.round((1 - Math.abs(rel)) * 25);
          cardEl.style.pointerEvents = Math.abs(rel) < 0.35 ? 'auto' : 'none';
        }

        // 3. Update Progress Dots
        const dotEl = dotRefs.current[i];
        if (dotEl) {
          const isActive = Math.abs(rel) < 0.5;
          dotEl.style.opacity = isActive ? '1' : '0.25';
          dotEl.style.transform = isActive ? 'scale(1.4)' : 'scale(1)';
          dotEl.style.background = isActive ? '#ea580c' : 'rgba(234, 88, 12, 0.35)';
        }
      });

      if (active) {
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = containerRef.current.offsetHeight - windowHeight;

      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      targetProgressRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      active = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCardClick = () => {
    const el = document.getElementById('custom-cake') || document.getElementById('bestsellers');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={containerRef}
      id="curated-showcase" 
      style={{
        position: 'relative',
        height: '280vh',
        background: 'linear-gradient(180deg, #fdfbf7 0%, #fff7ed 45%, #faf5ef 100%)',
        color: '#1e293b'
      }}
    >
      {/* Sticky Viewport Stage */}
      <div 
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Dynamic Warm Ambient Glow Backdrop */}
        <div 
          ref={stageGlowRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.22) 0%, rgba(255, 255, 255, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 1,
            transition: 'background 0.5s ease',
            willChange: 'background'
          }} 
        />

        {/* Clean Header Bar: Only the pure Signature Gallery title */}
        <div 
          style={{
            position: 'absolute',
            top: '28px',
            left: '0',
            right: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40
          }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.94)',
            border: '1.5px solid rgba(251, 146, 60, 0.3)',
            padding: '7px 22px',
            borderRadius: '999px',
            boxShadow: '0 4px 16px rgba(234, 88, 12, 0.08)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}>
            <Sparkles size={14} color="#ea580c" />
            <span style={{
              fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#9a3412',
              textTransform: 'uppercase'
            }}>
              Signature Gallery
            </span>
          </div>
        </div>

        {/* Series Pictures Stage: Natural 3:4 Vertical Portrait Fit (Clean, Zero Unwanted Text) */}
        <div 
          style={{
            position: 'relative',
            width: 'min(90vw, 440px)',
            height: 'min(74vh, 580px)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '20px'
          }}
        >
          {SIGNATURE_CAKES.map((cake, index) => (
            <div
              key={cake.id}
              ref={(el) => setCardRef(el, index)}
              onClick={handleCardClick}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '28px',
                overflow: 'hidden',
                cursor: 'pointer',
                background: '#ffffff',
                border: '2px solid rgba(251, 146, 60, 0.28)',
                boxShadow: '0 24px 60px rgba(67, 34, 18, 0.14), 0 4px 18px rgba(0, 0, 0, 0.04)',
                willChange: 'transform, opacity',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px'
              }}
            >
              <Image
                src={cake.src}
                alt={cake.alt}
                fill
                priority={index <= 1}
                sizes="(max-width: 640px) 90vw, 440px"
                quality={95}
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                  padding: '14px'
                }}
              />
            </div>
          ))}
        </div>

        {/* Right Navigation Dots Indicator */}
        <div 
          style={{
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 40
          }}
        >
          {SIGNATURE_CAKES.map((cake, i) => (
            <div 
              key={`dot-${cake.id}`}
              ref={(el) => setDotRef(el, i)}
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'rgba(234, 88, 12, 0.35)',
                transition: 'all 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
                cursor: 'pointer'
              }}
              onClick={() => {
                if (containerRef.current) {
                  const scrollable = containerRef.current.offsetHeight - window.innerHeight;
                  const targetScroll = containerRef.current.offsetTop + (i / (SIGNATURE_CAKES.length - 1)) * scrollable;
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
