import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/products';
import './CategorySlider.css';

export default function CategorySlider() {
  const scrollRef = useRef();

  // Auto-scroll every 0.5s
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        // لو وصلت للنهاية، ارجع للبداية
        if (
          scrollRef.current.scrollLeft + scrollRef.current.offsetWidth >=
          scrollRef.current.scrollWidth
        ) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    }, 2500); // 0.5 ثانية
    return () => clearInterval(interval);
  }, []);

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
