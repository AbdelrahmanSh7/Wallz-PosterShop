import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaTrash, 
  FaUndo, 
  FaHistory,
  FaArrowLeft,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import firebaseService from '../../services/firebaseService';
import './AdminOrders.css';

function DeletedOrders() {
  const navigate = useNavigate();
  const [deletedOrders, setDeletedOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeletedOrders, setShowDeletedOrders] = useState(true);
  const [deletedOrdersCount, setDeletedOrdersCount] = useState(0);

  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  // Load show/hide preference and sync across devices
  useEffect(() => {
    const savedPreference = localStorage.getItem('showDeletedOrders');
    const initialShow = savedPreference === 'true';
    setShowDeletedOrders(initialShow);
    
    // Listen for storage changes from other devices
    const handleStorageChange = (e) => {
      if (e.key === 'showDeletedOrders') {
        const newShowDeleted = e.newValue === 'true';
        setShowDeletedOrders(newShowDeleted);
        console.log('🔄 Show deleted orders preference synced from other device:', newShowDeleted);
      }
      if (e.key === 'deletedOrders') {
        const deletedOrders = JSON.parse(e.newValue || '[]');
        setDeletedOrders(deletedOrders);
        setDeletedOrdersCount(deletedOrders.length);
        console.log('🔄 Deleted orders synced from other device:', deletedOrders.length);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Load deleted orders from Firebase and localStorage
  useEffect(() => {
    const loadDeletedOrders = async () => {
      try {
        setLoading(true);
        
        // First try to load from Firebase
        const firebaseResult = await firebaseService.getDeletedOrders();
        let allDeletedOrders = [];
        
        if (firebaseResult.success) {
          allDeletedOrders = firebaseResult.deletedOrders || [];
          // Update localStorage with Firebase data
          localStorage.setItem('deletedOrders', JSON.stringify(allDeletedOrders));
          console.log('📋 Loaded deleted orders from Firebase:', allDeletedOrders.length);
        } else {
          // Fallback to localStorage
          allDeletedOrders = JSON.parse(localStorage.getItem('deletedOrders') || '[]');
          console.log('📋 Loaded deleted orders from localStorage:', allDeletedOrders.length);
        }
        
        setDeletedOrders(allDeletedOrders);
        
        // Apply show/hide preference
        const savedPreference = localStorage.getItem('showDeletedOrders');
        const shouldShow = savedPreference === 'true';
        setShowDeletedOrders(shouldShow);
        
        if (shouldShow) {
          setFilteredOrders(allDeletedOrders);
          setDeletedOrdersCount(allDeletedOrders.length);
        } else {
          setFilteredOrders([]);
          setDeletedOrdersCount(0);
        }
        
      } catch (error) {
        console.error('Error loading deleted orders:', error);
        // Fallback to localStorage
        const deleted = JSON.parse(localStorage.getItem('deletedOrders') || '[]');
        setDeletedOrders(deleted);
        setFilteredOrders(deleted);
      } finally {
        setLoading(false);
      }
    };

    loadDeletedOrders();
  }, []);

  // Filter orders based on search term and show/hide preference
  useEffect(() => {
    if (!showDeletedOrders) {
      setFilteredOrders([]);
      setDeletedOrdersCount(0);
      return;
    }
    
    if (!searchTerm.trim()) {
      setFilteredOrders(deletedOrders);
      setDeletedOrdersCount(deletedOrders.length);
    } else {
      const filtered = deletedOrders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.phone1?.includes(searchTerm) ||
        order.customer?.phone2?.includes(searchTerm)
      );
      setFilteredOrders(filtered);
      setDeletedOrdersCount(filtered.length);
    }
  }, [searchTerm, deletedOrders, showDeletedOrders]);

  // Restore order
  const restoreOrder = async (orderId) => {
    try {
      const orderToRestore = deletedOrders.find(order => order.id === orderId);
      if (!orderToRestore) return;

      // Remove from deleted orders
      const updatedDeleted = deletedOrders.filter(order => order.id !== orderId);
      setDeletedOrders(updatedDeleted);
      setFilteredOrders(updatedDeleted);
      localStorage.setItem('deletedOrders', JSON.stringify(updatedDeleted));

      // Update Firebase with new deleted orders list
      try {
        const syncResult = await firebaseService.saveDeletedOrders(updatedDeleted);
        if (syncResult.success) {
          console.log('✅ Deleted orders updated in Firebase successfully');
        } else {
          console.error('❌ Failed to update Firebase:', syncResult.error);
        }
      } catch (error) {
        console.error('❌ Failed to update Firebase:', error);
      }

      // Add back to active orders
      const activeOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      activeOrders.push(orderToRestore);
      localStorage.setItem('orders', JSON.stringify(activeOrders));

      console.log('✅ Order restored:', orderId);
      alert('تم استعادة الطلب بنجاح!');
    } catch (error) {
      console.error('Error restoring order:', error);
      alert('حدث خطأ في استعادة الطلب');
    }
  };

  // Toggle show/hide deleted orders
  const toggleShowDeletedOrders = () => {
    const newShowDeleted = !showDeletedOrders;
    setShowDeletedOrders(newShowDeleted);
    
    // Save preference to localStorage for cross-device sync
    localStorage.setItem('showDeletedOrders', newShowDeleted.toString());
    
    // Update filtered orders based on preference
    if (newShowDeleted) {
      setFilteredOrders(deletedOrders);
      setDeletedOrdersCount(deletedOrders.length);
    } else {
      setFilteredOrders([]);
      setDeletedOrdersCount(0);
    }
    
    console.log(`🔄 Toggle deleted orders: ${newShowDeleted ? 'showing' : 'hiding'} deleted orders`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-orders-container">
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">
      {/* Header */}
      <div className="admin-header">
        <div className="header-top">
          <Link to="/admin/orders" className="back-to-home-btn">
            <FaArrowLeft />
            Back to Orders
          </Link>
          <div className="admin-header-content">
            <h1>🗑️ Deleted Orders</h1>
            <p>Manage permanently deleted orders</p>
          </div>
        </div>
        
        <div className="admin-stats">
          <div className="stat-card">
            <FaHistory />
            <div>
              <span className="stat-number">{showDeletedOrders ? deletedOrdersCount : 0}</span>
              <span className="stat-label">Deleted Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by order, phone, etc."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={toggleShowDeletedOrders} 
          className={`toggle-deleted-orders-btn ${showDeletedOrders ? 'showing' : 'hiding'}`}
        >
          {showDeletedOrders ? '👁️ Hide Deleted' : '👁️ Show Deleted'}
        </button>
        
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <FaHistory />
            <h3>No Deleted Orders</h3>
            <p>There are no deleted orders to display.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-card deleted-order">
              <div className="order-header">
                <div className="order-title-row">
                  <h3>Order #{order.id}</h3>
                  <span className="deleted-badge">DELETED</span>
                </div>
                <div className="order-date">
                  <span>Deleted: {formatDate(order.deletedAt || new Date())}</span>
                </div>
              </div>

              <div className="order-customer">
                <div className="customer-info">
                  <span>👤 {order.customer?.fullName} {order.customer?.lastName}</span>
                </div>
                <div className="customer-phone">
                  <span>📞 {order.customer?.phone1}</span>
                </div>
                {order.customer?.phone2 && (
                  <div className="customer-phone">
                    <span>📞 {order.customer?.phone2}</span>
                  </div>
                )}
                <div className="customer-location">
                  <span>📍 {order.customer?.governorate} - {order.customer?.address}</span>
                </div>
              </div>

              <div className="order-summary">
                <div className="order-items">
                  {order.items?.length || 0} items
                </div>
                <div className="order-total">
                  {order.total} EGP
                </div>
              </div>

              <div className="order-actions">
                <button 
                  onClick={() => restoreOrder(order.id)}
                  className="restore-btn"
                >
                  <FaUndo />
                  Restore
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DeletedOrders;
