import React from 'react';

export default function ValueBar() {
  const PILLARS = [
    {
      icon: "✨",
      title: "Live Counter Decorating",
      desc: "Watch your fresh cream cake piped and decorated live right before your eyes in Narsipatnam."
    },
    {
      icon: "🌱",
      title: "100% Pure Eggless Options",
      desc: "Supreme softness and rich flavors with certified vegetarian preparation and hygiene."
    },
    {
      icon: "🚚",
      title: "Express Town Delivery",
      desc: "Careful doorstep delivery across Narsipatnam daily between 10:00 AM and 5:00 PM."
    },
    {
      icon: "🎉",
      title: "All-in-One Party Hub",
      desc: "From theme cakes to hot puffs, pizzas, burgers, candles, and party props under one roof."
    }
  ];

  return (
    <section className="value-bar">
      <div className="container">
        <div className="value-grid">
          {PILLARS.map((pillar, idx) => (
            <div key={idx} className="value-card">
              <div className="value-icon-box">{pillar.icon}</div>
              <div className="value-info">
                <h4>{pillar.title}</h4>
                <p>{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
