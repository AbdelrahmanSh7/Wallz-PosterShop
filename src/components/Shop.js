import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import './Category/Category.css'; 

const Shop = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSearch = params.get('search') || '';
  const [search, setSearch] = useState(initialSearch);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Remove automatic scroll to top - keep page at top when opened
  // useEffect(() => {
  //   // Try multiple methods to ensure scrolling works
  //   const scrollToTop = () => {
  //     if (topRef.current) {
  //       topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //     } else {
  //       window.scrollTo({ top: 0, behavior: 'smooth' });
  //     }
  //   };
    
  //   // Immediate scroll
  //   scrollToTop();
    
  //   // Delayed scroll to ensure it works after page load
  //   setTimeout(scrollToTop, 100);
  //   setTimeout(scrollToTop, 500);
  // }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInputRef.current.focus();
    }
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search)}`);
    }
  };

  // Calculate original price (before discount)
  const calculateOriginalPrice = (discountedPrice) => {
    const discountPercentage = 15;
    let originalPrice = Math.round(discountedPrice / (1 - discountPercentage / 100));
    if (originalPrice === 271) originalPrice = 270;
    if (originalPrice === 329) originalPrice = 330;
    return originalPrice;
  };

  return (
    <div className="products-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 0' }}>
      <label htmlFor="shop-search" style={{ fontWeight: 500, fontSize: '1.2em', marginLeft: 8 }}>Search</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, margin: '18px 0 32px 0' }}>
        <input
          id="shop-search"
          ref={searchInputRef}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search for posters..."
          style={{
            flex: 1,
            fontSize: '1.15em',
            padding: '16px 24px',
            borderRadius: 16,
            border: '1.5px solid #eee',
            outline: 'none',
            background: '#fafafd',
            marginRight: 0
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            background: '#111',
            color: '#fff',
            border: 'none',
            borderRadius: 16,
            padding: '13px 32px',
            fontSize: '1.1em',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s',
            marginLeft: 0
          }}
        >
          Search
        </button>
      </div>
      <div className="posters-grid" style={{ marginTop: 18 }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const discountedPrice = product.price;
            const originalPrice = calculateOriginalPrice(discountedPrice);
            
            return (
              <Link to={`/product/${product.id}`} className="poster-card" key={product.id} style={{ minWidth: 220 }}>
                <div className="poster-image-container">
                  <img src={product.image} alt={product.name} className="poster-image" />
                </div>
                <div className="poster-info">
                  <div className="poster-name creative-font" style={{ fontSize: '1.15em', marginBottom: 8 }}>{product.name}</div>
                  <div className="price-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <span className="original-price-overlay" style={{ 
                      fontSize: '1em',
                      color: '#999',
                      textDecoration: 'line-through',
                      fontWeight: '500'
                    }}>{originalPrice} EGP</span>
                    <span className="discounted-price-overlay" style={{ 
                      fontSize: '1.18em', 
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #e1306c, #ff6b6b)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>{discountedPrice} EGP</span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p style={{ fontSize: '1.2em', color: '#888', margin: '40px auto', textAlign: 'center' }}>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Shop;
