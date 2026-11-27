"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const SIGNATURE_CAKES = [
  {
    id: 1,
    src: "/images/bespoke-theme-1.jpg",
    alt: "Signature Cocomelon Rainbow 2-Tier Theme Cake - Cake Shoppee",
    glowColor: "rgba(251, 146, 60, 0.24)"
  },
  {
    id: 2,
    src: "/images/bespoke-theme-2.jpg",
    alt: "Signature Jungle Safari 3D Animals Theme Cake - Cake Shoppee",
    glowColor: "rgba(34, 197, 94, 0.22)"
  },
  {
    id: 3,
    src: "/images/bespoke-theme-3.jpg",
    alt: "Signature Lavender & 24K Edible Gold Theme Cake - Cake Shoppee",
    glowColor: "rgba(192, 132, 252, 0.24)"
  },
  {
    id: 4,
    src: "/images/bespoke-theme-4.jpg",
    alt: "Signature Turquoise Drip Teddy Bear Theme Cake - Cake Shoppee",
    glowColor: "rgba(56, 189, 248, 0.22)"
  },
  {
    id: 5,
    src: "/images/bespoke-wedding-cake.jpg",
    alt: "Signature Grand Royal 2-Tier Wedding Cake - Cake Shoppee",
    glowColor: "rgba(244, 114, 182, 0.24)"
  }
];

// Duplicate 4 times to produce an unbroken, seamless continuous loop (20 cards)
const LOOP_CARDS = [
  ...SIGNATURE_CAKES,
  ...SIGNATURE_CAKES,
  ...SIGNATURE_CAKES,
  ...SIGNATURE_CAKES
];

