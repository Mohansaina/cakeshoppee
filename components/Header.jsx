"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, User, ChevronDown } from 'lucide-react';

const NAV = [
  { label: 'Order',          tab: 'order',    catKey: 'shop',    drop: true  },
  { label: 'Products',       tab: 'products', catKey: 'cakes',   drop: true  },
  { label: 'Hours & Location', tab: 'hours', catKey: 'contact', drop: true  },
  { label: 'About Us',       tab: 'about',    catKey: 'about',   drop: true  },
];

export default function Header({ onSelectCategory, onSearch }) {
  const [active, setActive] = useState('');

  const go = (tab, catKey) => {
    setActive(tab);
    const scrollMap = {
      custom:  'custom-cake',
      combos:  'combos',
      about:   'store-gallery',
      contact: 'find-us',
      shop:    'bestsellers',
    };
    const elId = scrollMap[catKey];
    if (elId) {
      document.getElementById(elId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (onSelectCategory) onSelectCategory(catKey);
      document.getElementById('bestsellers')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="mgn-hdr">
      <div className="mgn-hdr-inner">

        {/* ── Logo ── */}
        <Link href="/" className="mgn-hdr-logo" onClick={() => setActive('')}>
          <Image
            src="/images/logo.png"
            alt="Cake Shopee Logo"
            width={44}
            height={44}
            priority
            style={{ objectFit: 'contain' }}
          />
          <div className="mgn-hdr-logo-text">
            <span className="mgn-hdr-logo-name">Cake Shopee</span>
            <span className="mgn-hdr-logo-est">est. 2018 · Narsipatnam</span>
          </div>
        </Link>

        {/* ── Nav ── */}
        <nav className="mgn-hdr-nav" aria-label="Main Navigation">
          {NAV.map((n) => (
            <button
              key={n.tab}
              type="button"
              className={`mgn-hdr-navlink ${active === n.tab ? 'is-active' : ''}`}
              onClick={() => go(n.tab, n.catKey)}
            >
              {n.label}
              {n.drop && <ChevronDown size={12} className="mgn-hdr-chevron" />}
            </button>
          ))}
        </nav>

        {/* ── Right Actions ── */}
        <div className="mgn-hdr-right">
          {/* Pink pill CTA — matches Magnolia "ORDER ASAP" */}
          <a href="tel:7660948403" className="mgn-hdr-cta">Order Now</a>

          <button className="mgn-hdr-icon" aria-label="Search">
            <Search size={18} />
          </button>
          <button className="mgn-hdr-icon" aria-label="Account">
            <User size={18} />
          </button>
          <button className="mgn-hdr-icon" aria-label="Cart">
            <ShoppingBag size={18} />
          </button>
        </div>

      </div>
    </header>
  );
}
