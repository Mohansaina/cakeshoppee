import './globals.css';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: 'Cake Shopee | Authentic Live Bakery & Pastry Shop in Narsipatnam',
  description: 'Cake Shopee - Freshly baked live cakes, warm puffs, cheesecakes, burgers & shakes. Near Abes centre, beside Himalaya juice center, Narsipatnam Main Road. Open till 10 PM daily.',
  keywords: ['Cake Shopee', 'Narsipatnam Bakery', 'Live Bakery Narsipatnam', 'Custom Cakes Narsipatnam', 'Birthday Cakes Narsipatnam', 'Eggless Cakes'],
  authors: [{ name: 'Cake Shopee' }],
  metadataBase: new URL('https://cakeshoppee.vercel.app'),
  openGraph: {
    title: 'Cake Shopee | Live Bakery & Pastry Shop in Narsipatnam',
    description: 'Freshly baked live cakes, warm puffs, cheesecakes, burgers & shakes. Near Abes centre, beside Himalaya juice center, Narsipatnam Main Road.',
    url: 'https://cakeshoppee.vercel.app',
    siteName: 'Cake Shopee Narsipatnam',
    images: [
      {
        url: '/images/hero-custom-wedding-cake.jpg',
        width: 1200,
        height: 630,
        alt: 'Cake Shopee Narsipatnam',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cake Shopee Narsipatnam',
    description: 'Freshly baked live cakes, warm puffs & custom celebration cakes in Narsipatnam.',
    images: ['/images/hero-custom-wedding-cake.jpg'],
  },
  icons: {
    icon: '/favicon.png?v=3',
    shortcut: '/favicon.ico?v=3',
    apple: '/apple-touch-icon.png?v=3',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  'name': 'Cake Shopee',
  'image': 'https://cakeshoppee.vercel.app/images/logo.png',
  'telephone': '+917660948403',
  'url': 'https://cakeshoppee.vercel.app',
  'priceRange': '₹',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'Near Abes centre, beside Himalaya juice center, Narsipatnam Main Road',
    'addressLocality': 'Narsipatnam',
    'addressRegion': 'Andhra Pradesh',
    'postalCode': '531116',
    'addressCountry': 'IN'
  },
  'openingHoursSpecification': {
    '@type': 'OpeningHoursSpecification',
    'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    'opens': '10:00',
    'closes': '22:00'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png?v=3" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico?v=3" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=3" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=Caveat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
