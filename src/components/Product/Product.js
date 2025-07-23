import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getCategoryById } from '../../data/products';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import './Product.css';

function Product() {
  const { productId } = useParams();
  const product = getProductById(productId);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]?.name);

  if (!product) return <div className="product-not-found">Product not found</div>;

  const category = getCategoryById(product.categoryId);

  return (
    <div className="product-calm-container">
      <div className="product-calm-image-wrap">
        <img src={product.image} alt={product.name} className="product-calm-image" />
      </div>
      <div className="product-calm-info">
        <h1 className="product-calm-title">{product.name}</h1>
        <div className="product-calm-price">{product.sizes.find(s => s.name === selectedSize)?.price} EGP</div>
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
            href={`https://wa.me/201100643834?text=${encodeURIComponent(`Hi, I'm interested in the poster: ${category?.name} : ${product.name} (${selectedSize})`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="calm-whatsapp-btn"
          >
            <FaWhatsapp className="btn-icon" />
            Order via WhatsApp
          </a>
          <a
            href="https://instagram.com/your_instagram_username"
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
