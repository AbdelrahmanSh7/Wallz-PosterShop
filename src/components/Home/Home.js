import React, { useEffect, useRef } from 'react';
import { products } from '../../data/products';
import { Link } from 'react-router-dom';
import '../Category/Category.css';

function getRandomProducts(arr, n) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function Home() {
  const randomProducts = getRandomProducts(products, 16);
  const topRef = useRef(null);

  // Scroll to top when component mounts
  useEffect(() => {
    // Try multiple methods to ensure scrolling works
    const scrollToTop = () => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    // Immediate scroll
    scrollToTop();
    
    // Delayed scroll to ensure it works after page load
    setTimeout(scrollToTop, 100);
    setTimeout(scrollToTop, 500);
  }, []);

  // Calculate original price (before discount)
  const calculateOriginalPrice = (discountedPrice) => {
    const discountPercentage = 15;
    let originalPrice = Math.round(discountedPrice / (1 - discountPercentage / 100));
    if (originalPrice === 271) originalPrice = 270;
    if (originalPrice === 329) originalPrice = 330;
    return originalPrice;
  };

  return (
    <div className="category-slider-section">
      <div ref={topRef}></div>
      <h2 className="slider-title" >Featured Posters</h2>
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
                <div className="price-container">
                  <span className="original-price-overlay">{originalPrice} LE</span>
                  <span className="discounted-price-overlay">Start From {discountedPrice} LE</span>
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
