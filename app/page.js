"use client";

import React, { useState } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import EditorialCakesGrid from '@/components/EditorialCakesGrid';
import OurMenuSection from '@/components/OurMenuSection';
import CelebrationCombos from '@/components/CelebrationCombos';
import OccasionTreatsSection from '@/components/OccasionTreatsSection';
import CustomCakeBuilder from '@/components/CustomCakeBuilder';
import StoreGallery from '@/components/StoreGallery';
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
      {/* 1. Top Announcement Ticker */}
      <AnnouncementBar />

      {/* 2. Sticky Header with logo + nav */}
      <Header onSelectCategory={handleSelectCategory} onSearch={setSearchQuery} />

      {/* 3. Hero Section — wedding cake image */}
      <HeroSection />

      {/* 4. Bespoke Cakes Gallery Strip — editorial 4-up grid */}
      <EditorialCakesGrid />

      {/* 5. Our Menu — Category tiles + filterable product grid */}
      <OurMenuSection onSelectCategory={handleSelectCategory} />

      {/* 6. Celebration Combos — party packages */}
      <CelebrationCombos />

      {/* 7. Treats for Any Occasion — 4-card occasion section */}
      <OccasionTreatsSection
        onSelectCategory={handleSelectCategory}
        onSearch={setSearchQuery}
      />

      {/* 8. Custom Cake Builder — quote form + WhatsApp */}
      <CustomCakeBuilder />

      {/* 9. Store & Bakery Creations Gallery */}
      <StoreGallery />

      {/* 10. Customer Testimonials */}
      <Testimonials />

      {/* 11. FAQ Accordion */}
      <FAQSection />

      {/* 12. Store Locator — map + contact info */}
      <StoreLocator />

      {/* 13. Footer */}
      <Footer onSelectCategory={handleSelectCategory} />

      {/* 14. Floating Action Dock — WhatsApp + Cart FAB */}
      <FloatingActionDock />

      {/* Drawers & Modals */}
      <CartDrawer />
      <QuickViewModal />
      <GalleryLightbox />
    </main>
  );
}
