import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTruck, FaClock, FaMapMarkerAlt, FaPhone, FaShoppingBag, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the latest order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (orders.length > 0) {
      const latestOrder = orders[orders.length - 1];
      setOrderData(latestOrder);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="order-confirmation-container">
        <div className="loading">جاري التحميل...</div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="order-confirmation-container">
        <div className="no-order">
          <h2>لا يوجد طلب</h2>
          <p>لم يتم العثور على أي طلب مؤكد</p>
          <Link to="/" className="back-home-btn">العودة للصفحة الرئيسية</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-container">
      <div className="confirmation-content">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h1>Order Successfully Submitted!</h1>
          <p>Thank you for your trust in us. We will contact you soon to confirm the details.</p>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="order-items">
            {orderData.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-details">
                    Size: {item.size} | Color: {item.color} | Quantity: {item.quantity}
                  </p>
                </div>
                <div className="item-price">
                  {item.price} EGP × {item.quantity} = {item.price * item.quantity} EGP
                </div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>{orderData.subtotal} EGP</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>+{orderData.shipping} EGP</span>
            </div>
            <div className="final-total">
              <span>Total:</span>
              <span>{orderData.total} EGP</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="customer-info">
          <h2>Customer Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <FaUser className="info-icon" />
              <div>
                <label>Full Name</label>
                <p>{orderData.customer.fullName}</p>
              </div>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <label>Governorate</label>
                <p>{orderData.customer.governorate}</p>
              </div>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <label>Detailed Address</label>
                <p>{orderData.customer.address}</p>
              </div>
            </div>
            <div className="info-item">
              <FaPhone className="info-icon" />
              <div>
                <label>Phone Number</label>
                <p>{orderData.customer.phone1}</p>
              </div>
            </div>
            {orderData.customer.phone2 && (
              <div className="info-item">
                <FaPhone className="info-icon" />
                <div>
                  <label>Alternative Phone</label>
                  <p>{orderData.customer.phone2}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="delivery-info">
          <h2>Delivery Information</h2>
          <div className="delivery-details">
            <div className="delivery-item">
              <FaTruck className="delivery-icon" />
              <div>
                <h3>Expected Delivery Time</h3>
                <p>2-6 working days</p>
              </div>
            </div>
            <div className="delivery-item">
              <FaClock className="delivery-icon" />
              <div>
                <h3>Order Status</h3>
                <p className="status-submitted">Submitted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <Link to="/" className="back-home-btn">
            <FaShoppingBag />
            Back to Homepage
          </Link>
          <button 
            onClick={() => window.print()} 
            className="print-order-btn"
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
