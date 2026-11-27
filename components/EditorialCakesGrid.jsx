"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SIGNATURE_CAKES = [
  {
    id: 1,
    src: "/images/bespoke-theme-1.jpg",
    alt: "Signature Theme Cake 1 - Cake Shoppee",
    glowColor: "rgba(251, 146, 60, 0.24)"
  },
  {
    id: 2,
    src: "/images/bespoke-theme-2.jpg",
    alt: "Signature Theme Cake 2 - Cake Shoppee",
    glowColor: "rgba(34, 197, 94, 0.22)"
  },
  {
    id: 3,
    src: "/images/bespoke-theme-3.jpg",
    alt: "Signature Theme Cake 3 - Cake Shoppee",
    glowColor: "rgba(192, 132, 252, 0.24)"
  },
  {
    id: 4,
    src: "/images/bespoke-theme-4.jpg",
    alt: "Signature Theme Cake 4 - Cake Shoppee",
    glowColor: "rgba(56, 189, 248, 0.22)"
  },
  {
    id: 5,
    src: "/images/bespoke-wedding-cake.jpg",
    alt: "Signature Theme Cake 5 - Cake Shoppee",
    glowColor: "rgba(244, 114, 182, 0.24)"
  }
];

export default function EditorialCakesGrid() {
  const cardRefs = useRef([]);
  const dotRefs = useRef([]);
  const stageGlowRef = useRef(null);

  const targetIndexRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animFrameIdRef = useRef(null);
  const isHoveredRef = useRef(false);
  const touchStartXRef = useRef(0);

  const [activeIdx, setActiveIdx] = useState(0);

  const setCardRef = (el, idx) => {
    cardRefs.current[idx] = el;
  };

  const setDotRef = (el, idx) => {
    dotRefs.current[idx] = el;
  };

  const nextSlide = useCallback(() => {
    targetIndexRef.current += 1;
  }, []);

  const prevSlide = useCallback(() => {
    targetIndexRef.current -= 1;
  }, []);

  const goToSlide = useCallback((targetI) => {
    const total = SIGNATURE_CAKES.length;
    const currentInt = Math.round(targetIndexRef.current);
    const currentModulo = ((currentInt % total) + total) % total;
    let diff = targetI - currentModulo;

    // Choose shortest path on circular loop
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    targetIndexRef.current = currentInt + diff;
  }, []);

  // 1. Automatic series progression timer (advances every 3.2s when not hovered/touched)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHoveredRef.current) {
        nextSlide();
      }
    }, 3200);

    return () => clearInterval(timer);
  }, [nextSlide]);

  // 2. Silky 60fps Spring Render Loop for continuous circular series motion
  useEffect(() => {
    let active = true;
    const totalCards = SIGNATURE_CAKES.length;

    const renderLoop = () => {
      const diff = targetIndexRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0005) {
        currentProgressRef.current += diff * 0.085;
      } else {
        currentProgressRef.current = targetIndexRef.current;
      }

      const activeInt = ((Math.round(currentProgressRef.current) % totalCards) + totalCards) % totalCards;
      setActiveIdx(activeInt);

      // Ambient dynamic glow behind active cake
      if (stageGlowRef.current) {
        const activeCake = SIGNATURE_CAKES[activeInt];
        stageGlowRef.current.style.background = `radial-gradient(circle at 50% 50%, ${activeCake.glowColor} 0%, rgba(255, 255, 255, 0) 70%)`;
      }

      // Render cards in circular series
      SIGNATURE_CAKES.forEach((_, i) => {
        const cardEl = cardRefs.current[i];
        if (!cardEl) return;

        // Mathematical circular offset from current progress in [-totalCards/2, totalCards/2]
        let offset = (i - (currentProgressRef.current % totalCards)) % totalCards;
        if (offset > totalCards / 2) offset -= totalCards;
        if (offset < -totalCards / 2) offset += totalCards;

        if (Math.abs(offset) >= 1.45) {
          cardEl.style.opacity = '0';
          cardEl.style.transform = `translate3d(${offset > 0 ? 115 : -115}%, 0, 0) scale(0.82)`;
          cardEl.style.pointerEvents = 'none';
        } else {
          const translateX = offset * 105;
          const scale = Math.max(0.84, 1 - Math.abs(offset) * 0.12);
          const opacity = Math.max(0, 1 - Math.pow(Math.abs(offset), 1.35) * 1.05);
          const rotate = offset * -3.2;

          cardEl.style.opacity = opacity;
          cardEl.style.transform = `translate3d(${translateX}%, 0, 0) scale(${scale}) rotate(${rotate}deg)`;
          cardEl.style.zIndex = Math.round((1.5 - Math.abs(offset)) * 20);
          cardEl.style.pointerEvents = Math.abs(offset) < 0.35 ? 'auto' : 'none';
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

    return () => {
      active = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  const handleCardClick = () => {
    const el = document.getElementById('custom-cake') || document.getElementById('bestsellers');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTouchStart = (e) => {
    isHoveredRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    isHoveredRef.current = false;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  return (
    <section 
      id="curated-showcase" 
      style={{
        position: 'relative',
        width: '100%',
        padding: '56px 0 64px 0',
        background: 'linear-gradient(180deg, #fdfbf7 0%, #fff7ed 45%, #faf5ef 100%)',
        color: '#1e293b',
        overflow: 'hidden'
      }}
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
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

      <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Standard Section Header matching the rest of the site */}
        <div className="section-header text-center" style={{ marginBottom: '32px' }}>
          <span className="handwritten">Curated Masterpieces</span>
          <br />
          <span className="section-badge">SIGNATURE GALLERY</span>
          <h2 className="section-title" style={{ margin: '6px 0 8px 0', fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)' }}>
            Handcrafted Theme Creations
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '640px', fontSize: 'clamp(0.9rem, 1.6vw, 1rem)' }}>
            Bespoke multi-tier celebration cakes finished live at our Narsipatnam boutique
          </p>
        </div>

        {/* Automatic Series Stage */}
        <div 
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 0 20px 0'
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Previous Arrow Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous signature cake"
            style={{
              position: 'absolute',
              left: 'clamp(10px, 4vw, 36px)',
              zIndex: 35,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1.5px solid rgba(251, 146, 60, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#c2410c',
              boxShadow: '0 6px 20px rgba(67, 34, 18, 0.12)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(234, 88, 12, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.92)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(67, 34, 18, 0.12)';
            }}
          >
            <ChevronLeft size={22} strokeWidth={2.4} />
          </button>

          {/* Picture Stage: Natural 3:4 Vertical Framing (Clean, Zero Unwanted Text) */}
          <div 
            style={{
              position: 'relative',
              width: 'min(88vw, 420px)',
              height: 'min(68vh, 520px)',
              zIndex: 10,
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
                  sizes="(max-width: 640px) 88vw, 420px"
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
            onClick={nextSlide}
            aria-label="Next signature cake"
            style={{
              position: 'absolute',
              right: 'clamp(10px, 4vw, 36px)',
              zIndex: 35,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1.5px solid rgba(251, 146, 60, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#c2410c',
              boxShadow: '0 6px 20px rgba(67, 34, 18, 0.12)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(234, 88, 12, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.92)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(67, 34, 18, 0.12)';
            }}
          >
            <ChevronRight size={22} strokeWidth={2.4} />
          </button>
        </div>

        {/* Series Progress Dots Pill */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '20px',
            zIndex: 40
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
              onClick={() => goToSlide(i)}
              aria-label={`Jump to cake ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
