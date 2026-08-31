"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { GALLERY_PHOTOS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Sparkles, Eye } from 'lucide-react';

export default function StoreGallery() {
  const { setActiveLightboxPhoto, setLightboxPhoto } = useCart();
  const openPhoto = setActiveLightboxPhoto || setLightboxPhoto;
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Signature Cakes', 'Custom Cakes', 'Live Bakery', 'Storefront'];

  const filteredPhotos = GALLERY_PHOTOS.filter((photo) => {
    if (activeFilter === 'All') return true;
    return photo.category === activeFilter;
  });

  return (
    <section className="section gallery-section" id="gallery">
      <div className="container">
        
        <div className="section-header text-center">
          <span className="handwritten">Behind the counter</span>
          <br />
          <span className="section-badge">STORE & CREATIONS GALLERY</span>
          <h2 className="section-title">A Glimpse Into Cake Shopee</h2>
          <p className="section-subtitle">
            Take a look at our live creation counter, daily fresh display counters, and boutique storefront in Narsipatnam.
          </p>
        </div>

        <div className="gallery-filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="gallery-item"
              onClick={() => openPhoto && openPhoto(photo)}
            >
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
              <div className="gallery-item-overlay">
                <h5>{photo.title}</h5>
                <span>{photo.subtitle || photo.category}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
