import React from 'react';
import { MapPin, Clock, Truck, Phone, Navigation, CheckCircle2 } from 'lucide-react';

export default function StoreLocator() {
  return (
    <section className="section section-subtle find-us-section" id="find-us">
      <div className="container">
        
        <div className="section-header text-center">
          <span className="handwritten">Visit Our Narsipatnam Boutique</span>
          <br />
          <span className="section-badge">LOCATION & TIMINGS</span>
          <h2 className="section-title">Drop By or Order for Home Delivery</h2>
          <p className="section-subtitle">
            Conveniently located on Narsipatnam Main Road near Abes Centre, beside Himalaya Juice Center. Open 7 days a week till 10 PM.
          </p>
        </div>

        <div className="find-us-grid">
          
          <div className="location-card">
            
            <div className="location-info-block">
              <div className="info-icon">
                <MapPin size={22} color="#c48b3b" />
              </div>
              <div className="info-details">
                <h5>Shop Address & Landmark</h5>
                <p>
                  <strong>Near Abes Centre, Beside Himalaya Juice Center</strong><br />
                  Narsipatnam Main Road, Andhra Pradesh – 531116<br />
                  <span style={{ fontSize: '0.82rem', color: '#c48b3b', fontWeight: 600 }}>
                    📍 Easy Landmark: Beside Himalaya Juice Center, Near Abes Centre
                  </span>
                </p>
              </div>
            </div>

            <div className="location-info-block">
              <div className="info-icon">
                <Clock size={22} color="#c48b3b" />
              </div>
              <div className="info-details">
                <h5>Store Opening Hours</h5>
                <p>
                  <strong>Open Every Day:</strong> 10:00 AM – 10:00 PM<br />
                  <span style={{ color: '#15803d', fontWeight: 600, fontSize: '0.86rem' }}>
                    🟢 Counter & Live Bakery Open Today
                  </span>
                </p>
              </div>
            </div>

            <div className="location-info-block">
              <div className="info-icon">
                <Truck size={22} color="#c48b3b" />
              </div>
              <div className="info-details">
                <h5>Local Doorstep Delivery</h5>
                <p>
                  <strong>10:00 AM – 5:00 PM</strong><br />
                  Fast delivery across Narsipatnam town with careful cake handling.
                </p>
              </div>
            </div>

            <div className="location-info-block">
              <div className="info-icon">
                <Phone size={22} color="#c48b3b" />
              </div>
              <div className="info-details">
                <h5>Call Bakery Directly</h5>
                <div className="phone-links">
                  <a href="tel:7660948403" className="phone-chip">
                    📞 7660948403
                  </a>
                  <a href="tel:8019104562" className="phone-chip">
                    📞 8019104562
                  </a>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Near+Abes+centre,+beside+Himalaya+juice+center,+Narsipatnam+Main+Road,+Andhra+Pradesh+531116"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              <Navigation size={18} /> Get Google Maps Driving Directions
            </a>

          </div>

          <div className="map-card">
            <div className="map-container">
              <iframe 
                title="Cake Shopee Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15217.291771120286!2d82.60741295!3d17.67035515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39e3381a179577%3A0xc4ad44d41eb31a89!2sNarsipatnam%2C%20Andhra%20Pradesh%20531116!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="map-footer-badge">
              <span>📍 Near Abes Centre, Beside Himalaya Juice Center, Narsipatnam Main Road</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
