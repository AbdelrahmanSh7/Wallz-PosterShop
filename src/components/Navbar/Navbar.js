import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Navbar.css'
import { FiShoppingCart, FiUser, FiSearch, FiX } from 'react-icons/fi'
import AdminLogin from '../Admin/AdminLogin'

const Navbar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Load cart count and admin status from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };

    const checkAdminStatus = () => {
      const adminLoggedIn = localStorage.getItem('adminLoggedIn');
      setIsAdminLoggedIn(adminLoggedIn === 'true');
    };

    updateCartCount();
    checkAdminStatus();
    
    // Listen for storage changes
    window.addEventListener('storage', () => {
      updateCartCount();
      checkAdminStatus();
    });
    
    // Custom event for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    
    // Listen for admin logout event
    const handleAdminLogout = () => {
      setIsAdminLoggedIn(false);
    };
    window.addEventListener('adminLogout', handleAdminLogout);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('adminLogout', handleAdminLogout);
    };
  }, []);

  const handleSearchIconClick = () => {
    navigate('/shop');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleUserClick = () => {
    if (isAdminLoggedIn) {
      navigate('/admin/orders');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogout = () => {
    try {
      // Clear all admin-related data
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminLoginTime');
      localStorage.removeItem('adminRememberMe');
      
      // Update state immediately
      setIsAdminLoggedIn(false);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('adminLogout'));
      
      // Navigate to home page instead of reloading
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: navigate to home
      navigate('/');
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsAdminLoggedIn(true);
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
          {isAdminLoggedIn && (
            <>
              <span className="admin-status">Admin</span>
              <Link to="/admin/orders" className="navbar__link admin-link">Admin Panel</Link>
            </>
          )}
        </div>
        <div className="navbar__right">
          <span className="navbar__icon" style={{ cursor: 'pointer' }} onClick={handleSearchIconClick}><FiSearch /></span>
          <span className="navbar__icon cart-icon" style={{ cursor: 'pointer' }} onClick={handleCartClick}>
            <FiShoppingCart />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </span>
          {isAdminLoggedIn ? (
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              Logout
            </button>
          ) : (
            <span className="navbar__icon" style={{ cursor: 'pointer' }} onClick={handleUserClick}><FiUser /></span>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="login-modal-overlay">
          <div className="login-modal-content">
            <button className="close-modal-btn" onClick={handleCloseModal}>
              <FiX />
            </button>
            <AdminLogin onLoginSuccess={handleLoginSuccess} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar;
