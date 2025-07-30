import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getCategoryById } from '../../data/products';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import './Product.css';

function Product() {
  const { productId } = useParams();
  const product = getProductById(productId);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]?.name);
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
  }, [productId]);

  if (!product) return <div className="product-not-found">Product not found</div>;

  const category = getCategoryById(product.categoryId);
  
  // Calculate original price (before discount)
  const calculateOriginalPrice = (discountedPrice) => {
    const discountPercentage = 15;
    const originalPrice = Math.round(discountedPrice / (1 - discountPercentage / 100));
    return originalPrice;
  };

  const selectedSizeData = product.sizes.find(s => s.name === selectedSize);
  const discountedPrice = selectedSizeData?.price || product.price;
  const originalPrice = calculateOriginalPrice(discountedPrice);

  return (
    <div className="product-calm-container" style={{ paddingTop: '50px' }}>
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
      
      <div className="product-calm-image-wrap">
        <img src={product.image} alt={product.name} className="product-calm-image" />
      </div>
      <div className="product-calm-info">
        <h1 className="product-calm-title">{product.name}</h1>
        {/* Price Display */}
        <div className="product-calm-price-container">
          <div className="original-price">{originalPrice} EGP</div>
          <div className="discounted-price">{discountedPrice} EGP</div>
        </div>
        
        <p className="product-calm-description">
          {product.description || "Premium poster, high-quality print, and beautiful finish. Choose your size and order directly via WhatsApp or Instagram."}
        </p>
        <div className="product-calm-sizes">
          {product.sizes.map((size, idx) => (
            <button
              key={idx}
              className={`calm-size-btn${selectedSize === size.name ? ' selected' : ''}`}
              onClick={() => setSelectedSize(size.name)}
            >
              {size.dimensions}
            </button>
          ))}
        </div>
        <div className="product-calm-order-btns">
          <a
            href={`https://wa.me/201100643834?text=${encodeURIComponent(`Hi, I'm interested in the poster: ${category?.name} : ${product.name} (${selectedSize}) - Price: ${discountedPrice} EGP (15% off)`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="calm-whatsapp-btn"
          >
            <FaWhatsapp className="btn-icon" />
            Order via WhatsApp
          </a>
          <a
            href="https://www.instagram.com/wallz_eg/"
            target="_blank"
            rel="noopener noreferrer"
            className="calm-instagram-btn"
          >
            <FaInstagram className="btn-icon" />
            Message on Instagram
          </a>
        </div>
      </div>
    </div>
  );
}

export default Product;
