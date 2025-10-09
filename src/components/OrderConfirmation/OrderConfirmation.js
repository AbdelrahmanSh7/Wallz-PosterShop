import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTruck, FaClock, FaMapMarkerAlt, FaPhone, FaShoppingBag, FaUser } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import Loading from '../Loading/Loading';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Get order data from navigation state (passed from Cart)
    if (location.state && location.state.order) {
      // Small delay to show loading animation
      setTimeout(() => {
        setOrderData(location.state.order);
        setLoading(false);
        console.log('✅ Order confirmation loaded successfully');
      }, 500);
    } else {
      // Fallback: Get the latest order from localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      if (orders.length > 0) {
        const latestOrder = orders[orders.length - 1];
        setTimeout(() => {
          setOrderData(latestOrder);
          setLoading(false);
        }, 500);
      } else {
        setLoading(false);
      }
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="order-confirmation-container">
        <div className="order-loading">
          <Loading 
            size="large" 
            color="primary" 
            text="Loading order details..." 
          />
        </div>
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
      {/* Progress Indicator */}
      <div className="checkout-progress">
        <div className="progress-step">
          <div className="step-number">1</div>
          <span>Personal Information</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step active">
          <div className="step-number">2</div>
          <span>Summary</span>
        </div>
      </div>

      <div className="confirmation-content">
        {/* Success Header - Compact */}
        <div className="success-header-compact">
          <div className="success-icon-compact">
            <FaCheckCircle />
          </div>
          <h1>Order Submitted Successfully!</h1>
          <p className="thank-you-message">
            شكراً على ثقتك فينا! انتظر رسالة تأكيد منا على الإيميل او الواتساب ❤️
            <br />
            Thank you for your trust! Wait for our confirmation message via email or WhatsApp ❤️
          </p>
        </div>

        {/* Order Summary - Compact */}
        <div className="order-summary-compact">
          <h2>Order Summary</h2>
          
          <div className="order-items-compact">
            {orderData.items.map((item, index) => (
              <div key={index} className="order-item-compact" onClick={() => window.location.href = `/product/${item.productId}`}>
                <div className="item-image-light">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-info-compact">
                  <h3>{item.name}</h3>
                  <p className="item-details-compact">
                    {item.size} | {item.color} | Qty: {item.quantity}
                  </p>
                  <div className="item-price-compact">{item.price * item.quantity} EGP</div>
                </div>
              </div>
            ))}
          </div>

          <div className="order-totals-compact">
            <div className="total-row-compact">
              <span>Subtotal:</span>
              <span>{orderData.subtotal} EGP</span>
            </div>
            <div className="total-row-compact">
              <span>Shipping:</span>
              <span>+{orderData.shipping} EGP</span>
            </div>
            <div className="final-total-compact">
              <span>Total:</span>
              <span>{orderData.total} EGP</span>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Info - Compact */}
        <div className="info-compact">
          <div className="info-row">
            <FaUser className="info-icon" />
            <span><strong>Name:</strong> {orderData.customer.fullName}</span>
          </div>
          {orderData.customer.email && (
            <div className="info-row">
              <FaUser className="info-icon" />
              <span><strong>Email:</strong> {orderData.customer.email}</span>
            </div>
          )}
          <div className="info-row">
            <FaMapMarkerAlt className="info-icon" />
            <span><strong>Location:</strong> {orderData.customer.governorate}</span>
          </div>
          <div className="info-row">
            <FaPhone className="info-icon" />
            <span><strong>Phone:</strong> {orderData.customer.phone1}</span>
          </div>
          {orderData.customer.phone2 && (
            <div className="info-row">
              <FaPhone className="info-icon" />
              <span><strong>Phone 2:</strong> {orderData.customer.phone2}</span>
            </div>
          )}
          <div className="info-row">
            <FaTruck className="info-icon" />
            <span><strong>Delivery:</strong> 2-6 working days</span>
          </div>
          <div className="info-row">
            <FaClock className="info-icon" />
            <span><strong>Status:</strong> <span className="status-submitted">Submitted</span></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <Link to="/" className="back-home-btn">
            <FaShoppingBag />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
