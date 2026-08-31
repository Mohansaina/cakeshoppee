"use client";

import React from 'react';

export default function HeroSection() {
  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#fff5f7',
      background: 'linear-gradient(135deg, #fff5f7 0%, #fce7f3 40%, #fdf2f8 100%)',
      zIndex: 1,
      isolation: 'isolate',
    }}>

      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244,114,182,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-60px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 24px 60px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center',
        width: '100%',
      }}>

        {/* LEFT — Text Content */}
        <div>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(90deg, #e11d48, #9333ea)',
            color: '#fff', borderRadius: '999px',
            padding: '6px 18px', fontSize: '13px', fontWeight: '600',
            marginBottom: '24px', letterSpacing: '0.05em',
            boxShadow: '0 4px 15px rgba(225,29,72,0.3)',
          }}>
            ✨ Narsipatnam&apos;s Premier Live Bakery
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: '700',
            lineHeight: '1.15',
            color: '#1e293b',
            marginBottom: '20px',
          }}>
            Your Dream Cake,<br />
            <span style={{
              background: 'linear-gradient(135deg, #e11d48, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Crafted Live</span><br />
            <span style={{ fontSize: '80%', color: '#475569' }}>For You</span>
          </h1>

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-outfit, system-ui, sans-serif)',
            fontSize: '1.05rem',
            color: '#64748b',
            lineHeight: '1.7',
            marginBottom: '36px',
            maxWidth: '440px',
          }}>
            From elegant 2-tier wedding cakes to custom theme birthday cakes —
            every tier baked fresh at our live decor counter on Complex Road.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <a href="#custom-cake" style={{
              background: 'linear-gradient(135deg, #e11d48, #9333ea)',
              color: '#fff', borderRadius: '999px',
              padding: '14px 32px', fontSize: '15px', fontWeight: '600',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(225,29,72,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'inline-block',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(225,29,72,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(225,29,72,0.35)'; }}
            >
              🎂 Design Your Cake
            </a>
            <a href="tel:7660948403" style={{
              background: '#fff', color: '#e11d48',
              border: '2px solid #e11d48', borderRadius: '999px',
              padding: '13px 28px', fontSize: '15px', fontWeight: '600',
              textDecoration: 'none', transition: 'all 0.2s',
              display: 'inline-block',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff5f7'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
            >
              📞 Call Master Baker
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
            {[
              { num: '5,000+', label: 'Celebrations' },
              { num: '100%', label: 'Pure Eggless' },
              { num: '20 Min', label: 'Express Decor' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem', fontWeight: '800',
                  background: 'linear-gradient(135deg, #e11d48, #9333ea)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  fontFamily: 'var(--font-playfair, Georgia, serif)',
                }}>{s.num}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Fresh Cake Image */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Glow ring behind image */}
          <div style={{
            position: 'absolute',
            width: '88%', height: '88%',
            borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%',
            background: 'linear-gradient(135deg, rgba(225,29,72,0.15), rgba(147,51,234,0.15))',
            filter: 'blur(30px)',
            zIndex: 0,
          }} />





          {/* The actual image — brand new, no cache */}
          <img
            src="/images/bespoke-wedding-cake.jpg"
            alt="Custom 2-Tier Wedding Cake by Cake Shopee Narsipatnam"
            style={{
              width: '100%',
              maxWidth: '480px',
              height: '560px',
              objectFit: 'cover',
              objectPosition: 'center top',
              borderRadius: '40% 60% 55% 45% / 45% 45% 55% 55%',
              boxShadow: '0 30px 80px rgba(225,29,72,0.2), 0 10px 30px rgba(0,0,0,0.1)',
              position: 'relative', zIndex: 1,
              border: '4px solid rgba(255,255,255,0.8)',
            }}
          />
        </div>
      </div>

    </section>
  );
}
