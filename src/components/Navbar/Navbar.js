import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Navbar.css'
import { FiShoppingCart, FiUser, FiSearch } from 'react-icons/fi'

const Navbar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  // Load cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };

    updateCartCount();
    
    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleSearchIconClick = () => {
    navigate('/shop');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <>
      {/* Discount Banner */}
      <div className="discount-banner">
        <span className="discount-banner-text">15% OFF ON ALL PRODUCTS</span>
      </div>
      
      <nav className="navbar">
        <div className="navbar__left">
          <Link to="/">
            <img src="/logoPage.png" alt="Logo" className="navbar__logo-img" />
          </Link>
        </div>
        <div className="navbar__center">
          <a href="/" className="navbar__link">Shop ▼</a>
          <a href="/" className="navbar__link">Categories</a>
          <a href="#footer" className="navbar__link">Contact</a>
        </div>
        <div className="navbar__right">
          <span className="navbar__icon" style={{ cursor: 'pointer' }} onClick={handleSearchIconClick}><FiSearch /></span>
          <span className="navbar__icon cart-icon" style={{ cursor: 'pointer' }} onClick={handleCartClick}>
            <FiShoppingCart />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </span>
          <span className="navbar__icon"><FiUser /></span>
        </div>
      </nav>
    </>
  )
}

export default Navbar;
