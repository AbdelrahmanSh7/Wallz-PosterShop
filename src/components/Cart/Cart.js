import React, { useState, useEffect, useCallback } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { GOVERNORATES, getShippingCost } from '../../data/governorates';
import firebaseService from '../../services/firebaseService';
import simpleNotification from '../../utils/simpleNotification';
import { useCustomAlert } from '../../hooks/useCustomAlert';
import CustomAlert from '../CustomAlert/CustomAlert';
import { useLoadingContext } from '../Loading/LoadingProvider';
import Loading from '../Loading/Loading';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { alertState, showAlert: showCustomAlert } = useCustomAlert();
  const { startComponentLoading, stopComponentLoading, isComponentLoading } = useLoadingContext();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  
  // Customer data form state
  const [customerData, setCustomerData] = useState({
    fullName: '',
    lastName: '',
    email: '',
    governorate: '',
    address: '',
    phone1: '',
    phone2: ''
  });
  const [showCustomerForm, setShowCustomerForm] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!customerData.fullName.trim()) {
      errors.fullName = 'الاسم الأول مطلوب';
    }
    
    if (!customerData.lastName.trim()) {
      errors.lastName = 'الاسم الأخير مطلوب';
    }
    
    if (customerData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      errors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!customerData.governorate) {
      errors.governorate = 'المحافظة مطلوبة';
    }
    
    if (!customerData.address.trim()) {
      errors.address = 'العنوان مطلوب';
    }
    
    // Phone 1 validation - must start with 01 and be 11 digits
    if (!customerData.phone1.trim()) {
      errors.phone1 = 'رقم التلفون الأول مطلوب';
    } else {
      const cleanPhone1 = customerData.phone1.replace(/\s/g, '');
      if (!/^01[0-9]{9}$/.test(cleanPhone1)) {
        errors.phone1 = 'رقم التلفون الأول يجب أن يبدأ بـ 01 ويحتوي على 11 رقم';
      }
    }
    
    // Phone 2 validation - must start with 01 and be 11 digits
    if (!customerData.phone2.trim()) {
      errors.phone2 = 'رقم التلفون الثاني مطلوب';
    } else {
      const cleanPhone2 = customerData.phone2.replace(/\s/g, '');
      if (!/^01[0-9]{9}$/.test(cleanPhone2)) {
        errors.phone2 = 'رقم التلفون الثاني يجب أن يبدأ بـ 01 ويحتوي على 11 رقم';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Calculate shipping cost when governorate changes
  useEffect(() => {
    if (customerData.governorate) {
      const cost = getShippingCost(customerData.governorate);
      setShippingCost(cost);
    } else {
      setShippingCost(0);
    }
  }, [customerData.governorate]);

  // Calculate totals whenever cart changes
  const calculateTotals = useCallback((items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(subtotal);
    setFinalTotal(subtotal + shippingCost);
  }, [shippingCost]);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const loadCartItems = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          setCartItems(items);
          calculateTotals(items);
        } catch (error) {
          console.error('Error parsing cart data:', error);
          setCartItems([]);
          setTotalPrice(0);
          setFinalTotal(0);
        }
      } else {
        setCartItems([]);
        setTotalPrice(0);
        setFinalTotal(0);
      }
    };

    // Load cart items initially
    loadCartItems();

    // Listen for storage changes (when cart is updated from other tabs/components)
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        loadCartItems();
      }
    };

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      loadCartItems();
    };

    // Listen for focus events (when user returns to tab)
    const handleFocus = () => {
      loadCartItems();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('focus', handleFocus);
    };
  }, [calculateTotals]);

  // Update shipping cost when governorate changes
  const updateShippingCost = (governorateValue) => {
    const newShippingCost = getShippingCost(governorateValue);
    setShippingCost(newShippingCost);
  };



  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    setTotalPrice(0);
    setFinalTotal(0);
    
    // Trigger cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  // Handle customer data input
  const handleCustomerDataChange = (e) => {
    const { name, value } = e.target;
    
    // For phone numbers, only allow digits
    if (name === 'phone1' || name === 'phone2') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setCustomerData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setCustomerData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Update shipping cost when governorate changes
    if (name === 'governorate') {
      updateShippingCost(value);
    }
  };

  // Validate customer data
  const validateCustomerData = () => {
    const { fullName, lastName, governorate, address, phone1, phone2 } = customerData;
    return fullName.trim() && lastName.trim() && governorate.trim() && address.trim() && phone1.trim() && phone2.trim();
  };

  // Save order to localStorage
  const saveOrder = async () => {
    if (!validateCustomerData()) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    const order = {
      id: Date.now().toString(),
      customer: customerData,
      items: cartItems,
      subtotal: totalPrice,
      shipping: shippingCost,
      total: finalTotal,
      orderDate: new Date().toISOString(),
      status: 'pending'
    };

    // Save to Firebase
    const firebaseResult = await firebaseService.addOrder(order);
    
    if (firebaseResult.success) {
      console.log('✅ Order saved to Firebase successfully');
      
      // Also save to localStorage as backup
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      // Trigger new order notification
      simpleNotification.triggerNewOrderEvent(order);
    } else {
      console.error('❌ Failed to save order to Firebase:', firebaseResult.error);
      await showCustomAlert('حدث خطأ في حفظ الطلب. يرجى المحاولة مرة أخرى.', 'error');
      return;
    }

    // Clear cart and form
    clearCart();
    setCustomerData({
      fullName: '',
      lastName: '',
      email: '',
      governorate: '',
      address: '',
      phone1: '',
      phone2: ''
    });
    setShowCustomerForm(false);

    // Navigate to confirmation page with order data
    navigate('/order-confirmation', { state: { order } });
  };


  // Handle Submit order
  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      setShowCustomerForm(true);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    
    try {
      startComponentLoading('submitOrder', 'Processing your order...');
      console.log('🔄 Order submission started - 2 seconds loading...');
      
      // Simulate 2 seconds loading time
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Order processing completed - redirecting to confirmation...');
      
      // Save order and redirect to confirmation page with order data
      await saveOrder();
    } catch (error) {
      console.error('Error submitting order:', error);
      showCustomAlert('Error', 'Failed to submit order. Please try again.', 'error');
    } finally {
      stopComponentLoading('submitOrder');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-content">
          <FaShoppingCart className="cart-empty-icon" />
          <h2>Your cart is empty</h2>
          <p>Add some posters to your cart to get started!</p>
          <Link to="/shop" className="shop-now-btn">
            Browse Posters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {/* Progress Indicator */}
      <div className="checkout-progress">
        <div className="progress-step active">
          <div className="step-number">1</div>
          <span>Personal Information</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step">
          <div className="step-number">2</div>
          <span>Summary</span>
        </div>
      </div>

      <div className="checkout-content">
        {/* Left Column - Billing Information */}
        <div className="billing-section">
          <h2 className="billing-title">Billing Information</h2>
          
          {/* Customer Data Form */}
          {showCustomerForm && (
            <div className="billing-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={customerData.fullName}
                    onChange={handleCustomerDataChange}
                    placeholder="Enter your first name"
                    required
                    className={formErrors.fullName ? 'error' : ''}
                  />
                  {formErrors.fullName && <span className="error-message">{formErrors.fullName}</span>}
                </div>
                
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={customerData.lastName || ''}
                    onChange={handleCustomerDataChange}
                    placeholder="Enter your last name"
                    required
                    className={formErrors.lastName ? 'error' : ''}
                  />
                  {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label>Phone Number 1 *</label>
                <input
                  type="tel"
                  name="phone1"
                  value={customerData.phone1}
                  onChange={handleCustomerDataChange}
                  placeholder="01xxxxxxxxx"
                  required
                  maxLength="11"
                  className={formErrors.phone1 ? 'error' : ''}
                />
                <small className="phone-hint">Please enter your phone number starting with 01 (11 digits total)</small>
                {formErrors.phone1 && <span className="error-message">{formErrors.phone1}</span>}
              </div>
              
              <div className="form-group">
                <label>Phone Number 2 *</label>
                <input
                  type="tel"
                  name="phone2"
                  value={customerData.phone2}
                  onChange={handleCustomerDataChange}
                  placeholder="01xxxxxxxxx"
                  required
                  maxLength="11"
                  className={formErrors.phone2 ? 'error' : ''}
                />
                <small className="phone-hint">Please enter your phone number starting with 01 (11 digits total)</small>
                {formErrors.phone2 && <span className="error-message">{formErrors.phone2}</span>}
              </div>
              
              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={customerData.address}
                  onChange={handleCustomerDataChange}
                  placeholder="Enter your full address"
                  required
                  className={formErrors.address ? 'error' : ''}
                />
                {formErrors.address && <span className="error-message">{formErrors.address}</span>}
              </div>
              
              <div className="form-group">
                <label>Governorate *</label>
                <select
                  name="governorate"
                  value={customerData.governorate}
                  onChange={handleCustomerDataChange}
                  required
                  className={`governorate-select ${formErrors.governorate ? 'error' : ''}`}
                >
                  <option value="">Select Governorate</option>
                  {GOVERNORATES.map((governorate) => (
                    <option key={governorate.value} value={governorate.value}>
                      {governorate.name}
                    </option>
                  ))}
                </select>
                {formErrors.governorate && <span className="error-message">{formErrors.governorate}</span>}
              </div>
              
              <div className="form-group">
                <label>Email Address (Optional) - (اختياري)</label>
                <input
                  type="email"
                  name="email"
                  value={customerData.email}
                  onChange={handleCustomerDataChange}
                  placeholder="Enter your email address (optional)"
                  className={formErrors.email ? 'error' : ''}
                />
                {formErrors.email && <span className="error-message">{formErrors.email}</span>}
              </div>
            </div>
          )}

          <button 
            onClick={handleSubmitOrder} 
            className="confirm-btn"
            disabled={isComponentLoading('submitOrder')}
          >
            {isComponentLoading('submitOrder') ? (
              <>
                <Loading size="small" color="light" showText={false} />
                <span style={{ marginLeft: '8px' }}>Processing...</span>
              </>
            ) : (
              'Confirm'
            )}
          </button>
        </div>

        {/* Right Column - Order Summary */}
        <div className="order-summary-section">
          <div className="order-summary-card">
            <h3>Order Summary</h3>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Product Price</span>
                <span>{totalPrice} EGP</span>
              </div>
              <div className="summary-row">
                <span>Shipping Charge</span>
                <span>{shippingCost} EGP</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{finalTotal} EGP</span>
              </div>
            </div>
          </div>

          {/* Product Cards */}
          <div className="product-cards">
            {cartItems.map((item, index) => (
              <div key={index} className="product-card">
                <div className="product-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="product-info">
                  <h4 className="product-name">{item.name}</h4>
                  <p className="product-brand">{item.category}</p>
                  <p className="product-details">Size: {item.size} | Qty: {item.quantity}</p>
                  <div className="product-price">{item.price * item.quantity} EGP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Custom Alert */}
      {showAlert && (
        <div className="custom-alert">
          <div className="alert-content">
            <span>⚠️ يرجى ملء جميع البيانات المطلوبة</span>
          </div>
        </div>
      )}

      {/* Custom Alert */}
      <CustomAlert
        show={alertState.show}
        message={alertState.message}
        type={alertState.type}
        onConfirm={alertState.onConfirm}
        onCancel={alertState.onCancel}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
      />
    </div>
  );
}

export default Cart;
