"use client";

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, ChevronDown } from 'lucide-react';

const SIGNATURE_CAKES = [
  {
    id: 1,
    title: "Cocomelon Rainbow 2-Tier",
    tagline: "Handcrafted Sugar Art &bull; Kids Theme",
    src: "/images/bespoke-theme-1.jpg",
    alt: "Cocomelon Rainbow 2-Tier Theme Cake - Cake Shoppee",
    glowColor: "rgba(251, 146, 60, 0.25)",
    accentColor: "#fb923c"
  },
  {
    id: 2,
    title: "Jungle Safari 3D Animals",
    tagline: "Hand-Sculpted Fondant &bull; Jungle Adventure",
    src: "/images/bespoke-theme-2.jpg",
    alt: "Jungle Safari 2-Tier Animal Theme Cake - Cake Shoppee",
    glowColor: "rgba(34, 197, 94, 0.22)",
    accentColor: "#4ade80"
  },
  {
    id: 3,
    title: "Lavender & 24K Edible Gold",
    tagline: "Royal Anniversary &bull; Sugar Lace & Gold Leaf",
    src: "/images/bespoke-theme-3.jpg",
    alt: "Lavender & Gold Stars 2-Tier Theme Cake - Cake Shoppee",
    glowColor: "rgba(192, 132, 252, 0.28)",
    accentColor: "#c084fc"
  },
  {
    id: 4,
    title: "Turquoise Drip Teddy Bear",
    tagline: "Milestone Celebration &bull; Chocolate Drip & Macarons",
    src: "/images/bespoke-theme-4.jpg",
    alt: "Turquoise Drip Teddy Bear 2-Tier Cake - Cake Shoppee",
    glowColor: "rgba(56, 189, 248, 0.24)",
    accentColor: "#38bdf8"
  },
  {
    id: 5,
    title: "Grand Royal 2-Tier Wedding Cake",
    tagline: "Handcrafted Live Patisserie &bull; Signature Centrepiece",
    src: "/images/bespoke-wedding-cake.jpg",
    alt: "Grand Royal 2-Tier Celebration Cake - Cake Shoppee",
    glowColor: "rgba(244, 114, 182, 0.25)",
    accentColor: "#f472b6"
  }
];

export default function EditorialCakesGrid() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const dotRefs = useRef([]);
  const stageGlowRef = useRef(null);
  const counterRef = useRef(null);

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
        currentProgressRef.current += diff * 0.095;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const totalCards = SIGNATURE_CAKES.length;
      const floatIndex = currentProgressRef.current * (totalCards - 1);
      const activeInt = Math.min(totalCards - 1, Math.floor(floatIndex + 0.5));

      // 1. Update Counter
      if (counterRef.current) {
        counterRef.current.innerText = `0${activeInt + 1} / 0${totalCards}`;
      }

      // 2. Update Ambient Glow Stage
      if (stageGlowRef.current) {
        const activeItem = SIGNATURE_CAKES[activeInt];
        stageGlowRef.current.style.background = `radial-gradient(circle at 50% 50%, ${activeItem.glowColor} 0%, rgba(9, 13, 22, 0) 70%)`;
      }

      // 3. Update 3D Perspective Cards
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
          const translateY = stackPos * 26;
          const translateZ = -stackPos * 50;
          const scale = Math.max(0.72, 1 - stackPos * 0.055);
          const opacity = Math.max(0, 1 - stackPos * 0.32);
          const brightness = Math.max(0.45, 1 - stackPos * 0.18);

          cardEl.style.opacity = opacity;
          cardEl.style.transform = `translate3d(0, ${translateY}px, ${translateZ}px) scale(${scale})`;
          cardEl.style.filter = `brightness(${brightness})`;
          cardEl.style.zIndex = 30 - i;
          cardEl.style.pointerEvents = stackPos < 0.3 ? 'auto' : 'none';
        }

        // 4. Update Navigation Rail Dots
        const dotEl = dotRefs.current[i];
        if (dotEl) {
          const isActive = Math.abs(rel) < 0.5;
          dotEl.style.opacity = isActive ? '1' : '0.25';
          dotEl.style.transform = isActive ? 'scale(1.4)' : 'scale(1)';
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
        height: '420vh',
        background: '#070a12',
        color: '#ffffff'
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
        {/* Dynamic Spotlight Glow Backdrop */}
        <div 
          ref={stageGlowRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.25) 0%, rgba(9, 13, 22, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 1,
            transition: 'background 0.5s ease',
            willChange: 'background'
          }} 
        />

        {/* Top Header & Counter Bar */}
        <div 
          style={{
            position: 'absolute',
            top: '32px',
            left: '0',
            right: '0',
            padding: '0 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1280px',
            margin: '0 auto',
            zIndex: 40
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: '#fed7aa',
              textTransform: 'uppercase'
            }}>
              <Sparkles size={13} color="#fb923c" />
              <span>Signature Gallery</span>
            </span>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>
              &bull; Scroll to reveal next cake
            </span>
          </div>

          <div 
            ref={counterRef}
            style={{
              fontFamily: "var(--font-playfair, Georgia, serif)",
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.08em',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)'
            }}
          >
            01 / 05
          </div>
        </div>

        {/* 3D Depth Card Stage */}
        <div 
          style={{
            position: 'relative',
            width: 'min(90vw, 860px)',
            height: 'min(70vh, 580px)',
            transformStyle: 'preserve-3d',
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
              title={`Tap to customise ${cake.title}`}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '24px',
                overflow: 'hidden',
                cursor: 'pointer',
                background: '#090d16',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.75), 0 0 40px rgba(0, 0, 0, 0.5)',
                willChange: 'transform, opacity, filter',
                transformStyle: 'preserve-3d',
                userSelect: 'none'
              }}
            >
              {/* Full-Bleed Cake Art Photo */}
              <Image
                src={cake.src}
                alt={cake.alt}
                fill
                priority={index <= 1}
                sizes="(max-width: 860px) 90vw, 860px"
                quality={95}
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center top'
                }}
              />

              {/* Subtle Ambient Edge Glow */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '24px',
                  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.15)',
                  pointerEvents: 'none'
                }} 
              />
            </div>
          ))}
        </div>

        {/* Minimal Right Navigation Track */}
        <div 
          style={{
            position: 'absolute',
            right: '28px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 40
          }}
        >
          {SIGNATURE_CAKES.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => setDotRef(el, index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#fb923c',
                opacity: index === 0 ? 1 : 0.25,
                transition: 'opacity 0.25s ease, transform 0.25s ease',
                boxShadow: '0 0 10px rgba(251, 146, 60, 0.8)'
              }}
            />
          ))}
        </div>

        {/* Bottom Scroll Hint */}
        <div 
          style={{
            position: 'absolute',
            bottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#94a3b8',
            fontSize: '0.76rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            zIndex: 40
          }}
        >
          <span>Scroll to cycle through signature creations</span>
          <ChevronDown size={14} />
        </div>
      </div>
    </section>
  );
}
