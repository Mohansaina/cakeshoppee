"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Volume2, VolumeX, Play, Pause, ChevronDown, 
  Sparkles, Award, Clock, ShieldCheck 
} from 'lucide-react';

const TOTAL_FRAMES = 120;

export default function HeroSection() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Store preloaded HTMLImageElements
  const imagesRef = useRef([]);
  const isReadyRef = useRef(false);
  const animFrameIdRef = useRef(null);
  const autoPlayFrameRef = useRef(0);

  // Draw a specific frame to the canvas (aspect ratio 'cover')
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;

    // Cover math (similar to CSS object-fit: cover)
    const imgRatio = img.naturalWidth / img.naturalHeight;
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

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Set high-DPI canvas size matching window
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      drawFrame(currentFrame);
    }
  }, [currentFrame, drawFrame]);

  // Preload all 120 WebP frames
  useEffect(() => {
    let loaded = 0;
    const imgArray = [];

    // Preload frame 0 immediately
    const firstImg = new Image();
    firstImg.src = `/hero-frames/frame_000.webp`;
    firstImg.onload = () => {
      drawFrame(0);
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/hero-frames/frame_${numStr}.webp`;
      img.onload = () => {
        loaded++;
        setImagesLoaded(loaded);
        if (i === 0) drawFrame(0);
        if (loaded >= 15) isReadyRef.current = true;
      };
      imgArray.push(img);
    }
    imagesRef.current = imgArray;

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [drawFrame, updateCanvasSize]);

  // Handle scroll: Video completes in first 70% of scroll, then text reveals
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollable = containerRef.current.offsetHeight - windowHeight;

    if (totalScrollable <= 0) return;

    // Scroll progress from 0.0 to 1.0
    const currentScroll = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
    setScrollProgress(progress);

    // Video completes smoothly between progress 0.0 and 0.70
    const videoProgress = Math.min(1, progress / 0.70);
    const targetIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(videoProgress * (TOTAL_FRAMES - 1))));
    
    if (!isAutoPlay) {
      setCurrentFrame(targetIndex);
      drawFrame(targetIndex);
    }
  }, [drawFrame, isAutoPlay]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Optional Autoplay loop
  useEffect(() => {
    if (!isAutoPlay) {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    let lastTime = performance.now();
    const fpsInterval = 1000 / 24; // 24 fps playback

    const loop = (now) => {
      const elapsed = now - lastTime;
      if (elapsed > fpsInterval) {
        lastTime = now - (elapsed % fpsInterval);
        autoPlayFrameRef.current = (autoPlayFrameRef.current + 1) % TOTAL_FRAMES;
        setCurrentFrame(autoPlayFrameRef.current);
        drawFrame(autoPlayFrameRef.current);
      }
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isAutoPlay, drawFrame]);

  // Smooth scroll helper to next section
  const scrollToNext = () => {
    if (containerRef.current) {
      const nextPos = containerRef.current.offsetTop + containerRef.current.offsetHeight;
      window.scrollTo({ top: nextPos, behavior: 'smooth' });
    }
  };

  // Video completes at 0.70
  // Text reveals after video completes: 0.68 -> 0.85
  const isVideoComplete = scrollProgress >= 0.70;
  const textOpacity = scrollProgress < 0.68 ? 0 : Math.min(1, (scrollProgress - 0.68) / 0.14);
  const textTranslateY = Math.max(0, (1 - textOpacity) * 35);

  // Vignette overlay gets darker when text reveals to ensure white/gold typography pops
  const darkOverlayOpacity = 0.25 + textOpacity * 0.55;

  // Initial scroll prompt (only at the very top, disappears immediately upon scrolling)
  const promptOpacity = Math.max(0, 1 - scrollProgress * 12);

  return (
    <section 
      id="hero" 
      ref={containerRef} 
      className="hero-scroll-container"
      style={{
        position: 'relative',
        height: '260vh',
        background: '#090d16',
        color: '#ffffff'
      }}
    >
      {/* Sticky Viewport */}
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
        {/* ========================================================
            CANVAS FRAME-BY-FRAME RENDERER (Clean, No Text Initially)
            ======================================================== */}
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

        {/* Dynamic Dark Vignette (Darkens when text appears for maximum contrast) */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at center, rgba(9,13,22,${darkOverlayOpacity * 0.5}) 0%, rgba(9,13,22,${darkOverlayOpacity}) 75%, rgba(9,13,22,${darkOverlayOpacity + 0.15}) 100%)`,
            pointerEvents: 'none',
            zIndex: 2,
            transition: 'background 0.15s ease'
          }} 
        />
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '160px',
            background: 'linear-gradient(to bottom, rgba(9,13,22,0.92) 0%, transparent 100%)',
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
            height: '200px',
            background: 'linear-gradient(to top, rgba(9,13,22,1) 0%, rgba(9,13,22,0.65) 50%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2
          }} 
        />

        {/* ========================================================
            INITIAL PROMPT (Clean, vanishes immediately upon scroll)
            ======================================================== */}
        {promptOpacity > 0.01 && (
          <div 
            onClick={scrollToNext}
            style={{
              position: 'absolute',
              bottom: '36px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 15,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              opacity: promptOpacity,
              transition: 'opacity 0.15s ease-out',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)'
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Scroll To Play Video ↓
            </span>
            <div 
              style={{
                width: '26px',
                height: '42px',
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
        )}

        {/* ========================================================
            FINAL TEXT REVEAL: ONLY APPEARS AFTER VIDEO COMPLETES
            ======================================================== */}
        <div 
          className="hero-final-reveal"
          style={{
            position: 'absolute',
            zIndex: 20,
            width: '100%',
            maxWidth: '1240px',
            padding: '0 24px',
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
            pointerEvents: textOpacity > 0.3 ? 'auto' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out'
          }}
        >
          {/* Live Bakery Badge */}
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

          {/* Main Headline */}
          <h1 
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
          </h1>

          {/* Description */}
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

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
            <a 
              href="#custom-cake" 
              style={{
                background: 'linear-gradient(135deg, #ea580c 0%, #e11d48 100%)',
                color: '#ffffff',
                padding: '14px 32px',
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
              🎂 Design Your Cake
            </a>

            <a 
              href="tel:7660948403" 
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(255, 255, 255, 0.35)',
                color: '#ffffff',
                padding: '13px 28px',
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
              📞 Call Master Baker
            </a>

            <button
              type="button"
              onClick={scrollToNext}
              style={{
                background: 'rgba(251, 146, 60, 0.2)',
                border: '1.5px solid rgba(251, 146, 60, 0.5)',
                color: '#fed7aa',
                padding: '13px 24px',
                borderRadius: '999px',
                fontSize: '0.94rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Explore Menu</span>
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Stats Row */}
          <div 
            style={{
              display: 'inline-flex',
              gap: '24px',
              padding: '12px 24px',
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.18)'
            }}
          >
            {[
              { num: '5,000+', label: 'Celebrations' },
              { num: '100%', label: 'Pure Eggless' },
              { num: '20 Min', label: 'Express Decor' }
            ].map((s, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#fb923c',
                  fontFamily: 'var(--font-playfair, Georgia, serif)',
                  lineHeight: 1.1
                }}>
                  {s.num}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, marginTop: '2px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Downward prompt */}
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>
            <span>Continue scrolling down to explore cakes &amp; savouries</span>
            <ChevronDown size={14} />
          </div>

        </div>

        {/* ========================================================
            HUD CONTROLS: Autoplay Mode Toggle in Bottom Right
            ======================================================== */}
        <div 
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <button
            type="button"
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            aria-label={isAutoPlay ? "Switch to Scroll Mode" : "Switch to Autoplay Mode"}
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '999px',
              padding: '7px 14px',
              color: '#ffffff',
              fontSize: '0.76rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {isAutoPlay ? (
              <>
                <Pause size={13} color="#fb923c" />
                <span style={{ color: '#fb923c' }}>Playing</span>
              </>
            ) : (
              <>
                <Play size={13} color="#94a3b8" />
                <span>Scroll Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Golden Scroll Progress Bar */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 40
          }}
        >
          <div 
            style={{
              height: '100%',
              width: `${Math.min(100, (scrollProgress / 0.70) * 100)}%`,
              background: 'linear-gradient(90deg, #ea580c 0%, #f43f5e 50%, #fb923c 100%)',
              boxShadow: '0 0 10px rgba(251, 146, 60, 0.8)',
              transition: 'width 0.04s linear'
            }}
          />
        </div>

      </div>
    </section>
  );
}
