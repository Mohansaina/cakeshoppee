"use client";

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, ChevronRight } from 'lucide-react';

const SIGNATURE_CAKES = [
  {
    id: 1,
    title: "Cocomelon Rainbow 2-Tier",
    tagline: "Handcrafted Sugar Art • Kids Theme",
    src: "/images/bespoke-theme-1.jpg",
    alt: "Cocomelon Rainbow 2-Tier Theme Cake - Cake Shoppee",
    glowColor: "rgba(251, 146, 60, 0.22)",
    accentColor: "#ea580c"
  },
  {
    id: 2,
    title: "Jungle Safari 3D Animals",
    tagline: "Hand-Sculpted Fondant • Jungle Adventure",
    src: "/images/bespoke-theme-2.jpg",
    alt: "Jungle Safari 2-Tier Animal Theme Cake - Cake Shoppee",
    glowColor: "rgba(34, 197, 94, 0.20)",
    accentColor: "#16a34a"
  },
  {
    id: 3,
    title: "Lavender & 24K Edible Gold",
    tagline: "Royal Anniversary • Sugar Lace & Gold Leaf",
    src: "/images/bespoke-theme-3.jpg",
    alt: "Lavender & Gold Stars 2-Tier Theme Cake - Cake Shoppee",
    glowColor: "rgba(192, 132, 252, 0.22)",
    accentColor: "#9333ea"
  },
  {
    id: 4,
    title: "Turquoise Drip Teddy Bear",
    tagline: "Milestone Celebration • Chocolate Drip & Macarons",
    src: "/images/bespoke-theme-4.jpg",
    alt: "Turquoise Drip Teddy Bear 2-Tier Cake - Cake Shoppee",
    glowColor: "rgba(56, 189, 248, 0.20)",
    accentColor: "#0284c7"
  },
  {
    id: 5,
    title: "Grand Royal 2-Tier Wedding Cake",
    tagline: "Handcrafted Live Patisserie • Signature Centrepiece",
    src: "/images/bespoke-wedding-cake.jpg",
    alt: "Grand Royal 2-Tier Celebration Cake - Cake Shoppee",
    glowColor: "rgba(244, 114, 182, 0.22)",
    accentColor: "#db2777"
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

    // Fluid 3D Spatial Deck Render Loop
    const renderLoop = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0005) {
        currentProgressRef.current += diff * 0.10;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const totalCards = SIGNATURE_CAKES.length;
      const floatIndex = currentProgressRef.current * (totalCards - 1);
      const activeInt = Math.min(totalCards - 1, Math.floor(floatIndex + 0.5));

      // 1. Update Ambient Glow Stage
      if (stageGlowRef.current) {
        const activeItem = SIGNATURE_CAKES[activeInt];
        stageGlowRef.current.style.background = `radial-gradient(circle at 50% 50%, ${activeItem.glowColor} 0%, rgba(255, 255, 255, 0) 70%)`;
      }

      // 2. Update 3D Perspective Cards
      SIGNATURE_CAKES.forEach((_, i) => {
        const cardEl = cardRefs.current[i];
        if (!cardEl) return;

        const rel = i - floatIndex;

        if (rel < -1.1) {
          // Scrolled past: completely out of view above
          cardEl.style.opacity = '0';
          cardEl.style.transform = 'translate3d(0, -115%, -60px) rotate(-6deg) scale(0.92)';
          cardEl.style.pointerEvents = 'none';
        } else if (rel < 0) {
          // Sweeping upward out of view
          const progressOut = -rel; // 0 to 1.1
          const translateY = -progressOut * 110;
          const rotate = -progressOut * 4.5;
          const scale = 1 - progressOut * 0.06;
          const opacity = Math.max(0, 1 - progressOut * 1.25);

          cardEl.style.opacity = opacity;
          cardEl.style.transform = `translate3d(0, ${translateY}%, 0) rotate(${rotate}deg) scale(${scale})`;
          cardEl.style.filter = 'brightness(1)';
          cardEl.style.zIndex = 30 - i;
          cardEl.style.pointerEvents = opacity > 0.4 ? 'auto' : 'none';
        } else {
          // In view or stacked behind in depth
          const stackPos = rel; // 0 for hero card, 1 for 1st behind, 2 for 2nd behind
          const translateY = stackPos * 24;
          const translateZ = -stackPos * 45;
          const scale = Math.max(0.75, 1 - stackPos * 0.05);
          const opacity = Math.max(0, 1 - stackPos * 0.30);
          const brightness = Math.max(0.70, 1 - stackPos * 0.12);

          cardEl.style.opacity = opacity;
          cardEl.style.transform = `translate3d(0, ${translateY}px, ${translateZ}px) scale(${scale})`;
          cardEl.style.filter = `brightness(${brightness})`;
          cardEl.style.zIndex = 30 - i;
          cardEl.style.pointerEvents = stackPos < 0.3 ? 'auto' : 'none';
        }

        // 3. Update Navigation Rail Dots
        const dotEl = dotRefs.current[i];
        if (dotEl) {
          const isActive = Math.abs(rel) < 0.5;
          dotEl.style.opacity = isActive ? '1' : '0.3';
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
          justifyContent: 'center',
          perspective: '1200px',
          perspectiveOrigin: '50% 50%'
        }}
      >
        {/* Dynamic Warm Ambient Glow Backdrop (No black!) */}
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

        {/* Top Header Bar (Warm Bakery Luxury Aesthetics) */}
        <div 
          style={{
            position: 'absolute',
            top: '24px',
            left: '0',
            right: '0',
            padding: '0 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            zIndex: 40,
            textAlign: 'center'
          }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.92)',
            border: '1.5px solid rgba(251, 146, 60, 0.3)',
            padding: '7px 18px',
            borderRadius: '999px',
            boxShadow: '0 4px 16px rgba(234, 88, 12, 0.08)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}>
            <Sparkles size={14} color="#ea580c" />
            <span style={{
              fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
              fontSize: '0.84rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#9a3412',
              textTransform: 'uppercase'
            }}>
              Signature Gallery &bull; Handcrafted Cakes
            </span>
          </div>

          <span style={{
            fontSize: '0.82rem',
            color: '#78716c',
            fontWeight: 600,
            letterSpacing: '0.02em'
          }}>
            Scroll to reveal signature theme creations
          </span>
        </div>

        {/* 3D Depth Card Stage — Natural 3:4 Vertical Portrait Ratio (NO ZOOMING IN ON PC!) */}
        <div 
          style={{
            position: 'relative',
            width: 'min(90vw, 440px)',
            height: 'min(72vh, 580px)',
            transformStyle: 'preserve-3d',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '36px'
          }}
        >
          {SIGNATURE_CAKES.map((cake, index) => (
            <div
              key={cake.id}
              ref={(el) => setCardRef(el, index)}
              onClick={handleCardClick}
              title={`Tap to customise ${cake.title}`}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '26px',
                overflow: 'hidden',
                cursor: 'pointer',
                background: '#ffffff',
                border: '2px solid rgba(251, 146, 60, 0.28)',
                boxShadow: '0 24px 60px rgba(67, 34, 18, 0.14), 0 4px 18px rgba(0, 0, 0, 0.05)',
                willChange: 'transform, opacity, filter',
                transformStyle: 'preserve-3d',
                userSelect: 'none',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Full Uncropped Cake Art Photo (Natural Portrait Fit, Never Zoomed) */}
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  flex: 1,
                  background: 'radial-gradient(circle at center, #ffffff 40%, #fef7ee 100%)',
                  overflow: 'hidden'
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
                    padding: '12px'
                  }}
                />
              </div>

              {/* Bottom Card Caption Ribbon */}
              <div 
                style={{
                  padding: '14px 20px',
                  background: 'linear-gradient(to top, #ffffff 0%, rgba(255, 255, 255, 0.95) 100%)',
                  borderTop: '1px solid #fed7aa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <h3 
                    style={{
                      fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: '#1e293b',
                      margin: '0 0 2px 0',
                      lineHeight: 1.2
                    }}
                  >
                    {cake.title}
                  </h3>
                  <p 
                    style={{
                      fontSize: '0.74rem',
                      color: '#64748b',
                      margin: 0,
                      fontWeight: 500
                    }}
                  >
                    {cake.tagline}
                  </p>
                </div>

                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#fff7ed',
                    color: '#ea580c',
                    flexShrink: 0
                  }}
                >
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Navigation Rail Dots (Warm Bakery Styling) */}
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

        {/* Bottom Scroll Cue */}
        <div 
          style={{
            position: 'absolute',
            bottom: '22px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#78716c',
            fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            zIndex: 40
          }}
        >
          <span>Tap any cake to design your bespoke theme</span>
        </div>
      </div>
    </section>
  );
}