export default function EditorialCakesGrid() {
  const trackRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Motion physics refs
  const currentXRef = useRef(0);
  const targetXOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragLastXRef = useRef(0);
  const dragVelocityRef = useRef(0);
  const singleSetWidthRef = useRef(0);

  const [isHovered, setIsHovered] = useState(false);

  // Measure card item + gap to compute exact single-set width for infinite wrapping
  const updateMetrics = useCallback(() => {
    if (!trackRef.current) return;
    const firstCard = trackRef.current.children[0];
    if (firstCard) {
      const cardRect = firstCard.getBoundingClientRect();
      // On desktop gap is 26px, mobile 18px
      const style = window.getComputedStyle(trackRef.current);
      const gap = parseFloat(style.gap) || 24;
      const itemWidth = cardRect.width + gap;
      singleSetWidthRef.current = itemWidth * SIGNATURE_CAKES.length;
    }
  }, []);

  useEffect(() => {
    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    return () => window.removeEventListener('resize', updateMetrics);
  }, [updateMetrics]);

  // Silky 60fps continuous traveling motion loop
  useEffect(() => {
    let active = true;

    const baseSpeed = 0.95; // Steady, luxurious travel pace in pixels per frame

    const loop = () => {
      if (!isDraggingRef.current) {
        // If not dragged or paused, travel forward continuously
        if (!isPausedRef.current) {
          currentXRef.current -= baseSpeed;
        }

        // Apply any manual step smoothly (from prev/next arrow buttons)
        if (Math.abs(targetXOffsetRef.current) > 0.1) {
          const step = targetXOffsetRef.current * 0.12;
          currentXRef.current += step;
          targetXOffsetRef.current -= step;
        }
      }

      // Infinite modular wrap: when 1 full set of 5 cards passes, wrap seamlessly
      const singleSetWidth = singleSetWidthRef.current || 1600;
      if (currentXRef.current <= -singleSetWidth) {
        currentXRef.current += singleSetWidth;
      } else if (currentXRef.current > 0) {
        currentXRef.current -= singleSetWidth;
      }

      // Hardware accelerated translation
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${currentXRef.current}px, 0, 0)`;
      }

      if (active) {
        animFrameIdRef.current = requestAnimationFrame(loop);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  // Arrow button handlers: step the series forward or backward
  const handlePrev = () => {
    const cardStep = (singleSetWidthRef.current / SIGNATURE_CAKES.length) || 330;
    targetXOffsetRef.current += cardStep;
  };

  const handleNext = () => {
    const cardStep = (singleSetWidthRef.current / SIGNATURE_CAKES.length) || 330;
    targetXOffsetRef.current -= cardStep;
  };

  // Drag & Swipe Interaction (Desktop & Touch)
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragLastXRef.current = e.clientX;
    dragVelocityRef.current = 0;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientX - dragLastXRef.current;
    dragLastXRef.current = e.clientX;
    dragVelocityRef.current = delta;
    currentXRef.current += delta;
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      targetXOffsetRef.current += dragVelocityRef.current * 8;
    }
  };

  const handleTouchStart = (e) => {
    isDraggingRef.current = true;
    isPausedRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    dragLastXRef.current = e.touches[0].clientX;
    dragVelocityRef.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current) return;
    const delta = e.touches[0].clientX - dragLastXRef.current;
    dragLastXRef.current = e.touches[0].clientX;
    dragVelocityRef.current = delta;
    currentXRef.current += delta;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    isPausedRef.current = false;
    targetXOffsetRef.current += dragVelocityRef.current * 8;
  };

  const handleCardClick = () => {
    // Only trigger if user clicked, not dragged
    if (Math.abs(dragVelocityRef.current) > 3) return;
    const el = document.getElementById('custom-cake') || document.getElementById('bestsellers');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="curated-showcase" 
      style={{
        position: 'relative',
        zIndex: 10,
        isolation: 'isolate',
        width: '100%',
        padding: '58px 0 68px 0',
        background: '#fffbf5',
        color: '#1e293b',
        overflow: 'hidden'
      }}
    >
      {/* Dynamic Warm Ambient Glow Backdrop */}
      <div 
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85vw',
          height: '520px',
          background: 'radial-gradient(circle at center, rgba(251, 146, 60, 0.16) 0%, rgba(254, 215, 170, 0.08) 50%, rgba(255, 255, 255, 0) 75%)',
          pointerEvents: 'none',
          zIndex: 1
        }} 
      />

      <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        
        {/* Standard Section Header matching the rest of the site */}
        <div className="section-header text-center" style={{ marginBottom: '36px', padding: '0 20px' }}>
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

        {/* Traveling Series Track Stage with Left & Right Vignette Gradients */}
        <div 
          style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            padding: '24px 0 32px 0',
            cursor: isDraggingRef.current ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
          onMouseEnter={() => { isPausedRef.current = true; setIsHovered(true); }}
          onMouseLeave={() => { isPausedRef.current = false; setIsHovered(false); handleMouseUp(); }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Soft Fade Vignette */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: 'clamp(40px, 8vw, 120px)',
              background: 'linear-gradient(to right, #fdfbf7 0%, rgba(253, 251, 247, 0) 100%)',
              zIndex: 25,
              pointerEvents: 'none'
            }} 
          />

          {/* Right Soft Fade Vignette */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: 'clamp(40px, 8vw, 120px)',
              background: 'linear-gradient(to left, #faf5ef 0%, rgba(250, 245, 239, 0) 100%)',
              zIndex: 25,
              pointerEvents: 'none'
            }} 
          />

          {/* Traveling Track of Cards Moving in Continuous Series */}
          <div 
            ref={trackRef}
            style={{
              display: 'flex',
              gap: 'clamp(18px, 2.2vw, 28px)',
              width: 'max-content',
              willChange: 'transform'
            }}
          >
            {LOOP_CARDS.map((cake, index) => (
              <div
                key={`cake-series-${index}`}
                onClick={handleCardClick}
                style={{
                  position: 'relative',
                  width: 'clamp(260px, 24vw, 330px)',
                  height: 'clamp(370px, 34vw, 470px)',
                  flexShrink: 0,
                  borderRadius: '26px',
                  overflow: 'hidden',
                  background: '#ffffff',
                  border: '2px solid rgba(251, 146, 60, 0.28)',
                  boxShadow: '0 20px 48px rgba(67, 34, 18, 0.10), 0 4px 14px rgba(0, 0, 0, 0.04)',
                  transition: 'transform 0.35s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.35s ease, border-color 0.35s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 28px 60px rgba(234, 88, 12, 0.20), 0 6px 18px rgba(0, 0, 0, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(234, 88, 12, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 20px 48px rgba(67, 34, 18, 0.10), 0 4px 14px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(251, 146, 60, 0.28)';
                }}
              >
                <Image
                  src={cake.src}
                  alt={cake.alt}
                  fill
                  sizes="(max-width: 640px) 260px, 330px"
                  quality={95}
                  priority={index < 4}
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'center',
                    padding: '16px',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Travel backward in series"
            style={{
              position: 'absolute',
              left: 'clamp(12px, 3vw, 36px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 35,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.94)',
              border: '1.5px solid rgba(251, 146, 60, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#c2410c',
              boxShadow: '0 8px 24px rgba(67, 34, 18, 0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(234, 88, 12, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.94)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(67, 34, 18, 0.15)';
            }}
          >
            <ChevronLeft size={24} strokeWidth={2.4} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Travel forward in series"
            style={{
              position: 'absolute',
              right: 'clamp(12px, 3vw, 36px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 35,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.94)',
              border: '1.5px solid rgba(251, 146, 60, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#c2410c',
              boxShadow: '0 8px 24px rgba(67, 34, 18, 0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(234, 88, 12, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.94)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(67, 34, 18, 0.15)';
            }}
          >
            <ChevronRight size={24} strokeWidth={2.4} />
          </button>
        </div>

        {/* Subtle Interactive Cue Below */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '8px',
            padding: '0 20px',
            textAlign: 'center'
          }}
        >
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1px solid rgba(251, 146, 60, 0.25)',
              padding: '6px 18px',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#9a3412',
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.06)'
            }}
          >
            <Sparkles size={14} color="#ea580c" />
            <span>Hover or drag to pause &bull; Tap any creation to customise live</span>
          </div>
        </div>

      </div>
    </section>
  );
}
