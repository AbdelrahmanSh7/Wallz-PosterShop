import React, { useEffect } from 'react';
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
import DeletedOrders from './components/Admin/DeletedOrders';
import OrderConfirmation from './components/OrderConfirmation/OrderConfirmation';
import { LoadingProvider } from './components/Loading/LoadingProvider';
import PageTransition from './components/PageTransition/PageTransition';
import InstallButton from './components/PWA/InstallButton';
import { usePWA } from './components/PWA/PWAManager';
// import NetworkStatus from './components/NetworkStatus/NetworkStatus';
import { registerServiceWorker } from './utils/serviceWorkerUtils';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/product/');
  const isShopPage = location.pathname.startsWith('/shop');
  const isCartPage = location.pathname === '/cart';
  const isOrderConfirmationPage = location.pathname === '/order-confirmation';
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // PWA functionality
  const { isInstalled, updateAvailable, updateApp } = usePWA();
  
  // Re-register Service Worker on app start
  useEffect(() => {
    const reRegisterServiceWorker = async () => {
      try {
        console.log('🔄 Re-registering Service Worker...');
        await registerServiceWorker();
        console.log('✅ Service Worker re-registered successfully');
      } catch (error) {
        console.error('❌ Failed to re-register Service Worker:', error);
      }
    };
    
    reRegisterServiceWorker();
  }, []);
  
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
        <Route path="/admin/deleted-orders" element={<DeletedOrders />} />
      </Routes>
      {!isAdminPage && <Footer />}
      
      {/* PWA Components */}
      {!isInstalled && !isAdminPage && <InstallButton />}
      
      {/* Update Available Banner */}
      {updateAvailable && (
        <div className="update-banner">
          <div className="update-content">
            <span>🔄 Update Available</span>
            <button onClick={updateApp} className="update-btn">
              Update Now
            </button>
          </div>
        </div>
      )}
      
      {/* Network Status */}
      {/* <NetworkStatus /> */}
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