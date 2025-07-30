import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategoryById, getProductsByCategory } from '../../data/products';
import './Category.css';

function Category() {
  const { categoryId } = useParams();
  const category = getCategoryById(categoryId);
  const products = getProductsByCategory(categoryId);
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
  }, [categoryId]);

  if (!category) {
    return <div>Category not found</div>;
  }

  // Calculate original price (before discount)
  const calculateOriginalPrice = (discountedPrice) => {
    const discountPercentage = 15;
    const originalPrice = Math.round(discountedPrice / (1 - discountPercentage / 100));
    return originalPrice;
  };

  return (
    <div className="category-page-container">
      <div ref={topRef}></div>
      <div className="category-header">
        <h1 className="category-title">{category.name}</h1>
        <p className="category-description">{category.description}</p>
      </div>
      
      {/* Discount Banner */}
      <div className="discount-banner">
        <div className="discount-banner-content">
          <span className="typing-text">15% OFF ON ALL PRODUCTS</span>
        </div>
      </div>

      <div className="products-grid">
        {products.map(product => {
          const discountedPrice = product.sizes[0].price;
          const originalPrice = calculateOriginalPrice(discountedPrice);
          
          return (
            <motion.div
              key={product.id}
              className="poster-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link to={`/product/${product.id}`}>
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Category; 