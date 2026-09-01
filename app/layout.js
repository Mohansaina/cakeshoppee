import './globals.css';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: 'Cake Shopee | Authentic Live Bakery & Pastry Shop in Narsipatnam',
  description: 'Cake Shopee Narsipatnam - 📍 Near Abes centre, beside Himalaya juice center, Main Road. Freshly baked live cakes, warm puffs, cheesecakes, burgers & shakes. Open daily till 10 PM.',
  keywords: ['Cake Shopee', 'Narsipatnam Bakery', 'Live Bakery Narsipatnam', 'Custom Cakes Narsipatnam', 'Birthday Cakes Narsipatnam', 'Eggless Cakes'],
  authors: [{ name: 'Cake Shopee' }],
  metadataBase: new URL('https://cakeshoppee.vercel.app'),
  openGraph: {
    title: 'Cake Shopee Narsipatnam | Live Bakery & Custom Cakes',
    description: '📍 Near Abes centre, beside Himalaya juice center, Narsipatnam Main Road. Fresh live cakes, warm puffs, cheesecakes, burgers & shakes. Open till 10 PM daily.',
    url: 'https://cakeshoppee.vercel.app',
    siteName: 'Cake Shopee Narsipatnam',
    images: [
      {
        url: 'https://cakeshoppee.vercel.app/images/og-share-card.png',
        width: 512,
        height: 512,
        alt: 'Cake Shopee Narsipatnam Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cake Shopee Narsipatnam',
    description: '📍 Narsipatnam Main Road. Freshly baked live cakes, warm puffs & custom celebration cakes in Narsipatnam.',
    images: ['https://cakeshoppee.vercel.app/images/og-share-card.png'],
  },
  icons: {
    icon: '/favicon.png?v=4',
    shortcut: '/favicon.ico?v=4',
    apple: '/apple-touch-icon.png?v=4',
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
        <link rel="icon" href="/favicon.png?v=4" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico?v=4" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=4" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Cake Shopee Narsipatnam" />
        <meta property="og:title" content="Cake Shopee Narsipatnam | Live Bakery & Custom Cakes" />
        <meta property="og:description" content="📍 Narsipatnam Main Road (Near Abes centre, beside Himalaya juice center). Fresh live cakes, warm puffs, cheesecakes, burgers & shakes. Open daily till 10 PM." />
        <meta property="og:image" content="https://cakeshoppee.vercel.app/images/og-share-card.png" />
        <meta property="og:image:secure_url" content="https://cakeshoppee.vercel.app/images/og-share-card.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:url" content="https://cakeshoppee.vercel.app" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=Caveat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'en,te',
                  autoDisplay: false
                }, 'google_translate_element');
              }

              function toggleTeluguLanguage() {
                var currentLang = localStorage.getItem('preferredLanguage') || 'en';
                var nextLang = currentLang === 'te' ? 'en' : 'te';
                setLanguage(nextLang);
              }

              function setLanguage(lang) {
                var select = document.querySelector('.goog-te-combo');
                if (select) {
                  select.value = lang;
                  select.dispatchEvent(new Event('change'));
                  localStorage.setItem('preferredLanguage', lang);
                  updateLangBtnUI(lang);
                } else {
                  setTimeout(function() { setLanguage(lang); }, 300);
                }
              }

              function updateLangBtnUI(lang) {
                var labels = document.querySelectorAll('.lang-label');
                labels.forEach(function(lbl) {
                  lbl.innerText = lang === 'te' ? 'English' : 'తెలుగు';
                });
              }

              document.addEventListener('DOMContentLoaded', function() {
                var savedLang = localStorage.getItem('preferredLanguage');
                if (savedLang === 'te') {
                  setTimeout(function() { setLanguage('te'); }, 1000);
                }
              });
            `
          }}
        />
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
      </head>
      <body>
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
