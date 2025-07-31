import React, { useEffect, useState } from "react";
import "./Landing.css";

/**
 * Landing page — vibrant hero, CTA, category cards, bestsellers carousel, trust signals
 */
// PUBLIC_INTERFACE
function Landing() {
  // Category showcase (mock data)
  const categories = [
    { name: "STEM Toys", icon: "🧪", color: "#ff6f61" },
    { name: "Creative Kits", icon: "🎨", color: "#fadb4e" },
    { name: "Board Games", icon: "🎲", color: "#43b5a0" },
    { name: "Puzzles", icon: "🧩", color: "#ff6f61" },
    { name: "Outdoor Fun", icon: "🏃‍♂️", color: "#fadb4e" },
    { name: "Books", icon: "📚", color: "#43b5a0" },
  ];

  // Bestsellers carousel (mocked, can wire to backend later)
  const [bestsellers, setBestsellers] = useState([
    {
      id: "1",
      name: "Build & Learn Robot",
      image: "https://cdn.pixabay.com/photo/2016/11/21/13/54/robot-1846077_1280.jpg", // Free-to-use placeholder
      price: 34.99,
    },
    {
      id: "2",
      name: "Rainbow Art Kit",
      image: "https://cdn.pixabay.com/photo/2014/12/21/23/50/art-579144_1280.png",
      price: 24.5,
    },
    {
      id: "3",
      name: "Junior Detective Game",
      image: "https://cdn.pixabay.com/photo/2017/02/01/10/01/magnifying-glass-2029025_1280.png",
      price: 18.0,
    },
    {
      id: "4",
      name: "Outdoor Explorer Set",
      image: "https://cdn.pixabay.com/photo/2013/07/13/12/46/binoculars-146430_1280.png",
      price: 21.75,
    },
  ]);
  const [carouselIdx, setCarouselIdx] = useState(0);

  // Carousel auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIdx((idx) => (idx + 1) % bestsellers.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [bestsellers.length]);

  // Brand colors
  const c = {
    primary: "#ff6f61",
    secondary: "#43b5a0",
    accent: "#fadb4e",
  };

  // CTA scrolls to categories
  const handleShopNow = () => {
    const el = document.getElementById("category-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-root" style={{ background: "#fff", minHeight: "100vh", width: "100%" }}>
      {/* Hero Section */}
      <section className="hero-section" style={{ background: `linear-gradient(115deg, ${c.primary} 62%, ${c.accent} 100%)`, color: "#fff" }}>
        <div className="hero-content">
          <h1>
            Welcome to <span className="brand-accent">PlayPals</span>!
          </h1>
          <p className="hero-tagline">
            Discover toys, craft kits, and games that spark joy and creativity! <span role="img" aria-label="party">🎉</span>
          </p>
          <button
            className="cta-btn"
            style={{ background: c.secondary, color: "#fff" }}
            onClick={handleShopNow}
          >
            Shop Now
          </button>
        </div>
        <div className="hero-graphic" aria-hidden>
          <span className="hero-bubble" style={{ background: c.accent, left: 30, top: 30 }} />
          <span className="hero-bubble" style={{ background: c.secondary, right: 80, top: 50 }} />
          <span className="hero-bubble" style={{ background: c.primary, left: 80, bottom: 30 }} />
          <span className="hero-bubble" style={{ background: c.accent, right: 30, bottom: 40 }} />
        </div>
      </section>

      {/* Category Showcase */}
      <section id="category-section" className="category-section">
        <h2 className="section-heading" style={{ color: c.primary }}>Shop by Category</h2>
        <div className="category-card-row">
          {categories.map((cat) => (
            <div className="category-card" key={cat.name} style={{ background: cat.color }}>
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bestseller Carousel */}
      <section className="bestseller-section">
        <h2 className="section-heading" style={{ color: c.secondary }}>
          Bestsellers
        </h2>
        <div className="carousel-container">
          <button
            className="carousel-btn"
            aria-label="Previous"
            onClick={() => setCarouselIdx((i) => (i - 1 + bestsellers.length) % bestsellers.length)}
          >
            ◀
          </button>
          <div className="bestseller-card" key={bestsellers[carouselIdx].id}>
            <img
              className="bestseller-img"
              src={bestsellers[carouselIdx].image}
              alt={bestsellers[carouselIdx].name}
              loading="lazy"
              style={{ background: "#eee" }}
            />
            <div className="bestseller-info">
              <h3>{bestsellers[carouselIdx].name}</h3>
              <span className="bestseller-price">${bestsellers[carouselIdx].price.toFixed(2)}</span>
            </div>
          </div>
          <button
            className="carousel-btn"
            aria-label="Next"
            onClick={() => setCarouselIdx((i) => (i + 1) % bestsellers.length)}
          >
            ▶
          </button>
        </div>
        <div className="carousel-indicators">
          {bestsellers.map((b, idx) => (
            <span
              key={b.id}
              className={carouselIdx === idx ? "indicator active" : "indicator"}
              style={{
                background: carouselIdx === idx ? c.primary : "#ddd",
              }}
              onClick={() => setCarouselIdx(idx)}
            />
          ))}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="trust-section">
        <h2 className="section-heading" style={{ color: c.accent, fontSize: 22 }}>Trusted by Parents</h2>
        <div className="trust-row">
          <div className="trust-card">
            <span className="trust-icon" role="img" aria-label="star">⭐</span>
            <span className="trust-title">Rated 4.9/5</span>
            <span className="trust-desc">by 2,000+ happy families</span>
          </div>
          <div className="trust-card">
            <span className="trust-icon" role="img" aria-label="shield">🛡️</span>
            <span className="trust-title">Safe & Child-Friendly</span>
            <span className="trust-desc">Carefully vetted products</span>
          </div>
          <div className="trust-card">
            <span className="trust-icon" role="img" aria-label="world">🌍</span>
            <span className="trust-title">Fast Shipping</span>
            <span className="trust-desc">All UAE | 1-2 day delivery</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
