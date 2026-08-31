"use client";

import React from 'react';
import Image from 'next/image';
import { MapPin, Phone, Clock, MessageSquare, Instagram, Facebook } from 'lucide-react';

export default function Footer({ onSelectCategory }) {
  return (
    <footer className="mgn-ftr" id="find-us">

      {/* ── Cake Image Banner ── */}
      <div className="mgn-ftr-banner">
        <div className="mgn-ftr-banner-img">
          <Image
            src="/images/hero-custom-wedding-cake.jpg"
            alt="Custom Wedding Cake by Cake Shopee"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          <div className="mgn-ftr-banner-overlay" />
        </div>
        <div className="mgn-ftr-banner-content">
          <p className="mgn-ftr-banner-eyebrow">Live Decor Counter · Narsipatnam</p>
          <h2 className="mgn-ftr-banner-title">Every Cake Crafted<br />Fresh For You</h2>
          <a href="#custom-cake" className="mgn-ftr-banner-btn">Design Your Cake</a>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="mgn-ftr-body">
        <div className="mgn-ftr-grid">

          {/* Brand column */}
          <div className="mgn-ftr-col mgn-ftr-brand">
            <div className="mgn-ftr-logo">
              <Image
                src="/images/cake-shopee-logo.png"
                alt="Cake Shopee"
                width={52}
                height={52}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div className="mgn-ftr-logo-name">Cake Shopee</div>
                <div className="mgn-ftr-logo-sub">Artisanal Live Bakery</div>
              </div>
            </div>
            <p className="mgn-ftr-about">
              Narsipatnam's favourite destination for live celebration cakes,
              fresh pastries, oven-hot savouries, pizzas, thick shakes & party bundles.
            </p>
            <a
              href="https://wa.me/917660948403"
              target="_blank"
              rel="noopener noreferrer"
              className="mgn-ftr-wa-btn"
            >
              <MessageSquare size={15} /> WhatsApp Us
            </a>
          </div>

          {/* Quick Links */}
          <div className="mgn-ftr-col">
            <h4 className="mgn-ftr-col-title">Explore</h4>
            <ul className="mgn-ftr-links">
              <li><a href="#hero">Home</a></li>
              <li><a href="#bestsellers">Full Menu</a></li>
              <li><a href="#combos">Party Combos</a></li>
              <li><a href="#custom-cake">Custom Cake</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="mgn-ftr-col">
            <h4 className="mgn-ftr-col-title">Categories</h4>
            <ul className="mgn-ftr-links">
              <li><a href="#bestsellers" onClick={() => onSelectCategory?.('cakes')}>Birthday Cakes</a></li>
              <li><a href="#bestsellers" onClick={() => onSelectCategory?.('custom')}>Custom Theme Cakes</a></li>
              <li><a href="#bestsellers" onClick={() => onSelectCategory?.('pastries')}>Pastries & Slices</a></li>
              <li><a href="#bestsellers" onClick={() => onSelectCategory?.('savouries')}>Puffs, Pizzas & Burgers</a></li>
              <li><a href="#bestsellers" onClick={() => onSelectCategory?.('shakes')}>Thick Shakes</a></li>
              <li><a href="#combos">Party Combos</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="mgn-ftr-col">
            <h4 className="mgn-ftr-col-title">Visit Us</h4>
            <div className="mgn-ftr-contact">
              <p>
                <MapPin size={14} />
                Complex Road, opp. Naidu Jewellers,<br />
                Narsipatnam, AP – 531116
              </p>
              <p>
                <Phone size={14} />
                <a href="tel:7660948403">7660948403</a> &nbsp;/&nbsp;
                <a href="tel:8019104562">8019104562</a>
              </p>
              <p>
                <Clock size={14} />
                Open Daily: 10 AM – 10 PM
              </p>
            </div>
            <div className="mgn-ftr-socials">
              <a
                href="https://www.instagram.com/cakeshoppee__narsipatnam/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="mgn-ftr-social-icon"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="mgn-ftr-bottom">
        <p>© {new Date().getFullYear()} Cake Shopee Narsipatnam. Handcrafted for sweet celebrations.</p>
        <p className="mgn-ftr-pay">UPI · GPay · PhonePe · Cash</p>
      </div>

    </footer>
  );
}
