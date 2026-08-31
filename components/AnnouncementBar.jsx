"use client";

import React from 'react';
import { Phone, Clock, Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="container announcement-content">
        <div className="announcement-ticker">
          <span className="ticker-pulse"></span>
          <span>
            <strong>Freshly Baked in Narsipatnam:</strong> Live cake counter ready • Door delivery 10 AM – 5 PM
          </span>
        </div>

        <div className="announcement-links">
          <a href="tel:7660948403">
            <Phone size={13} />
            <span>Order Line: 7660948403</span>
          </a>
          <a href="#custom-cake">
            <Sparkles size={13} />
            <span>Custom Theme Cakes</span>
          </a>
        </div>
      </div>
    </div>
  );
}
