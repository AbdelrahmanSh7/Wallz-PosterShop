import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getCategoryById } from '../../data/products';
import { FaInstagram, FaCheckCircle } from 'react-icons/fa';
import { useLoadingContext } from '../Loading/LoadingProvider';
import Loading from '../Loading/Loading';
import './Product.css';

function Product() {
  const { productId } = useParams();
  const { startComponentLoading, stopComponentLoading, isComponentLoading } = useLoadingContext();
  const product = getProductById(productId);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]?.name);
  const [selectedColor, setSelectedColor] = useState('black');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const topRef = useRef(null);

  // Color options for posters
  const colorOptions = [
    { name: 'black', label: 'Classic Black', hex: '#1a1a1a' },
    { name: 'white', label: 'Pure White', hex: '#ffffff' },
    { name: 'darkWood', label: 'Natural Wood', hex: '#5D4037' }
  ];

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
    let originalPrice = Math.round(discountedPrice / (1 - discountPercentage / 100));
    if (originalPrice === 271) originalPrice = 270;
    if (originalPrice === 329) originalPrice = 330;
    return originalPrice;
  };

  const selectedSizeData = product.sizes.find(s => s.name === selectedSize);
  const discountedPrice = selectedSizeData?.price || product.price;
  const originalPrice = calculateOriginalPrice(discountedPrice);

  return (
    <div className="product-calm-container">
      <div ref={topRef}></div>
      <div className="product-calm-image-wrap">
        <img src={product.image} alt={product.name} className="product-calm-image" />
      </div>
      <div className="product-calm-info">
        <h1 className="product-calm-title">{product.name}</h1>
        
        {/* Discount Badge */}
        <div className="discount-badge">
          <span className="discount-text">15% OFF</span>
        </div>
        
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
        
        {/* Color Selection */}
        <div className="product-calm-colors">
          <h3 className="color-section-title">Choose Color</h3>
          <div className="color-options">
            {colorOptions.map((color, idx) => (
              <button
                key={idx}
                className={`color-option${selectedColor === color.name ? ' selected' : ''}`}
                onClick={() => setSelectedColor(color.name)}
                style={{
                  '--color-hex': color.hex,
                  '--color-border': color.border
                }}
              >
                <div className="color-preview"></div>
                <span className="color-label">{color.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="product-calm-order-btns">
          <button 
            onClick={async () => {
              try {
                setIsAddingToCart(true);
                startComponentLoading('addToCart', 'Adding to cart...');
                
                const cartItem = {
                  id: `${product.id}-${selectedSize}-${selectedColor}`,
                  productId: product.id,
                  name: product.name,
                  category: category?.name,
                  size: selectedSize,
                  color: colorOptions.find(c => c.name === selectedColor)?.label,
                  price: discountedPrice,
                  image: product.image,
                  quantity: 1
                };
                
                const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
                const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
                
                if (existingItemIndex >= 0) {
                  existingCart[existingItemIndex].quantity += 1;
                } else {
                  existingCart.push(cartItem);
                }
                
                localStorage.setItem('cart', JSON.stringify(existingCart));
                
                // Dispatch custom event to update navbar cart count
                window.dispatchEvent(new CustomEvent('cartUpdated'));
                
                // Simulate a small delay for better UX
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Show success banner
                const banner = document.createElement('div');
                banner.className = 'success-banner';
                banner.innerHTML = `
                  <div class="banner-content">
                    <span>✅ Product added to cart successfully!</span>
                    <button class="view-cart-btn">View Cart</button>
                  </div>
                `;
                
                document.body.appendChild(banner);
                
                // Add click event to view cart button
                setTimeout(() => {
                  const viewCartBtn = banner.querySelector('.view-cart-btn');
                  viewCartBtn.addEventListener('click', () => {
                    window.location.href = '/cart';
                  });
                }, 100);
                
                // Remove banner after 4 seconds
                setTimeout(() => {
                  if (banner.parentNode) {
                    banner.parentNode.removeChild(banner);
                  }
                }, 4000);
              } catch (error) {
                console.error('Error adding to cart:', error);
              } finally {
                setIsAddingToCart(false);
                stopComponentLoading('addToCart');
              }
            }}
            className="add-to-cart-btn"
            disabled={isAddingToCart || isComponentLoading('addToCart')}
          >
            {isAddingToCart || isComponentLoading('addToCart') ? (
              <Loading size="small" color="light" showText={false} />
            ) : (
              '🛒 Add to Cart'
            )}
          </button>
          
          <button 
            onClick={() => {
              const cartItem = {
                id: `${product.id}-${selectedSize}-${selectedColor}`,
                productId: product.id,
                name: product.name,
                category: category?.name,
                size: selectedSize,
                color: colorOptions.find(c => c.name === selectedColor)?.label,
                price: discountedPrice,
                image: product.image,
                quantity: 1
              };
              
              const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
              const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
              
              if (existingItemIndex >= 0) {
                existingCart[existingItemIndex].quantity += 1;
              } else {
                existingCart.push(cartItem);
              }
              
              localStorage.setItem('cart', JSON.stringify(existingCart));
              
              // Dispatch custom event to update navbar cart count
              window.dispatchEvent(new CustomEvent('cartUpdated'));
              
              // Navigate to cart
              window.location.href = '/cart';
            }}
            className="confirm-order-btn"
          >
            <FaCheckCircle className="btn-icon" />
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
