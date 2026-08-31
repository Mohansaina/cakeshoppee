"use client";

import React, { useState } from 'react';
import { FAQS } from '@/data/products';
import { Plus } from 'lucide-react';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggleFAQ = (idx) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="section faq-section" id="faq">
      <div className="container">
        
        <div className="section-header text-center">
          <span className="handwritten">Got questions?</span>
          <br />
          <span className="section-badge">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="section-title">Everything You Need to Know</h2>
          <p className="section-subtitle">
            Quick answers about our baking process, custom theme cakes, delivery coverage, and timings.
          </p>
        </div>

        <div className="faq-container">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className={`faq-item ${isOpen ? 'active' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">+</span>
                </button>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
