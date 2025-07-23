import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory, getCategoryById } from '../../data/products';
import './Category.css';
import { motion } from 'framer-motion';

function Category() {
  const { categoryId } = useParams();
  const category = getCategoryById(categoryId);
  const products = getProductsByCategory(categoryId);

  if (!category) {
    return <div className="category-not-found">Category not found</div>;
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: "spring" } }
  };

  return (
    <div className="category-page-container">
      <div className="category-header">
        <h1 className="category-title creative-font">{category.name}</h1>
        <p className="category-description">{category.description}</p>
      </div>
      <motion.div
        className="posters-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products.map(product => (
          <motion.div
            variants={cardVariants}
            key={product.id}
            className="poster-card"
            whileHover={{ scale: 1.05, boxShadow: "0 16px 40px rgba(0,0,0,0.18)" }}
          >
            <Link to={`/product/${product.id}`}>
              <div className="poster-image-container">
                <img src={product.image} alt={product.name} className="poster-image" />
              </div>
              <div className="poster-info">
                <h3 className="poster-name creative-font">{product.name}</h3>
                <p className="poster-price">Start From {product.sizes[0].price} LE</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Category; 