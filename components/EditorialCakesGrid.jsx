"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';

const SHOWCASE_CAKES = [
  {
    id: 1,
    title: "Cocomelon Rainbow 2-Tier Cake",
    category: "Kids Birthday Theme",
    badge: "Live Counter Custom",
    image: "/images/bespoke-theme-1.jpg",
    alt: "2-Tier Cocomelon Rainbow Custom Theme Cake - Cake Shopee",
  },
  {
    id: 2,
    title: "Jungle Safari 2-Tier Animal Cake",
    category: "Handcrafted 3D Sculpted",
    badge: "Pure Fondant Art",
    image: "/images/bespoke-theme-2.jpg",
    alt: "2-Tier Jungle Safari Animal Custom Theme Cake - Cake Shopee",
  },
  {
    id: 3,
    title: "Lavender & Gold Stars 2-Tier Cake",
    category: "Royal Anniversary & Wedding",
    badge: "24K Edible Gold Leaf",
    image: "/images/bespoke-theme-3.jpg",
    alt: "2-Tier Lavender & Gold Stars Theme Cake - Cake Shopee",
  },
  {
    id: 4,
    title: "Turquoise Drip Teddy Bear Cake",
    category: "First Birthday Milestone",
    badge: "Artisan Chocolate Drip",
    image: "/images/bespoke-theme-4.jpg",
    alt: "2-Tier Turquoise Drip Teddy Bear Theme Cake - Cake Shopee",
  },
];

export default function EditorialCakesGrid() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleScrollToCustom = () => {
    const el = document.getElementById('custom-cake') || document.getElementById('bestsellers');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={sectionRef}
      className="bloom-gallery-strip-section" 
      id="curated-showcase" 
      style={{ padding: '64px 0 48px', overflow: 'hidden' }}
    >
      <div className="bloom-gallery-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, #fdf0ed 0%, #fbe3dc 100%)',
            color: '#c88a4c',
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '0.12em',
            padding: '6px 18px',
            borderRadius: '50px',
            textTransform: 'uppercase',
            marginBottom: '10px',
            border: '1px solid rgba(200, 138, 76, 0.2)'
          }}>
            <Sparkles size={13} color="#c88a4c" />
            <span>Artisanal Masterpieces</span>
          </span>
          <h2 style={{ 
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)", 
            fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', 
            fontWeight: '800', 
            color: '#2c1a11',
            margin: '6px 0 10px',
            lineHeight: 1.2
          }}>
            Signature Handcrafted Live Cakes
          </h2>
          <p style={{ color: '#6e5f58', fontSize: '0.96rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Explore our custom theme cake creations freshly designed &amp; decorated live for your special celebrations in Narsipatnam.
          </p>
        </div>

        {/* Dynamic Wave Staggered Series Grid */}
        <div className="bloom-gallery-grid">
          {SHOWCASE_CAKES.map((cake, index) => (
            <div 
              key={cake.id} 
              className="bloom-gallery-item"
              onClick={handleScrollToCustom}
              title={`Customise ${cake.title}`}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView 
                  ? 'translateY(0) scale(1)' 
                  : 'translateY(55px) scale(0.92)',
                transition: `opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${index * 160}ms, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${index * 160}ms, box-shadow 0.4s ease`,
                animation: inView ? `signatureCardWave 4.6s ease-in-out infinite ${index * 0.75 + 0.85}s` : 'none',
                willChange: 'transform, opacity'
              }}
            >
              {/* Badge Overlay */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 3,
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#c2410c',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Sparkles size={11} color="#ea580c" />
                <span>{cake.badge}</span>
              </div>

              {/* Photo */}
              <div className="bloom-gallery-img-wrap">
                <Image
                  src={cake.image}
                  alt={cake.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                  quality={95}
                  className="bloom-gallery-photo"
                />
              </div>

              {/* Caption Card */}
              <div style={{
                padding: '14px 16px',
                background: '#ffffff',
                borderTop: '1px solid #f1f5f9'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {cake.category}
                </div>
                <h3 style={{
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  margin: '4px 0 8px',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {cake.title}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#e11d48'
                }}>
                  <span>Customise with Baker</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
