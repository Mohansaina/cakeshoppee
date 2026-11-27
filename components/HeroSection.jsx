"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  Sparkles, ChevronDown, Cake, UtensilsCrossed, Phone 
} from 'lucide-react';

const TOTAL_FRAMES = 140;

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
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const initialTitleRef = useRef(null);
  const textRevealRef = useRef(null);
  const promptRef = useRef(null);
  const vignetteRef = useRef(null);
  const progressBarRef = useRef(null);

  // Preloaded frame cache
  const imagesRef = useRef([]);
  const animFrameIdRef = useRef(null);

  // Snappy sub-frame lerp tracking (0.14 lerp for immediate 60-120fps response)
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  // Cached canvas bounds
  const boundsRef = useRef({ w: 0, h: 0, x: 0, y: 0 });

  // Ultra-fast single-draw canvas renderer (zero GPU fill-rate throttling)
  const drawFrame = useCallback((frameFloat) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const bounds = boundsRef.current;
    if (bounds.w === 0 || bounds.h === 0) return;

    const safeIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameFloat)));
    const img = imagesRef.current[safeIndex];

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, bounds.x, bounds.y, bounds.w, bounds.h);
    }
  }, []);

  // Update visual elements directly via DOM refs (zero React re-renders)
  const updateVisuals = useCallback((progress) => {
    // 0. Initial Holographic Title: visible at start, dissolves over 0.0 -> 0.16
    const introOpacity = Math.max(0, 1 - progress / 0.16);
    const introScale = 1 + progress * 0.10;
    const introTranslateY = -progress * 40;
    if (initialTitleRef.current) {
      initialTitleRef.current.style.opacity = introOpacity;
      initialTitleRef.current.style.transform = `translate(-50%, -50%) scale(${introScale}) translateY(${introTranslateY}px)`;
      initialTitleRef.current.style.pointerEvents = introOpacity > 0.05 ? 'auto' : 'none';
    }

    // 1. Initial Prompt: disappears in first ~8% of scroll
    const promptOpacity = Math.max(0, 1 - progress * 12);
    if (promptRef.current) {
      promptRef.current.style.opacity = promptOpacity;
      promptRef.current.style.pointerEvents = promptOpacity > 0.05 ? 'auto' : 'none';
    }

    // 2. Text reveals softly as video nears completion: 0.68 -> 0.88
    const textOpacity = progress < 0.68 ? 0 : Math.min(1, (progress - 0.68) / 0.18);
    const textTranslateY = Math.max(0, (1 - textOpacity) * 28);
    if (textRevealRef.current) {
      textRevealRef.current.style.opacity = textOpacity;
      textRevealRef.current.style.transform = `translateY(${textTranslateY}px)`;
      textRevealRef.current.style.pointerEvents = textOpacity > 0.3 ? 'auto' : 'none';
    }

    // 3. Dynamic Vignette
    const darkOverlayOpacity = 0.18 + textOpacity * 0.55;
    if (vignetteRef.current) {
      vignetteRef.current.style.background = `radial-gradient(circle at center, rgba(15,8,4,${darkOverlayOpacity * 0.4}) 0%, rgba(15,8,4,${darkOverlayOpacity}) 75%, rgba(15,8,4,${darkOverlayOpacity + 0.15}) 100%)`;
    }

    // 4. Progress Bar
    if (progressBarRef.current) {
      const pct = Math.min(100, Math.max(0, (progress / 0.72) * 100));
      progressBarRef.current.style.width = `${pct}%`;
    }
  }, []);

  // Update canvas resolution (capped at DPR 1.25 for 1280x720 video)
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const rect = canvas.getBoundingClientRect();

    if (rect.width > 0 && rect.height > 0) {
      const cw = Math.round(rect.width * dpr);
      const ch = Math.round(rect.height * dpr);
      canvas.width = cw;
      canvas.height = ch;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
      }

      const imgRatio = 16 / 9;
      const canvasRatio = cw / ch;

      let drawW, drawH, drawX, drawY;
      if (canvasRatio > imgRatio) {
        drawW = cw;
        drawH = cw / imgRatio;
        drawX = 0;
        drawY = (ch - drawH) / 2;
      } else {
        drawH = ch;
        drawW = ch * imgRatio;
        drawX = (cw - drawW) / 2;
        drawY = 0;
      }

      boundsRef.current = { w: drawW, h: drawH, x: drawX, y: drawY };
      drawFrame(currentFrameRef.current);
    }
  }, [drawFrame]);

  // Preload frames with immediate frame 0 paint (zero lag, zero blank screen)
  useEffect(() => {
    const imgArray = [];

    // Frame 0 loaded first for instant draw
    const firstImg = new window.Image();
    firstImg.src = `/hero-frames/frame_000.webp?v=flow-v2`;
    firstImg.onload = () => {
      drawFrame(0);
    };
    imgArray.push(firstImg);

    // Asynchronously preload remaining frames in background
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new window.Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/hero-frames/frame_${numStr}.webp?v=flow-v2`;
      imgArray.push(img);
    }
    imagesRef.current = imgArray;

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [drawFrame, updateCanvasSize]);

  // Snappy 60fps / 120fps smooth lerp render loop
  useEffect(() => {
    let active = true;

    const renderLoop = () => {
      // 1. Fluid interpolation for canvas frame (lerp factor 0.14 for zero drag/lag)
      const frameDiff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(frameDiff) > 0.001) {
        currentFrameRef.current += frameDiff * 0.14;
        drawFrame(currentFrameRef.current);
      } else if (currentFrameRef.current !== targetFrameRef.current) {
        currentFrameRef.current = targetFrameRef.current;
        drawFrame(currentFrameRef.current);
      }

      // 2. Fluid interpolation for overlays
      const progDiff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(progDiff) > 0.0003) {
        currentProgressRef.current += progDiff * 0.14;
        updateVisuals(currentProgressRef.current);
      } else if (currentProgressRef.current !== targetProgressRef.current) {
        currentProgressRef.current = targetProgressRef.current;
        updateVisuals(currentProgressRef.current);
      }

      if (active) {
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      active = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [drawFrame, updateVisuals]);

  // Scroll handler: responsive runway (290vh for effortless, silky smooth scrubbing)
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollable = containerRef.current.offsetHeight - windowHeight;

    if (totalScrollable <= 0) return;

    const currentScroll = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
    targetProgressRef.current = progress;

    // Video completes smoothly across the first 72% of scroll runway
    const videoProgress = Math.min(1, progress / 0.72);
    const targetFloat = videoProgress * (TOTAL_FRAMES - 1);
    targetFrameRef.current = targetFloat;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToNext = () => {
    if (containerRef.current) {
      const nextPos = containerRef.current.offsetTop + containerRef.current.offsetHeight;
      window.scrollTo({ top: nextPos, behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      ref={containerRef} 
      className="hero-scroll-container"
      style={{
        position: 'relative',
        height: '290vh',
        background: '#1a100a',
        color: '#ffffff'
      }}
    >
      {/* Sticky Viewport Stage */}
      <div 
        className="hero-sticky-viewport"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Instant Initial Background Image (Guarantees zero blank screen while frames cache) */}
        <Image
          src="/hero-frames/frame_000.webp"
          alt="Cake Shoppee Live Cake Kitchen"
          fill
          priority
          quality={95}
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0
          }}
        />

        {/* Scroll-Driven Frame Canvas (Smooth 60fps single-draw playback) */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            zIndex: 1
          }}
        />

        {/* Cinematic Warm Vignette */}
        <div 
          ref={vignetteRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(15,8,4,0.08) 0%, rgba(15,8,4,0.25) 75%, rgba(15,8,4,0.45) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
            willChange: 'background'
          }} 
        />
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '140px',
            background: 'linear-gradient(to bottom, rgba(15,8,4,0.75) 0%, transparent 100%)',
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
            background: 'linear-gradient(to top, rgba(15,8,4,0.85) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2
          }} 
        />

        {/* ========================================================
            INITIAL HOLOGRAPHIC HERO TITLE (Starts immediately at 0)
            ======================================================== */}
        <div 
          ref={initialTitleRef}
          style={{
            position: 'absolute',
            top: '48%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            width: '90%',
            maxWidth: '1200px',
            pointerEvents: 'auto',
            willChange: 'opacity, transform'
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
              padding: '6px 18px',
              borderRadius: '999px',
              fontSize: '0.80rem',
              fontWeight: 800,
              color: '#fed7aa',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              marginBottom: '20px',
              letterSpacing: '0.04em'
            }}
          >
            <Sparkles size={14} color="#fb923c" />
            <span>Fresh Live Bakery &bull; Narsipatnam Town</span>
          </div>

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

          <p 
            style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.25rem)',
              color: '#f8fafc',
              letterSpacing: '0.03em',
              fontWeight: 500,
              margin: '18px 0 0 0',
              textShadow: '0 2px 16px rgba(0,0,0,0.95)',
              maxWidth: '680px',
              lineHeight: 1.5,
              userSelect: 'none'
            }}
          >
            Turn a feeling, a memory, or an imagined celebration into cake.
          </p>
        </div>

        {/* Initial Scroll Prompt */}
        <div 
          ref={promptRef}
          onClick={scrollToNext}
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: '#ffffff',
            cursor: 'pointer',
            opacity: 1,
            textShadow: '0 2px 10px rgba(0,0,0,0.85)',
            willChange: 'opacity'
          }}
        >
          <span style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fed7aa' }}>
            Scroll To Pour &amp; Play ↓
          </span>
          <div 
            style={{
              width: '24px',
              height: '38px',
              borderRadius: '999px',
              border: '2px solid rgba(255,255,255,0.6)',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '6px',
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div 
              className="scroll-wheel-dot"
              style={{
                width: '4px',
                height: '8px',
                borderRadius: '2px',
                background: '#fb923c'
              }}
            />
          </div>
        </div>

        {/* Final Text & Action Buttons: Reveals softly as video completes */}
        <div 
          ref={textRevealRef}
          className="hero-final-reveal"
          style={{
            position: 'absolute',
            zIndex: 20,
            width: '100%',
            maxWidth: '1240px',
            padding: '0 24px',
            opacity: 0,
            transform: 'translateY(28px)',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            willChange: 'opacity, transform'
          }}
        >
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '8px 20px',
              borderRadius: '999px',
              fontSize: '0.84rem',
              fontWeight: 800,
              color: '#fed7aa',
              boxShadow: '0 4px 25px rgba(0,0,0,0.4)',
              marginBottom: '20px'
            }}
          >
            <Sparkles size={16} color="#fb923c" />
            <span>Narsipatnam&apos;s Premier Live Bakery &bull; Fresh Every Day</span>
          </div>

          <h2 
            style={{
              fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
              fontSize: 'clamp(2.4rem, 5.2vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#ffffff',
              textShadow: '0 4px 30px rgba(0,0,0,0.8)',
              margin: '0 0 16px 0',
              maxWidth: '850px'
            }}
          >
            Your Dream Cake,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #fb923c 0%, #f43f5e 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Crafted Live
            </span><br />
            <span style={{ fontSize: '85%', color: '#f1f5f9', fontWeight: 600 }}>
              For Every Celebration
            </span>
          </h2>

          <p 
            style={{
              fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
              color: '#e2e8f0',
              lineHeight: 1.65,
              marginBottom: '28px',
              maxWidth: '620px',
              textShadow: '0 2px 12px rgba(0,0,0,0.7)'
            }}
          >
            From custom 2-tier wedding cakes to 3D birthday themes — baked fresh with pure buttercream and finished live at our Complex Road counter.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
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

        {/* Golden Minimalist Progress Bar */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 30
          }}
        >
          <div 
            ref={progressBarRef}
            style={{
              height: '100%',
              width: '0%',
              background: 'linear-gradient(90deg, #fb923c, #f43f5e, #c084fc)',
              boxShadow: '0 0 10px rgba(251, 146, 60, 0.8)',
              transition: 'width 0.05s linear'
            }}
          />
        </div>
      </div>
    </section>
  );
}
