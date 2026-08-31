import './globals.css';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: 'Cake Shopee | Authentic Live Bakery & Pastry Shop in Narsipatnam',
  description: 'Cake Shopee - Freshly baked live cakes, warm puffs, cheesecakes, burgers & shakes. Near Abes centre, beside Himalaya juice center, Narsipatnam Main Road. Open till 10 PM daily.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=Caveat:wght@400;600;700&display=swap"
          rel="stylesheet"
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
