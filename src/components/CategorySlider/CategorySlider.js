import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '../../data/products';
import './CategorySlider.css';

export default function CategorySlider() {
  const scrollRef = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const [menuAnim, setMenuAnim] = useState('');
  const menuRef = useRef();
  const buttonRef = useRef();
  const navigate = useNavigate();

  // Auto-scroll every 0.5s
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });

        if (
          scrollRef.current.scrollLeft + scrollRef.current.offsetWidth >=
          scrollRef.current.scrollWidth
        ) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Animation for menu
  useEffect(() => {
    if (showMenu) {
      setMenuAnim('open');
    } else if (menuAnim === 'open') {
      setMenuAnim('close');
      const timeout = setTimeout(() => setMenuAnim(''), 350);
      return () => clearTimeout(timeout);
    }
  }, [showMenu]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;
    function handleClick(e) {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  const scroll = (direction) => {
    if (direction === 'left') scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    else scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
  };

  // Function to handle category selection with scroll to top
  const handleCategoryClick = (categoryId) => {
    // Navigate to category
    navigate(`/category/${categoryId}`);
    
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="category-slider-section">
      <h2 className="slider-title">Categories</h2>
      {/* Hamburger menu always on mobile, above slider */}
      <div className="mobile-category-menu">
        <button
          className={`hamburger-menu${showMenu ? ' open' : ''}`}
          ref={buttonRef}
          aria-label={showMenu ? 'Close categories menu' : 'Open categories menu'}
          aria-expanded={showMenu}
          aria-controls="mobile-category-list"
          onClick={() => setShowMenu(!showMenu)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        {/* Backdrop overlay */}
        {showMenu && <div className="mobile-category-backdrop" onClick={() => setShowMenu(false)}></div>}
        <div
          ref={menuRef}
          id="mobile-category-list"
          className={`mobile-category-list-anim ${showMenu ? 'show' : ''} ${menuAnim}`}
          style={{ pointerEvents: showMenu || menuAnim === 'close' ? 'auto' : 'none' }}
        >
          {categories.map((cat, idx) => (
            <div 
              className="mobile-category-item" 
              key={cat.id || idx} 
              onClick={() => {
                setShowMenu(false);
                handleCategoryClick(cat.id);
              }}
            >
              <span className="mobile-category-dot"></span>
              {cat.name}
            </div>
          ))}
        </div>
      </div>
      {/* Slider always visible */}
      <div className="slider-wrapper">
        <button className="slider-arrow left" onClick={() => scroll('left')}>&lt;</button>
        <div className="category-slider" ref={scrollRef}>
          {categories.map((cat, idx) => (
            <div 
              className="category-card" 
              key={cat.id || idx}
              onClick={() => handleCategoryClick(cat.id)}
              style={{ cursor: 'pointer' }}
            >
              <img src={cat.image} alt={cat.name} />
              <div className="category-label">{cat.name}</div>
            </div>
          ))}
        </div>
        <button className="slider-arrow right" onClick={() => scroll('right')}>&gt;</button>
      </div>
    </div>
  );
}
