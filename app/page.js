"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import EditorialCakesGrid from '@/components/EditorialCakesGrid';
import OurMenuSection from '@/components/OurMenuSection';
import BestsellerProductsRow from '@/components/BestsellerProductsRow';
import OccasionTreatsSection from '@/components/OccasionTreatsSection';
import CustomCakeBuilder from '@/components/CustomCakeBuilder';
import Testimonials from '@/components/Testimonials';
import FAQSection from '@/components/FAQSection';
import StoreLocator from '@/components/StoreLocator';
import Footer from '@/components/Footer';
import FloatingActionDock from '@/components/FloatingActionDock';
import CartDrawer from '@/components/CartDrawer';
import QuickViewModal from '@/components/QuickViewModal';
import GalleryLightbox from '@/components/GalleryLightbox';

export default function HomePage() {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectCategory = (catKey) => {
    setSelectedCat(catKey);
  };

  return (
    <main>
      {/* 2. Sticky Header with logo + nav */}
      <Header onSelectCategory={handleSelectCategory} onSearch={setSearchQuery} />

      {/* 3. Hero Section — wedding cake image */}
      <HeroSection />

      {/* 4. Bespoke Cakes Gallery Strip — editorial 4-up grid */}
      <EditorialCakesGrid />

      {/* 5 + 6. Our Menu — Category tiles + filterable product grid (combined) */}
      <OurMenuSection onSelectCategory={handleSelectCategory} />

      {/* 8. Treats for Any Occasion — 4-card occasion section */}
      <OccasionTreatsSection
        onSelectCategory={handleSelectCategory}
        onSearch={setSearchQuery}
      />

      {/* 10. Custom Cake Builder — quote form + WhatsApp */}
      <CustomCakeBuilder />

      {/* 12. Customer Testimonials */}
      <Testimonials />

      {/* 13. FAQ Accordion */}
      <FAQSection />

      {/* 14. Store Locator — map + contact info */}
      <StoreLocator />

      {/* 15. Footer */}
      <Footer onSelectCategory={handleSelectCategory} />

      {/* 16. Floating Action Dock — WhatsApp + Cart FAB */}
      <FloatingActionDock />

      {/* Drawers & Modals */}
      <CartDrawer />
      <QuickViewModal />
      <GalleryLightbox />
    </main>
  );
}
