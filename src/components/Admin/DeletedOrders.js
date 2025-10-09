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

  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  // Load deleted orders from Firebase and localStorage
  useEffect(() => {
    const loadDeletedOrders = async () => {
      try {
        setLoading(true);
        
        // First try to load from Firebase
        const firebaseResult = await firebaseService.getDeletedOrders();
        if (firebaseResult.success) {
          const firebaseDeletedOrders = firebaseResult.deletedOrders || [];
          setDeletedOrders(firebaseDeletedOrders);
          setFilteredOrders(firebaseDeletedOrders);
          // Update localStorage with Firebase data
          localStorage.setItem('deletedOrders', JSON.stringify(firebaseDeletedOrders));
          console.log('📋 Loaded deleted orders from Firebase:', firebaseDeletedOrders.length);
        } else {
          // Fallback to localStorage
          const deleted = JSON.parse(localStorage.getItem('deletedOrders') || '[]');
          setDeletedOrders(deleted);
          setFilteredOrders(deleted);
          console.log('📋 Loaded deleted orders from localStorage:', deleted.length);
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

  // Filter orders based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOrders(deletedOrders);
    } else {
      const filtered = deletedOrders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.phone1?.includes(searchTerm) ||
        order.customer?.phone2?.includes(searchTerm)
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, deletedOrders]);

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
              <span className="stat-number">{deletedOrders.length}</span>
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
