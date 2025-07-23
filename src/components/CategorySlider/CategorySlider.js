import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/products';
import './CategorySlider.css';

export default function CategorySlider() {
  const scrollRef = useRef();

  const scroll = (direction) => {
    if (direction === 'left') scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    else scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
  };

  return (
    <div className="category-slider-section">
      <h2 className="slider-title">Categories</h2>
      <div className="slider-wrapper">
        <button className="slider-arrow left" onClick={() => scroll('left')}>&lt;</button>
        <div className="category-slider" ref={scrollRef}>
          {categories.map((cat, idx) => (
            <Link to={`/category/${cat.id}`} className="category-card" key={cat.id || idx}>
              <img src={cat.image} alt={cat.name} />
              <div className="category-label">{cat.name}</div>
            </Link>
          ))}
        </div>
        <button className="slider-arrow right" onClick={() => scroll('right')}>&gt;</button>
      </div>
    </div>
  );
}
