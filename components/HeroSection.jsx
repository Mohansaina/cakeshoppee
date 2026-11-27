"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, Cake, UtensilsCrossed, Phone } from 'lucide-react';

export default function HeroSection() {
  const videoRef = useRef(null);
  const [showContent, setShowContent] = useState(false);

  const heroContainerRef = useRef(null);

  // Ensure immediate video start on low data and mobile devices, and pause when scrolled out of view
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playbackRate = 0.85;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }

    // Pause video when out of viewport so GPU plane never leaks into subsequent sections
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!video) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );

    if (heroContainerRef.current) {
      observer.observe(heroContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // When video reaches end of pour cascade (~4.8s in 0.75x slow motion), smoothly reveal brand headline
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.currentTime >= 4.8 && !showContent) {
      setShowContent(true);
    }
  };

  // If user scrolls or taps, immediately show content without waiting
  useEffect(() => {
    const handleScrollOrTouch = () => {
      if (window.scrollY > 15) {
        setShowContent(true);
      }
    };
    window.addEventListener('scroll', handleScrollOrTouch, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollOrTouch);
  }, []);

  const scrollToNext = () => {
    const nextEl = document.getElementById('curated-showcase') || document.getElementById('bestsellers');
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRevealNow = () => {
    setShowContent(true);
  };

  return (
    <section 
      ref={heroContainerRef}
      id="hero" 
      className="hero-section-cinematic"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        height: '100vh',
        overflow: 'hidden',
        contain: 'paint',
        isolation: 'isolate',
        clipPath: 'inset(0)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#321c10',
        color: '#ffffff',
        zIndex: 1
      }}
    >
      {/* Instant Initial Background Image (Guarantees zero black screen even on slow network) */}
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

      {/* Hardware-Accelerated Seamless Video Background (Preloaded, native 0.75x slow motion, strictly confined to hero) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        defaultMuted
        playsInline
        preload="auto"
        poster="/hero-frames/frame_000.webp"
        onTimeUpdate={handleTimeUpdate}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 2,
          backgroundColor: '#321c10'
        }}
      >
        <source src="/videos/hero-scroll.mp4" type="video/mp4" />
      </video>

      {/* Warm Ambient Bakery Overlay: Softly deepens when content appears */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: showContent 
            ? 'radial-gradient(circle at center, rgba(30, 14, 6, 0.35) 0%, rgba(20, 10, 4, 0.65) 70%, rgba(15, 7, 3, 0.85) 100%)'
            : 'radial-gradient(circle at center, rgba(20, 10, 4, 0.08) 0%, rgba(15, 7, 3, 0.28) 100%)',
          zIndex: 3,
          pointerEvents: 'none',
          transition: 'background 0.8s ease'
        }} 
      />

      {/* Top & Bottom Cinematic Edge Gradients */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, rgba(18, 9, 3, 0.7) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 4
        }} 
      />
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '160px',
          background: 'linear-gradient(to top, rgba(18, 9, 3, 0.85) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 4
        }} 
      />

      {/* Subtle indicator while video plays at 0.75x before content appears */}
      {!showContent && (
        <div 
          onClick={handleRevealNow}
          style={{
            position: 'absolute',
            bottom: '36px',
            zIndex: 15,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '8px 20px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#fed7aa',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            letterSpacing: '0.04em'
          }}
        >
          <span>Live Patisserie Pour &bull; Tap to explore menu ↓</span>
        </div>
      )}

      {/* =========================================================================
          HERO CONTENT: REVEALS ELEGANTLY AFTER THE POUR COMPLETES
          ========================================================================= */}
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
          marginTop: '-15px',
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.96)',
          pointerEvents: showContent ? 'auto' : 'none',
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'opacity, transform'
        }}
      >
        {/* Brand Headline: Warm Golden-Caramel Artisan Luxury */}
        <h1 
          style={{
            fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
            fontSize: 'clamp(2.8rem, 8.5vw, 6.2rem)',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: '0 0 6px 0',
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
            alignItems: 'center'
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
      </div>

      {/* Bottom Scroll Cue */}
      {showContent && (
        <div 
          onClick={scrollToNext}
          aria-label="Scroll to menu"
          style={{
            position: 'absolute',
            bottom: '22px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            animation: 'fadeInUp 0.6s ease'
          }}
        >
          <ChevronDown size={22} className="bounce-arrow" color="#fed7aa" />
        </div>
      )}
    </section>
  );
}
