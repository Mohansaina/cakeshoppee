import React from 'react';
import { TESTIMONIALS } from '@/data/products';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="section testimonials-section" id="reviews">
      <div className="container">
        
        <div className="section-header text-center">
          <span className="handwritten">Loved by Narsipatnam</span>
          <br />
          <span className="section-badge">CUSTOMER REVIEWS</span>
          <h2 className="section-title">Sweet Words From Happy Celebrations</h2>
          <p className="section-subtitle">
            Real experiences from families, birthday planners, and foodies in Narsipatnam.
          </p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((review) => (
            <div key={review.id} className="testimonial-card">
              
              <div className="testimonial-stars">
                {"★".repeat(review.rating)}
              </div>

              <p className="testimonial-text">
                "{review.review}"
              </p>

              <div className="testimonial-user">
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="user-name">{review.name}</span>
                  <CheckCircle2 size={14} color="#15803d" />
                </div>
                <span className="user-occasion">{review.occasion}</span>
                <span className="user-location">{review.location}</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
