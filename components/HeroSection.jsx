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

  // Handle true frame-by-frame scroll binding
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollable = containerRef.current.offsetHeight - windowHeight;

    if (totalScrollable <= 0) return;

    // Scroll progress 0.0 to 1.0
    const currentScroll = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
    setScrollProgress(progress);

    // Exact frame index calculation (0 to 119)
    const targetIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1))));
    
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

  // Stage 1 (Frame 0 -> 40): Grand Hero Headline
  const stage1Opacity = Math.max(0, Math.min(1, (0.35 - scrollProgress) / 0.22));
  const stage1Transform = `translateY(${scrollProgress * -70}px)`;

  // Stage 2 (Frame 40 -> 85): Floating Highlight Pills
  const stage2Opacity = scrollProgress >= 0.28 && scrollProgress <= 0.78
    ? Math.min((scrollProgress - 0.28) / 0.12, (0.78 - scrollProgress) / 0.12)
    : 0;

  // Stage 3 (Frame 85 -> 120): Final Call to Action
  const stage3Opacity = Math.max(0, Math.min(1, (scrollProgress - 0.72) / 0.2));
  const stage3Transform = `translateY(${(1 - scrollProgress) * 35}px)`;

  return (
    <section 
      id="hero" 
      ref={containerRef} 
      className="hero-scroll-container"
      style={{
        position: 'relative',
        height: '240vh',
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
            CANVAS FRAME-BY-FRAME RENDERER (Apple-Style)
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

        {/* Cinematic Vignette Overlays for crisp text contrast */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(9,13,22,0.25) 0%, rgba(9,13,22,0.7) 75%, rgba(9,13,22,0.95) 100%)',
            pointerEvents: 'none',
            zIndex: 2
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
            STAGE 1: GRAND INTRO (Frames 0 -> 40)
            ======================================================== */}
        <div 
          className="hero-stage hero-stage-1"
          style={{
            position: 'absolute',
            zIndex: 10,
            width: '100%',
            maxWidth: '1240px',
            padding: '0 24px',
            opacity: stage1Opacity,
            transform: stage1Transform,
            pointerEvents: stage1Opacity > 0.15 ? 'auto' : 'none',
            transition: 'opacity 0.15s ease-out, transform 0.15s ease-out'
          }}
        >
          <div style={{ maxWidth: '680px' }}>
            {/* Live Bakery Badge */}
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '7px 18px',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#fed7aa',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
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
                fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
                fontWeight: 800,
                lineHeight: 1.12,
                color: '#ffffff',
                textShadow: '0 4px 24px rgba(0,0,0,0.6)',
                margin: '0 0 20px 0'
              }}
            >
              Your Dream Cake,<br />
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
                marginBottom: '32px',
                maxWidth: '540px',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              From custom 2-tier wedding cakes to 3D birthday themes — baked fresh with pure buttercream and finished live at our Complex Road counter.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
              <a 
                href="#custom-cake" 
                style={{
                  background: 'linear-gradient(135deg, #ea580c 0%, #e11d48 100%)',
                  color: '#ffffff',
                  padding: '14px 28px',
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
                📞 Call Master Baker
              </a>
            </div>

            {/* Stats Row */}
            <div 
              style={{
                display: 'inline-flex',
                gap: '24px',
                padding: '14px 22px',
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              {[
                { num: '5,000+', label: 'Celebrations' },
                { num: '100%', label: 'Pure Eggless' },
                { num: '20 Min', label: 'Express Decor' }
              ].map((s, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '1.3rem',
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

          </div>
        </div>

        {/* ========================================================
            STAGE 2: FRAME-BY-FRAME CRAFT REVEAL (Frames 40 -> 85)
            ======================================================== */}
        <div 
          className="hero-stage hero-stage-2"
          style={{
            position: 'absolute',
            zIndex: 10,
            width: '100%',
            maxWidth: '1240px',
            padding: '0 24px',
            opacity: stage2Opacity,
            pointerEvents: stage2Opacity > 0.2 ? 'auto' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            transition: 'opacity 0.2s ease-out'
          }}
        >
          {/* Centered Golden Eyebrow */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#fdba74',
              fontSize: '0.84rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '12px',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)'
            }}
          >
            <Sparkles size={16} /> Live Master Decor in Action
          </div>

          <h2 
            style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
              fontWeight: 800,
              color: '#ffffff',
              maxWidth: '820px',
              lineHeight: 1.2,
              marginBottom: '36px',
              textShadow: '0 4px 20px rgba(0,0,0,0.8)'
            }}
          >
            Watch Every Layer Baked Fresh &amp; Decorated Live
          </h2>

          {/* Floating Pill Highlights */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '900px' }}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 20px',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '16px',
                border: '1px solid rgba(251, 146, 60, 0.35)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                textAlign: 'left'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(234, 88, 12, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={22} color="#fb923c" />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>100% Pure Ingredients</div>
                <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>Real rich cream &bull; Zero chemicals</div>
              </div>
            </div>

            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 20px',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '16px',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                textAlign: 'left'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={22} color="#f43f5e" />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>20-Min Live Counter</div>
                <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>Watch custom piping on the spot</div>
              </div>
            </div>

            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 20px',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '16px',
                border: '1px solid rgba(192, 132, 252, 0.35)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                textAlign: 'left'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(192, 132, 252, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} color="#c084fc" />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>100% Pure Eggless Options</div>
                <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>Strict vegetarian kitchen hygiene</div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            STAGE 3: CALL TO EXPLORE MENU (Frames 85 -> 120)
            ======================================================== */}
        <div 
          className="hero-stage hero-stage-3"
          style={{
            position: 'absolute',
            zIndex: 10,
            width: '100%',
            maxWidth: '1240px',
            padding: '0 24px',
            opacity: stage3Opacity,
            transform: stage3Transform,
            pointerEvents: stage3Opacity > 0.2 ? 'auto' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out'
          }}
        >
          <div 
            style={{
              padding: '24px 32px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1.5px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              maxWidth: '680px'
            }}
          >
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              ✨ Fresh Tastes Await
            </div>
            <h2 
              style={{
                fontFamily: 'var(--font-playfair, Georgia, serif)',
                fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '12px',
                lineHeight: 1.2
              }}
            >
              Ready to Order Your Celebration?
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px' }}>
              Explore our fresh cool cakes, pizzas, burgers, chicken combos, and celebration boxes below.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={scrollToNext}
                style={{
                  background: 'linear-gradient(135deg, #ea580c 0%, #e11d48 100%)',
                  color: '#ffffff',
                  padding: '13px 28px',
                  borderRadius: '999px',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(234, 88, 12, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>🍰 Browse Today&apos;s Menu</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            HUD CONTROLS: Autoplay Toggle & Frame Indicator
            ======================================================== */}
        <div 
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {/* Autoplay / Scroll Mode Pill */}
          <button
            type="button"
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            aria-label={isAutoPlay ? "Switch to Scroll Scrub Mode" : "Switch to Autoplay Mode"}
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '999px',
              padding: '8px 14px',
              color: '#ffffff',
              fontSize: '0.78rem',
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
                <Pause size={14} color="#fb923c" />
                <span style={{ color: '#fb923c' }}>Playing (Tap for Scroll)</span>
              </>
            ) : (
              <>
                <Play size={14} color="#94a3b8" />
                <span>Scroll Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Scroll Indicator Prompt (Stage 1) */}
        {scrollProgress < 0.25 && (
          <div 
            onClick={scrollToNext}
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              color: '#e2e8f0',
              cursor: 'pointer',
              opacity: Math.max(0, 1 - scrollProgress * 4),
              transition: 'opacity 0.2s ease-out'
            }}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              Scroll To Reveal Frame By Frame
            </span>
            <div 
              style={{
                width: '26px',
                height: '40px',
                borderRadius: '999px',
                border: '2px solid rgba(255,255,255,0.4)',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '6px',
                background: 'rgba(0,0,0,0.2)'
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
              width: `${(currentFrame / (TOTAL_FRAMES - 1)) * 100}%`,
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
