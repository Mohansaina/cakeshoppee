"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [statusText, setStatusText] = useState("Freshly baking your experience...");

  useEffect(() => {
    // Lock body scroll while preloader is active
    document.body.style.overflow = "hidden";

    const messages = [
      { at: 15, text: "Heating the ovens..." },
      { at: 45, text: "Whipping sweet cream & fresh strawberries..." },
      { at: 75, text: "Live cakes crafted in 20 minutes..." },
      { at: 92, text: "Welcome to Cake Shoppee Narsipatnam!" }
    ];

    // Safety fallback: ensure preloader is dismissed after 2.5s maximum under all conditions
    const safetyTimer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsRemoved(true);
        document.body.style.overflow = "";
        if (onComplete) onComplete();
      }, 400);
    }, 2500);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        
        // Update contextual message based on progress
        const matchingMsg = [...messages].reverse().find(m => next >= m.at);
        if (matchingMsg) {
          setStatusText(matchingMsg.text);
        }

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              setIsRemoved(true);
              document.body.style.overflow = "";
              if (onComplete) onComplete();
            }, 600); // match fade transition
          }, 250);
          return 100;
        }
        return next;
      });
    }, 45);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimer);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsRemoved(true);
      document.body.style.overflow = "";
      if (onComplete) onComplete();
    }, 400);
  };

  if (isRemoved) return null;

  return (
    <div 
      className={`cs-preloader-overlay ${isFadingOut ? "is-fading-out" : ""}`}
      aria-label="Loading Cake Shoppee..."
    >
      {/* Background ambient lighting bubbles */}
      <div className="cs-preloader-glow-1"></div>
      <div className="cs-preloader-glow-2"></div>

      <div className="cs-preloader-card">
        {/* Animated Brand Logo Container */}
        <div className="cs-preloader-logo-wrap">
          <div className="cs-preloader-ripple-ring"></div>
          <div className="cs-preloader-ripple-ring cs-ripple-delayed"></div>
          
          <div className="cs-preloader-logo-circle">
            <Image
              src="/images/cake-shopee-logo.png"
              alt="Cake Shoppee"
              width={100}
              height={100}
              priority
              className="cs-preloader-img"
            />
          </div>

          <div className="cs-preloader-sparkle-badge">
            <Sparkles size={16} />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="cs-preloader-brand">
          <h1 className="cs-preloader-title">Cake Shoppee</h1>
          <p className="cs-preloader-subtitle">AUTHENTIC LIVE BAKERY &bull; NARSIPATNAM</p>
        </div>

        {/* Dynamic Status Text */}
        <div className="cs-preloader-status">
          <span className="cs-preloader-status-text">{statusText}</span>
        </div>

        {/* Progress Bar */}
        <div className="cs-preloader-bar-track">
          <div 
            className="cs-preloader-bar-fill" 
            style={{ width: `${progress}%` }}
          >
            <div className="cs-preloader-bar-sheen"></div>
          </div>
        </div>

        {/* Percentage & Quick Skip */}
        <div className="cs-preloader-meta">
          <span className="cs-preloader-percent">{progress}%</span>
          <button 
            type="button" 
            onClick={handleSkip} 
            className="cs-preloader-skip-btn"
          >
            Skip &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
