"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles, MoveRight } from 'lucide-react';

const SIGNATURE_CAKES = [
  {
    id: 1,
    src: "/images/bespoke-theme-1.jpg",
    alt: "Signature Cocomelon Rainbow 2-Tier Theme Cake - Cake Shoppee",
    title: "Cocomelon 2-Tier Theme Cake",
    theme: "Kids Birthday Special",
    glowColor: "rgba(251, 146, 60, 0.24)"
  },
  {
    id: 2,
    src: "/images/bespoke-theme-2.jpg",
    alt: "Signature Jungle Safari 3D Animals Theme Cake - Cake Shoppee",
    title: "Jungle Safari 3D Animals",
    theme: "Hand-sculpted Fondant",
    glowColor: "rgba(34, 197, 94, 0.22)"
  },
  {
    id: 3,
    src: "/images/bespoke-theme-3.jpg",
    alt: "Signature Lavender & 24K Edible Gold Theme Cake - Cake Shoppee",
    title: "Lavender & 24K Gold Elegance",
    theme: "Royal Anniversary & Engagement",
    glowColor: "rgba(192, 132, 252, 0.24)"
  },
  {
    id: 4,
    src: "/images/bespoke-theme-4.jpg",
    alt: "Signature Turquoise Drip Teddy Bear Theme Cake - Cake Shoppee",
    title: "Turquoise Drip Teddy Delight",
    theme: "1st Year Milestone Celebration",
    glowColor: "rgba(56, 189, 248, 0.22)"
  },
  {
    id: 5,
    src: "/images/bespoke-wedding-cake.jpg",
    alt: "Signature Grand Royal 2-Tier Wedding Cake - Cake Shoppee",
    title: "Grand Royal 2-Tier Wedding Cake",
    theme: "Bespoke Multi-Tier Masterpiece",
    glowColor: "rgba(244, 114, 182, 0.24)"
  }
];

