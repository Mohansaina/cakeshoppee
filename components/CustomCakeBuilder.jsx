"use client";

import React, { useState } from 'react';
import { Send, MessageSquare, Clock, ShieldCheck, Truck } from 'lucide-react';

export default function CustomCakeBuilder() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    occasion: 'Birthday',
    flavor: 'Chocolate Truffle',
    weight: '1 kg (Serves 8-12)',
    tier: 'Single Tier Standard',
    dietary: '100% Eggless',
    date: '',
    message: '',
    instructions: ''
  });

  const getEstimatedPrice = () => {
    let base = 500;
    if (formData.flavor === 'Chocolate Truffle') base = 550;
    if (formData.flavor === 'Red Velvet Cream Cheese') base = 650;
    if (formData.flavor === 'Butterscotch Crunch') base = 500;
    if (formData.flavor === 'Mango / Strawberry Drizzle') base = 520;
    if (formData.flavor === 'Black Forest') base = 490;

    let multiplier = 1;
    if (formData.weight.startsWith('1 kg')) multiplier = 2;
    if (formData.weight.startsWith('1.5 kg')) multiplier = 3;
    if (formData.weight.startsWith('2 kg')) multiplier = 4;
    if (formData.weight.startsWith('3+ kg')) multiplier = 6;

    let tierExtra = formData.tier.includes('2-Tier') ? 300 : formData.tier.includes('3-Tier') ? 600 : 0;
    return base * multiplier * 0.95 + tierExtra;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let payload = `*CUSTOM LIVE CAKE REQUEST - CAKE SHOPEE*\n`;
    payload += `------------------------------------\n`;
    payload += `Customer Name: ${formData.name}\n`;
    payload += `Phone: ${formData.phone}\n`;
    payload += `Occasion: ${formData.occasion}\n`;
    payload += `Flavor: ${formData.flavor}\n`;
    payload += `Weight: ${formData.weight}\n`;
    payload += `Structure: ${formData.tier}\n`;
    payload += `Diet: ${formData.dietary}\n`;
    payload += `Event Date: ${formData.date}\n`;
    if (formData.message) payload += `Text on Cake: "${formData.message}"\n`;
    if (formData.instructions) payload += `Design/Theme Notes: ${formData.instructions}\n`;
    payload += `Est. Price Range: ~₹${Math.round(getEstimatedPrice())}\n`;
    payload += `------------------------------------\n`;
    payload += `Please confirm slot availability and design details.`;

    const encoded = encodeURIComponent(payload);
    window.open(`https://wa.me/917660948403?text=${encoded}`, '_blank');
  };

  return (
    <section className="custom-cake-section" id="custom-cake">
      <div className="container">
        <div className="custom-cake-wrapper">
          
          <div className="custom-cake-info">
            <h2 className="custom-cake-title">Have a Specific Theme or Photo in Mind?</h2>
            <p>
              At Cake Shopee, we specialize in bespoke <strong>Custom Live Cakes</strong>. From 2-tier cartoon castles and baby shower cakes to elegant golden anniversary tiers, our master baker crafts your cake fresh for the big moment!
            </p>
            
            <ul className="custom-features-list">
              <li>
                <div className="feature-icon-box">
                  <Clock size={18} />
                </div>
                <div>
                  <strong>Live Frosting Counter</strong>
                  <p>Watch your custom cake frosted and piped live right at our Narsipatnam shop counter.</p>
                </div>
              </li>
              <li>
                <div className="feature-icon-box">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong>100% Pure Eggless Guaranteed</strong>
                  <p>Made with high-grade dairy whipping cream, pure Belgian cocoa, and fresh fruits.</p>
                </div>
              </li>
              <li>
                <div className="feature-icon-box">
                  <Truck size={18} />
                </div>
                <div>
                  <strong>Safe Town Delivery</strong>
                  <p>Delivered carefully across Narsipatnam right to your doorstep or venue.</p>
                </div>
              </li>
            </ul>

            <div className="custom-contact-quick" style={{ marginTop: '10px' }}>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', marginBottom: '8px' }}>
                Need consultation or want to share a reference photo?
              </p>
              <a
                href="https://wa.me/917660948403?text=Hi%20Cake%20Shopee,%20I%20have%20a%20reference%20photo%20for%20a%20custom%20theme%20cake!"
                className="btn-whatsapp"
                style={{ padding: '12px 24px', fontSize: '0.92rem' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare size={18} /> Chat with Master Baker on WhatsApp
              </a>
            </div>
          </div>

          <div className="custom-cake-card">
            <h3 className="form-card-title">Custom Cake Quote Builder</h3>
            <p className="form-card-subtitle">Fill in your celebration details for an instant WhatsApp estimate.</p>
            
            <form onSubmit={handleSubmit} className="custom-cake-form">
              
              <div className="form-group">
                <label htmlFor="name">Your Full Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Varma"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    required
                    pattern="[0-9]{10}"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="occasion">Occasion</label>
                  <select id="occasion" value={formData.occasion} onChange={handleChange}>
                    <option value="Birthday">Birthday Celebration</option>
                    <option value="1st Birthday Theme">1st Birthday / Baby Shower</option>
                    <option value="Anniversary">Romantic Anniversary</option>
                    <option value="Wedding / Engagement">Wedding / Engagement</option>
                    <option value="Custom Party">Custom Party</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="flavor">Preferred Flavor *</label>
                  <select id="flavor" value={formData.flavor} onChange={handleChange} required>
                    <option value="Chocolate Truffle">Belgian Chocolate Truffle</option>
                    <option value="Black Forest">Classic Black Forest</option>
                    <option value="Pineapple Delight">Fresh Pineapple Delight</option>
                    <option value="Red Velvet Cream Cheese">Red Velvet Cream Cheese</option>
                    <option value="Butterscotch Crunch">Butterscotch Crunch</option>
                    <option value="Mango / Strawberry Drizzle">Exotic Mango / Strawberry</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="weight">Weight / Portions *</label>
                  <select id="weight" value={formData.weight} onChange={handleChange} required>
                    <option value="0.5 kg (Serves 4-6)">0.5 kg (Serves 4-6)</option>
                    <option value="1 kg (Serves 8-12)">1 kg (Serves 8-12)</option>
                    <option value="1.5 kg (Serves 12-16)">1.5 kg (Serves 12-16)</option>
                    <option value="2 kg (Serves 18-24)">2 kg (Serves 18-24)</option>
                    <option value="3+ kg Grand Event Cake">3+ kg Grand Event Cake</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tier">Structure / Tiers</label>
                  <select id="tier" value={formData.tier} onChange={handleChange}>
                    <option value="Single Tier Standard">Single Tier (Round/Square)</option>
                    <option value="2-Tier Celebration Cake">2-Tier Theme Cake</option>
                    <option value="3-Tier Grand Party Cake">3-Tier Grand Party Cake</option>
                    <option value="Heart Shape Special">Heart Shape Special</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date">Delivery / Pickup Date *</label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message Written on Cake</label>
                <input
                  type="text"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="e.g. Happy 1st Birthday Prince Arjun!"
                />
              </div>

              <div className="form-group">
                <label htmlFor="instructions">Theme Description / Color Palette</label>
                <textarea
                  id="instructions"
                  rows={2}
                  value={formData.instructions}
                  onChange={handleChange}
                  placeholder="Describe your theme, cartoon characters, or color preferences..."
                ></textarea>
              </div>

              <div className="price-estimate-box">
                <span className="estimate-label">Estimated Price Range:</span>
                <span className="estimate-val">Approx. ₹{Math.round(getEstimatedPrice())}</span>
              </div>

              <button type="submit" className="btn-primary btn-block btn-lg" style={{ marginTop: '10px' }}>
                <Send size={18} style={{ display: 'inline', marginRight: '6px' }} /> Send Custom Cake Request via WhatsApp
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
