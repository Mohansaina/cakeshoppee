"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Volume2, VolumeX, Play, Pause, ChevronDown, 
  Sparkles, Award, Clock, Heart, ShieldCheck 
} from 'lucide-react';

export default function HeroSection() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoDuration, setVideoDuration] = useState(10);

  // Smooth scroll scrubbing with requestAnimationFrame
  const animationFrameRef = useRef(null);
  const targetTimeRef = useRef(0);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollable = containerRef.current.offsetHeight - windowHeight;
    
    if (totalScrollable <= 0) return;

    // Calculate progress from 0.0 to 1.0
    const currentScroll = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
    setScrollProgress(progress);

    // If video duration is available, target time is mapped to scroll
    if (videoRef.current && videoDuration > 0) {
      targetTimeRef.current = progress * (videoDuration - 0.1);
    }
  }, [videoDuration]);

  // Buttery-smooth video scrub loop
  useEffect(() => {
    let active = true;

    const scrubLoop = () => {
      const video = videoRef.current;
      if (video && video.readyState >= 2 && !video.seeking) {
        const diff = targetTimeRef.current - video.currentTime;
        // Smooth lerp when scrubbing
        if (Math.abs(diff) > 0.04) {
          video.currentTime += diff * 0.35;
        }
      }
      if (active) {
        animationFrameRef.current = requestAnimationFrame(scrubLoop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(scrubLoop);

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Listen to window scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Video loaded metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration || 10);
      setIsVideoLoaded(true);
    }
  };

  // Toggle Mute / Sound
  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Smooth scroll helper
  const scrollToNext = () => {
    if (containerRef.current) {
      const nextPos = containerRef.current.offsetTop + containerRef.current.offsetHeight;
      window.scrollTo({ top: nextPos, behavior: 'smooth' });
    }
  };

  // Stage opacities based on scrollProgress (0.0 -> 1.0)
  // Stage 1: Intro Hero (0.0 to 0.35)
  const stage1Opacity = Math.max(0, Math.min(1, (0.35 - scrollProgress) / 0.25));
  const stage1Transform = `translateY(${scrollProgress * -80}px)`;

  // Stage 2: Floating Features (0.35 to 0.75)
  const stage2Opacity = scrollProgress >= 0.28 && scrollProgress <= 0.78
    ? Math.min(
        (scrollProgress - 0.28) / 0.12,
        (0.78 - scrollProgress) / 0.12
      )
    : 0;
  const stage2Scale = 0.95 + Math.min(0.08, scrollProgress * 0.1);

  // Stage 3: Invitation to Menu (0.75 to 1.0)
  const stage3Opacity = Math.max(0, Math.min(1, (scrollProgress - 0.72) / 0.2));
  const stage3Transform = `translateY(${(1 - scrollProgress) * 40}px)`;

  // Video dynamic scale
  const videoScale = 1 + scrollProgress * 0.08;

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
        {/* Background Video Layer */}
        <div 
          className="hero-video-wrapper"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transform: `scale(${videoScale})`,
            transition: 'transform 0.1s ease-out',
            zIndex: 1
          }}
        >
          <video
            ref={videoRef}
            src="/videos/video-erasio.mp4"
            className="hero-scroll-video"
            playsInline
            muted={isMuted}
            autoPlay
            loop
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block'
            }}
          />

          {/* Cinematic Vignette & Gradient Overlays for readable text */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(11,15,23,0.3) 0%, rgba(11,15,23,0.75) 75%, rgba(11,15,23,0.95) 100%)',
              pointerEvents: 'none'
            }} 
          />
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '160px',
              background: 'linear-gradient(to bottom, rgba(9,13,22,0.9) 0%, transparent 100%)',
              pointerEvents: 'none'
            }} 
          />
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '200px',
              background: 'linear-gradient(to top, rgba(9,13,22,1) 0%, rgba(9,13,22,0.6) 50%, transparent 100%)',
              pointerEvents: 'none'
            }} 
          />
        </div>

        {/* ========================================================
            STAGE 1: GRAND HERO INTRO (Scroll: 0% -> 35%)
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
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out'
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
            STAGE 2: CINEMATIC CRAFT REVEAL (Scroll: 35% -> 75%)
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
            transform: `scale(${stage2Scale})`,
            pointerEvents: stage2Opacity > 0.2 ? 'auto' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            transition: 'opacity 0.25s ease-out, transform 0.25s ease-out'
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
            <Sparkles size={16} /> The Art of Live Baking
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
            STAGE 3: CALL TO EXPLORE MENU (Scroll: 75% -> 100%)
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
            transition: 'opacity 0.25s ease-out, transform 0.25s ease-out'
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
            FLOATING CONTROLS & HUD
            ======================================================== */}
        {/* Floating Sound & Play Toggle in Bottom Right */}
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
          {/* Mute / Unmute Button */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
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
            {isMuted ? (
              <>
                <VolumeX size={15} color="#94a3b8" />
                <span>Sound Off</span>
              </>
            ) : (
              <>
                <Volume2 size={15} color="#fb923c" />
                <span style={{ color: '#fb923c' }}>Sound On</span>
              </>
            )}
          </button>

          {/* Continuous Play / Scrub Toggle */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>

        {/* Scroll Indicator Prompt (Visible during Stage 1) */}
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
              Scroll To Experience Live Craft
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

        {/* Cinematic Scroll Progress Bar at very bottom */}
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
              width: `${scrollProgress * 100}%`,
              background: 'linear-gradient(90deg, #ea580c 0%, #f43f5e 50%, #fb923c 100%)',
              boxShadow: '0 0 10px rgba(251, 146, 60, 0.8)',
              transition: 'width 0.05s linear'
            }}
          />
        </div>

      </div>
    </section>
  );
}
