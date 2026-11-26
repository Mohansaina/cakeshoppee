"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Play, Pause, ChevronDown, 
  Sparkles, Award, Clock, ShieldCheck 
} from 'lucide-react';

const TOTAL_FRAMES = 140;

export default function HeroSection() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const vignetteRef = useRef(null);
  const promptRef = useRef(null);
  const textRevealRef = useRef(null);
  const progressBarRef = useRef(null);

  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Store preloaded HTMLImageElements
  const imagesRef = useRef([]);
  const animFrameIdRef = useRef(null);
  const autoPlayFrameRef = useRef(0);

  // High-precision sub-frame lerp tracking
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  // Cached canvas bounds for maximum 60fps/120fps performance
  const boundsRef = useRef({ w: 0, h: 0, x: 0, y: 0 });

  // Draw continuous blended frames to canvas with S-curve Hermite smoothstep
  const drawBlendFrame = useCallback((floatIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const bounds = boundsRef.current;
    if (bounds.w === 0 || bounds.h === 0) return;

    const safeFloat = Math.min(TOTAL_FRAMES - 1, Math.max(0, floatIndex));
    const frameA = Math.floor(safeFloat);
    const frameB = Math.min(TOTAL_FRAMES - 1, frameA + 1);
    const rawFraction = safeFloat - frameA;

    const imgA = imagesRef.current[frameA];
    if (!imgA || !imgA.complete || imgA.naturalWidth === 0) return;

    // 1. Draw primary frame
    ctx.globalAlpha = 1;
    ctx.drawImage(imgA, bounds.x, bounds.y, bounds.w, bounds.h);

    // 2. Optical crossfade blend with next frame using Hermite smoothstep (zero boundary acceleration)
    if (frameB !== frameA && rawFraction > 0.001) {
      const imgB = imagesRef.current[frameB];
      if (imgB && imgB.complete && imgB.naturalWidth > 0) {
        const smoothAlpha = rawFraction * rawFraction * (3 - 2 * rawFraction);
        ctx.globalAlpha = smoothAlpha;
        ctx.drawImage(imgB, bounds.x, bounds.y, bounds.w, bounds.h);
        ctx.globalAlpha = 1;
      }
    }
  }, []);

  // Update visual elements directly via DOM refs (zero React re-renders during scroll)
  const updateVisuals = useCallback((progress) => {
    // 1. Text reveals softly after video completes: 0.72 -> 0.88
    const textOpacity = progress < 0.72 ? 0 : Math.min(1, (progress - 0.72) / 0.16);
    const textTranslateY = Math.max(0, (1 - textOpacity) * 32);
    if (textRevealRef.current) {
      textRevealRef.current.style.opacity = textOpacity;
      textRevealRef.current.style.transform = `translateY(${textTranslateY}px)`;
      textRevealRef.current.style.pointerEvents = textOpacity > 0.3 ? 'auto' : 'none';
    }

    // 2. Vignette dark overlay: 0.20 -> 0.80
    const darkOverlayOpacity = 0.20 + textOpacity * 0.60;
    if (vignetteRef.current) {
      vignetteRef.current.style.background = `radial-gradient(circle at center, rgba(9,13,22,${darkOverlayOpacity * 0.45}) 0%, rgba(9,13,22,${darkOverlayOpacity}) 75%, rgba(9,13,22,${darkOverlayOpacity + 0.15}) 100%)`;
    }

    // 3. Initial prompt: clean, disappears in first ~6% of scroll
    const promptOpacity = Math.max(0, 1 - progress * 16);
    if (promptRef.current) {
      promptRef.current.style.opacity = promptOpacity;
      promptRef.current.style.pointerEvents = promptOpacity > 0.05 ? 'auto' : 'none';
    }

    // 4. Golden progress bar: fills across 0% -> 72%
    if (progressBarRef.current) {
      const pct = Math.min(100, Math.max(0, (progress / 0.72) * 100));
      progressBarRef.current.style.width = `${pct}%`;
    }
  }, []);

  // Update canvas resolution and cache aspect-fit bounds
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();

    if (rect.width > 0 && rect.height > 0) {
      const cw = Math.round(rect.width * dpr);
      const ch = Math.round(rect.height * dpr);
      canvas.width = cw;
      canvas.height = ch;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }

      // Aspect cover calculation (1280x720 is 16:9)
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
      drawBlendFrame(currentFrameRef.current);
    }
  }, [drawBlendFrame]);

  // Preload and GPU-decode all WebP frames
  useEffect(() => {
    let loaded = 0;
    const imgArray = [];

    // Preload frame 0 immediately
    const firstImg = new Image();
    firstImg.src = `/hero-frames/frame_000.webp?v=flow-v2`;
    firstImg.onload = () => {
      if (firstImg.decode) {
        firstImg.decode().then(() => drawBlendFrame(0)).catch(() => drawBlendFrame(0));
      } else {
        drawBlendFrame(0);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/hero-frames/frame_${numStr}.webp?v=flow-v2`;
      
      const onImageReady = () => {
        loaded++;
        setImagesLoaded(loaded);
        if (i === 0) drawBlendFrame(0);
      };

      if (img.decode) {
        img.decode().then(onImageReady).catch(onImageReady);
      } else {
        img.onload = onImageReady;
      }
      imgArray.push(img);
    }
    imagesRef.current = imgArray;

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [drawBlendFrame, updateCanvasSize]);

  // Ultra-buttery momentum lerp render loop
  useEffect(() => {
    let active = true;

    const renderLoop = () => {
      if (!isAutoPlay) {
        // 1. Smooth momentum interpolation for canvas frame
        const frameDiff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(frameDiff) > 0.001) {
          currentFrameRef.current += frameDiff * 0.055;
          drawBlendFrame(currentFrameRef.current);
        } else if (currentFrameRef.current !== targetFrameRef.current) {
          currentFrameRef.current = targetFrameRef.current;
          drawBlendFrame(currentFrameRef.current);
        }

        // 2. Smooth momentum interpolation for text reveal & overlays
        const progDiff = targetProgressRef.current - currentProgressRef.current;
        if (Math.abs(progDiff) > 0.0002) {
          currentProgressRef.current += progDiff * 0.07;
          updateVisuals(currentProgressRef.current);
        } else if (currentProgressRef.current !== targetProgressRef.current) {
          currentProgressRef.current = targetProgressRef.current;
          updateVisuals(currentProgressRef.current);
        }
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
  }, [isAutoPlay, drawBlendFrame, updateVisuals]);

  // Scroll handler: pure calculation, 0 state re-renders
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollable = containerRef.current.offsetHeight - windowHeight;

    if (totalScrollable <= 0) return;

    // Scroll progress from 0.0 to 1.0
    const currentScroll = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
    targetProgressRef.current = progress;

    // Video completes smoothly across the first 72% of scroll runway
    const videoProgress = Math.min(1, progress / 0.72);
    const targetFloat = videoProgress * (TOTAL_FRAMES - 1);
    
    if (!isAutoPlay) {
      targetFrameRef.current = targetFloat;
    }
  }, [isAutoPlay]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Autoplay loop option
  useEffect(() => {
    if (!isAutoPlay) return;

    let lastTime = performance.now();
    const fpsInterval = 1000 / 24;

    const loop = (now) => {
      const elapsed = now - lastTime;
      if (elapsed > fpsInterval) {
        lastTime = now - (elapsed % fpsInterval);
        autoPlayFrameRef.current = (autoPlayFrameRef.current + 1) % TOTAL_FRAMES;
        currentFrameRef.current = autoPlayFrameRef.current;
        drawBlendFrame(autoPlayFrameRef.current);
      }
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isAutoPlay, drawBlendFrame]);

  // Smooth scroll helper to next section
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
        height: '700vh',
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
            CANVAS FRAME-BY-FRAME RENDERER (Dual-Frame Optical Blend)
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
          ref={vignetteRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(9,13,22,0.09) 0%, rgba(9,13,22,0.20) 75%, rgba(9,13,22,0.35) 100%)',
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
        <div 
          ref={promptRef}
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
            opacity: 1,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            willChange: 'opacity'
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

        {/* ========================================================
            FINAL TEXT REVEAL: ONLY APPEARS AFTER VIDEO COMPLETES
            ======================================================== */}
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
            transform: 'translateY(32px)',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            willChange: 'opacity, transform'
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

          {/* Downward prompt */}
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>
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
            ref={progressBarRef}
            style={{
              height: '100%',
              width: '0%',
              background: 'linear-gradient(90deg, #ea580c 0%, #f43f5e 50%, #fb923c 100%)',
              boxShadow: '0 0 10px rgba(251, 146, 60, 0.8)',
              willChange: 'width'
            }}
          />
        </div>

      </div>
    </section>
  );
}
