"use client";

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';

const SHOWCASE_IMAGES = [
  {
    id: 1,
    src: "/images/bespoke-theme-1.jpg",
    alt: "Signature Custom Cake 1 - Cake Shoppee"
  },
  {
    id: 2,
    src: "/images/bespoke-theme-2.jpg",
    alt: "Signature Custom Cake 2 - Cake Shoppee"
  },
  {
    id: 3,
    src: "/images/bespoke-theme-3.jpg",
    alt: "Signature Custom Cake 3 - Cake Shoppee"
  },
  {
    id: 4,
    src: "/images/bespoke-theme-4.jpg",
    alt: "Signature Custom Cake 4 - Cake Shoppee"
  }
];

export default function EditorialCakesGrid() {
  const containerRef = useRef(null);
  const imageRefs = useRef([]);
  const dotRefs = useRef([]);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animFrameIdRef = useRef(null);

  // Assign ref to each image layer
  const setImageRef = (el, index) => {
    imageRefs.current[index] = el;
  };

  const setDotRef = (el, index) => {
    dotRefs.current[index] = el;
  };

  useEffect(() => {
    let active = true;

    // Render loop for continuous smooth crossfade transition
    const renderLoop = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0005) {
        currentProgressRef.current += diff * 0.10;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const totalImages = SHOWCASE_IMAGES.length;
      const floatIndex = currentProgressRef.current * (totalImages - 1);

      // Update each image's opacity and scale based on scroll position
      SHOWCASE_IMAGES.forEach((_, i) => {
        const imgEl = imageRefs.current[i];
        if (!imgEl) return;

        const distance = Math.abs(floatIndex - i);
        let alpha = 0;

        if (distance < 1) {
          const raw = 1 - distance;
          // Cubic Hermite smoothstep for liquid seamless optical blend
          alpha = raw * raw * (3 - 2 * raw);
        }

        const scale = 1 + alpha * 0.04;
        imgEl.style.opacity = alpha;
        imgEl.style.transform = `scale(${scale})`;

        // Update indicator dots
        const dotEl = dotRefs.current[i];
        if (dotEl) {
          const dotActive = distance < 0.5;
          dotEl.style.opacity = dotActive ? '1' : '0.35';
          dotEl.style.transform = dotActive ? 'scale(1.3)' : 'scale(1)';
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

  return (
    <section 
      ref={containerRef}
      id="curated-showcase" 
      style={{
        position: 'relative',
        height: '340vh',
        background: '#090d16',
        color: '#ffffff'
      }}
    >
      {/* Sticky Viewport */}
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
          padding: '24px'
        }}
      >
        {/* Subtle Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px', zIndex: 10 }}>
          <h2 style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '0.04em',
            margin: 0,
            textShadow: '0 2px 14px rgba(0,0,0,0.8)'
          }}>
            Signature Handcrafted Cakes
          </h2>
        </div>

        {/* Cinematic Image Showcase Container */}
        <div 
          style={{
            position: 'relative',
            width: 'min(92vw, 920px)',
            height: 'min(74vh, 640px)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.12)',
            background: '#000000'
          }}
        >
          {SHOWCASE_IMAGES.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => setImageRef(el, index)}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: index === 0 ? 1 : 0,
                transform: 'scale(1)',
                willChange: 'opacity, transform',
                transition: 'none'
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                priority={index <= 1}
                sizes="(max-width: 920px) 92vw, 920px"
                quality={95}
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
          ))}

          {/* Vignette Shadow on the photo edges */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, transparent 65%, rgba(0,0,0,0.45) 100%)',
              pointerEvents: 'none',
              zIndex: 5
            }} 
          />
        </div>

        {/* Minimalist Progress Indicators */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '20px',
            zIndex: 10
          }}
        >
          {SHOWCASE_IMAGES.map((_, index) => (
            <div
              key={index}
              ref={(el) => setDotRef(el, index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#fb923c',
                opacity: index === 0 ? 1 : 0.35,
                transition: 'opacity 0.25s ease, transform 0.25s ease',
                boxShadow: '0 0 8px rgba(251, 146, 60, 0.6)'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
