import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    key: "cakes",
    title: "Signature Fresh Cakes",
    count: "Baked Fresh Daily",
    description: "Black Forest, Chocolate Truffle, Mango Drizzle, Butterscotch & Fruit Cakes",
    image: "/images/image4.jpg"
  },
  {
    key: "custom",
    title: "Customised Live Cakes",
    count: "Decorated Live",
    description: "2-Tier theme cakes, cartoon cakes, baby shower & 1st birthday specials",
    image: "/images/image2.ong"
  },
  {
    key: "pastries",
    title: "Pastries & Slices",
    count: "Single Slices",
    description: "Red velvet slices, cheesecake bars, brownies, rolls & chocolate pasties",
    image: "/images/image5.png"
  },
  {
    key: "savouries",
    title: "Savouries & Evening Snacks",
    count: "Hot From Oven",
    description: "Veg/Chicken Puffs, fresh cheese pizzas, juicy burgers & Chinese snacks",
    image: "/images/image3.jpg"
  },
  {
    key: "shakes",
    title: "Thick Shakes & Coolers",
    count: "Ice Cold",
    description: "Oreo chocolate shakes, cold coffee floats, fruit shakes & chilled drinks",
    image: "/images/image6.jpg"
  },
  {
    key: "party",
    title: "Party Props & Sweets",
    count: "Celebration Kit",
    description: "Birthday candles, party caps, poppers, banners & gift chocolates",
    image: "/images/image7.jpg"
  }
];

export default function CategorySpotlight({ onSelectCategory }) {
  return (
    <section className="section categories-section">
      <div className="container">
        
        <div className="section-header text-center">
          <span className="handwritten">Fresh out of our ovens</span>
          <br />
          <span className="section-badge">EXPLORE CATEGORIES</span>
          <h2 className="section-title">What Are You Craving Today?</h2>
          <p className="section-subtitle">
            Whether you need a celebration cake tonight or hot evening puffs at 4 PM, we have you covered with artisanal goodness.
          </p>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className="category-card"
              onClick={() => onSelectCategory(cat.key)}
            >
              <div className="category-image-wrap">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="category-overlay"></div>
              
              <div className="category-content">
                <span className="cat-count">{cat.count}</span>
                <h3>{cat.title}</h3>
                <p>{cat.description}</p>
                <span className="cat-link">
                  Explore Menu <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
