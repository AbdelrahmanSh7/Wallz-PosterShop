import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory, getCategoryById } from '../../data/products';
import './Category.css';
import { motion } from 'framer-motion';

function Category() {
  const { categoryId } = useParams();
  const category = getCategoryById(categoryId);
  const products = getProductsByCategory(categoryId);
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
  }, [categoryId]);

  if (!category) {
    return <div className="category-not-found">Category not found</div>;
  }

  // Calculate original price (before discount)
  const calculateOriginalPrice = (discountedPrice) => {
    const discountPercentage = 15;
    let originalPrice = Math.round(discountedPrice / (1 - discountPercentage / 100));
    if (originalPrice === 271) originalPrice = 270;
    if (originalPrice === 329) originalPrice = 330;
    return originalPrice;
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: "spring" } }
  };

  return (
    <div className="category-page-container">
      <div ref={topRef}></div>
      <div className="category-header">
        <h1 className="category-title creative-font">{category.name}</h1>
        <p className="category-description">{category.description}</p>
      </div>
      <motion.div
        className="posters-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products.map(product => {
          const discountedPrice = product.sizes[0].price;
          const originalPrice = calculateOriginalPrice(discountedPrice);
          
          return (
            <motion.div
              variants={cardVariants}
              key={product.id}
              className="poster-card"
              whileHover={{ scale: 1.05, boxShadow: "0 16px 40px rgba(0,0,0,0.18)" }}
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
      </motion.div>
    </div>
  );
}

export default Category; 