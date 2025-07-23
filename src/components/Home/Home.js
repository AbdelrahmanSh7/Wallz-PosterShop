import React from 'react';
import { products } from '../../data/products';
import { Link } from 'react-router-dom';
import '../Category/Category.css';

function getRandomProducts(arr, n) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function Home() {
  const randomProducts = getRandomProducts(products, 16);

  return (
    <div className="category-slider-section">
      <h2 className="slider-title" >Featured Posters</h2>
      <div className="posters-grid">
        {randomProducts.map(product => (
          <Link to={`/product/${product.id}`} className="poster-card" key={product.id}>
            <div className="poster-image-container">
              <img src={product.image} alt={product.name} className="poster-image" />
            </div>
            <div className="poster-info">
              <h3 className="poster-name creative-font">{product.name}</h3>
              <p className="poster-price">Start From {product.sizes[0].price} LE</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
