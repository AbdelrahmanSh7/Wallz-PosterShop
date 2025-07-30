import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products, getRandomProducts } from '../../data/products';
import '../CategorySlider/CategorySlider.css';

function Home() {
  const randomProducts = getRandomProducts(products, 16);
  const topRef = useRef(null);

  // Scroll to top when component mounts
  useEffect(() => {
    const scrollToTop = () => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    scrollToTop();
    setTimeout(scrollToTop, 100);
    setTimeout(scrollToTop, 500);
  }, []);

  // Calculate original price (before discount)
  const calculateOriginalPrice = (discountedPrice) => {
    const discountPercentage = 15;
    const originalPrice = Math.round(discountedPrice / (1 - discountPercentage / 100));
    return originalPrice;
  };

  return (
    <div className="category-slider-section" style={{ paddingTop: '50px' }}>
      <div ref={topRef}></div>
      
      {/* Discount Banner */}
      <div className="discount-banner" style={{
        background: 'linear-gradient(135deg, #2c2c2c, #4a4a4a)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: 0,
        padding: '8px 20px',
        boxShadow: '0 2px 10px rgba(44, 44, 44, 0.3)',
        border: 'none',
        borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div className="discount-banner-content" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px',
          color: 'white',
          fontWeight: '700',
          fontSize: '1.1em',
          textAlign: 'center'
        }}>
          <span className="typing-text" style={{
            fontWeight: '800',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            animation: 'typing 4s ease-in-out infinite',
            display: 'inline-block',
            position: 'relative'
          }}>15% OFF ON ALL PRODUCTS</span>
        </div>
      </div>

      <div className="posters-grid">
        {randomProducts.map(product => {
          const discountedPrice = product.sizes[0].price;
          const originalPrice = calculateOriginalPrice(discountedPrice);
          
          return (
            <Link to={`/product/${product.id}`} className="poster-card" key={product.id}>
              <div className="poster-image-container">
                <img src={product.image} alt={product.name} className="poster-image" />
              </div>
              <div className="poster-info">
                <h3 className="poster-name creative-font">{product.name}</h3>
                <div className="price-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                  <span className="original-price-overlay" style={{ 
                    color: '#999',
                    fontSize: '0.9em',
                    textDecoration: 'line-through',
                    fontWeight: '500'
                  }}>{originalPrice} LE</span>
                  <span className="discounted-price-overlay" style={{ 
                    color: '#e1306c',
                    fontSize: '1.15em',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #e1306c, #ff6b6b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>Start From {discountedPrice} LE</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
