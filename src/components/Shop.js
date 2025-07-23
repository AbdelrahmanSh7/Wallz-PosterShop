import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { products } from '../data/products';
import './Category/Category.css';

const Shop = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get('search')?.toLowerCase() || '';

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="products-page">
      <h2>Posters</h2>
      <div className="posters-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link to={`/product/${product.id}`} className="poster-card" key={product.id}>
              <div className="poster-image-container">
                <img src={product.image} alt={product.name} className="poster-image" />
              </div>
              <div className="poster-info">
                <div className="poster-name creative-font">{product.name}</div>
                <div className="poster-price">Start From {product.sizes[0].price} LE</div>
              </div>
            </Link>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default Shop;
