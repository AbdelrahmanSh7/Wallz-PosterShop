import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar/Navbar";
import CategorySlider from './components/CategorySlider/CategorySlider';
import Category from "./components/Category/Category";
import Home from './components/Home/Home';
import Product from './components/Product/Product';
import Shop from './components/Shop';
import Footer from './components/Footer/Footer';

function AppContent() {
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/product/');
  return (
    <>
      <Navbar />
      {!isProductPage && <CategorySlider />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryId" element={<Category />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;