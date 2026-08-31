"use client";

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function GalleryLightbox() {
  const { activeLightboxPhoto, setActiveLightboxPhoto } = useCart();

  if (!activeLightboxPhoto) return null;

  return (
    <div
      className="lightbox-backdrop active"
      onClick={() => setActiveLightboxPhoto(null)}
    >
      <button
        className="lightbox-close"
        onClick={() => setActiveLightboxPhoto(null)}
      >
        <X size={28} />
      </button>

      <div
        className="lightbox-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: 'relative', width: '80vw', height: '70vh', maxWidth: 900 }}>
          <Image
            src={activeLightboxPhoto.src}
            alt={activeLightboxPhoto.title}
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <h4 style={{ marginTop: '12px' }}>{activeLightboxPhoto.title}</h4>
      </div>
    </div>
  );
}
