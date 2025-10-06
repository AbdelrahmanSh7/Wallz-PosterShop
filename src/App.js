import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar/Navbar";
import CategorySlider from './components/CategorySlider/CategorySlider';
import Category from "./components/Category/Category";
import Home from './components/Home/Home';
import Product from './components/Product/Product';
import Shop from './components/Shop';
import Cart from './components/Cart/Cart';
import Footer from './components/Footer/Footer';
import AdminOrders from './components/Admin/AdminOrders';
import OrderConfirmation from './components/OrderConfirmation/OrderConfirmation';
import { LoadingProvider } from './components/Loading/LoadingProvider';
import PageTransition from './components/PageTransition/PageTransition';

function AppContent() {
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/product/');
  const isShopPage = location.pathname.startsWith('/shop');
  const isCartPage = location.pathname === '/cart';
  const isOrderConfirmationPage = location.pathname === '/order-confirmation';
  const isAdminPage = location.pathname.startsWith('/admin');
  
  return (
    <PageTransition>
      {!isAdminPage && <Navbar />}
      {!isProductPage && !isShopPage && !isCartPage && !isOrderConfirmationPage && !isAdminPage && <CategorySlider />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryId" element={<Category />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Routes>
      {!isAdminPage && <Footer />}
    </PageTransition>
  );
}

function App() {
  return (
    <LoadingProvider>
      <Router>
        <AppContent />
      </Router>
    </LoadingProvider>
  );
}

export default App;