export default function EditorialCakesGrid() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const dotRefs = useRef([]);
  const stageGlowRef = useRef(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const activeIdxRef = useRef(0);
  const animFrameIdRef = useRef(null);
  const touchStartXRef = useRef(0);

  const [activeIdx, setActiveIdx] = useState(0);

  const setCardRef = (el, idx) => {
    cardRefs.current[idx] = el;
  };

  const setDotRef = (el, idx) => {
    dotRefs.current[idx] = el;
  };

  const scrollToCard = useCallback((index) => {
    if (!containerRef.current) return;
    const clampedIndex = Math.max(0, Math.min(SIGNATURE_CAKES.length - 1, index));
    const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) return;
    const targetScroll = containerRef.current.offsetTop + (clampedIndex / (SIGNATURE_CAKES.length - 1)) * totalScrollable;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, []);

  // 60fps Scroll-Driven Side-by-Side Render Loop
  useEffect(() => {
    let active = true;

    const renderLoop = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0003) {
        currentProgressRef.current += diff * 0.12;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const totalCards = SIGNATURE_CAKES.length;
      const floatIndex = currentProgressRef.current * (totalCards - 1);
      const activeInt = Math.min(totalCards - 1, Math.max(0, Math.round(floatIndex)));

      if (activeInt !== activeIdxRef.current) {
        activeIdxRef.current = activeInt;
        setActiveIdx(activeInt);
      }

      // Update Dynamic Ambient Glow Backdrop
      if (stageGlowRef.current) {
        const activeCake = SIGNATURE_CAKES[activeInt];
        stageGlowRef.current.style.background = `radial-gradient(circle at 50% 50%, ${activeCake.glowColor} 0%, rgba(255, 255, 255, 0) 70%)`;
      }

      // Render cards side-by-side: active card in center, previous on left, next on right
      SIGNATURE_CAKES.forEach((_, i) => {
        const cardEl = cardRefs.current[i];
        if (!cardEl) return;

        const rel = i - floatIndex;

        if (Math.abs(rel) >= 1.6) {
          cardEl.style.opacity = '0';
          cardEl.style.transform = `translate3d(${rel > 0 ? 120 : -120}%, 0, 0) scale(0.8)`;
          cardEl.style.pointerEvents = 'none';
        } else {
          // Side-by-side horizontal positioning: adjacent cards peek on left and right
          const translateX = rel * 94; // % offset
          const scale = Math.max(0.84, 1 - Math.abs(rel) * 0.13);
          const opacity = Math.max(0, 1 - Math.pow(Math.abs(rel), 1.28) * 0.85);
          const rotate = rel * -3.2; // subtle 3D rotational tilt

          cardEl.style.opacity = opacity;
          cardEl.style.transform = `translate3d(${translateX}%, 0, 0) scale(${scale}) rotate(${rotate}deg)`;
          cardEl.style.zIndex = Math.round((2 - Math.abs(rel)) * 10);
          cardEl.style.pointerEvents = Math.abs(rel) < 0.35 ? 'auto' : 'none';
        }

        // Progress indicators
        const dotEl = dotRefs.current[i];
        if (dotEl) {
          const isSelected = i === activeInt;
          dotEl.style.opacity = isSelected ? '1' : '0.28';
          dotEl.style.width = isSelected ? '26px' : '8px';
          dotEl.style.background = isSelected ? '#ea580c' : 'rgba(234, 88, 12, 0.45)';
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

  // Touch Swipe Interaction for Mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(diffX) > 45) {
      if (diffX < 0) {
        // Swiped left -> next card
        scrollToCard(activeIdxRef.current + 1);
      } else {
        // Swiped right -> prev card
        scrollToCard(activeIdxRef.current - 1);
      }
    }
  };

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
        height: '260vh',
        background: '#fffbf5',
        color: '#1e293b',
        zIndex: 10,
        isolation: 'isolate'
      }}
    >
      {/* Sticky Fullscreen Stage */}
      <div 
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: '#fffbf5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          isolation: 'isolate'
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

        {/* Section Header */}
        <div 
          className="section-header text-center"
          style={{
            position: 'absolute',
            top: 'clamp(16px, 3vh, 32px)',
            left: '16px',
            right: '16px',
            zIndex: 40,
            marginBottom: 0
          }}
        >
          <span className="handwritten">Curated Masterpieces</span>
          <br />
          <span className="section-badge">SIGNATURE GALLERY</span>
          <h2 className="section-title" style={{ margin: '4px 0 6px 0', fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)' }}>
            Handcrafted Theme Creations
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '640px', fontSize: 'clamp(0.85rem, 1.4vw, 0.95rem)' }}>
            Bespoke multi-tier celebration cakes finished live at our Narsipatnam boutique
          </p>
        </div>

        {/* Side-by-Side Presentation Stage */}
        <div 
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            height: 'min(64vh, 520px)',
            marginTop: 'clamp(60px, 9vh, 90px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={() => scrollToCard(activeIdx - 1)}
            aria-label="Previous signature cake"
            disabled={activeIdx === 0}
            style={{
              position: 'absolute',
              left: 'clamp(8px, 3vw, 36px)',
              zIndex: 35,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.94)',
              border: '1.5px solid rgba(251, 146, 60, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: activeIdx === 0 ? 'default' : 'pointer',
              color: activeIdx === 0 ? '#cbd5e1' : '#c2410c',
              boxShadow: '0 6px 20px rgba(67, 34, 18, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'all 0.22s ease',
              opacity: activeIdx === 0 ? 0.4 : 1
            }}
          >
            <ChevronLeft size={22} strokeWidth={2.4} />
          </button>

          {/* Picture Stage: Side-by-Side Cards */}
          <div 
            style={{
              position: 'relative',
              width: 'min(86vw, 400px)',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
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
                  borderRadius: '26px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: '#ffffff',
                  border: '2px solid rgba(251, 146, 60, 0.28)',
                  boxShadow: '0 24px 60px rgba(67, 34, 18, 0.13), 0 4px 18px rgba(0, 0, 0, 0.04)',
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
                  sizes="(max-width: 640px) 86vw, 400px"
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

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={() => scrollToCard(activeIdx + 1)}
            aria-label="Next signature cake"
            disabled={activeIdx === SIGNATURE_CAKES.length - 1}
            style={{
              position: 'absolute',
              right: 'clamp(8px, 3vw, 36px)',
              zIndex: 35,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.94)',
              border: '1.5px solid rgba(251, 146, 60, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: activeIdx === SIGNATURE_CAKES.length - 1 ? 'default' : 'pointer',
              color: activeIdx === SIGNATURE_CAKES.length - 1 ? '#cbd5e1' : '#c2410c',
              boxShadow: '0 6px 20px rgba(67, 34, 18, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'all 0.22s ease',
              opacity: activeIdx === SIGNATURE_CAKES.length - 1 ? 0.4 : 1
            }}
          >
            <ChevronRight size={22} strokeWidth={2.4} />
          </button>
        </div>

        {/* Series Progress Dots Indicator */}
        <div 
          style={{
            position: 'absolute',
            bottom: 'clamp(14px, 2.5vh, 26px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            zIndex: 40
          }}
        >
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {SIGNATURE_CAKES.map((cake, i) => (
              <div 
                key={`dot-${cake.id}`}
                ref={(el) => setDotRef(el, i)}
                style={{
                  height: '8px',
                  width: i === 0 ? '26px' : '8px',
                  borderRadius: '999px',
                  background: i === 0 ? '#ea580c' : 'rgba(234, 88, 12, 0.45)',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                  cursor: 'pointer'
                }}
                onClick={() => scrollToCard(i)}
                aria-label={`Jump to ${cake.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
