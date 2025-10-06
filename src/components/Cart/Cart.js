import React, { useState, useEffect, useCallback } from 'react';
import { FaTrash, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { GOVERNORATES, getShippingCost } from '../../data/governorates';
import firebaseService from '../../services/firebaseService';
import simpleNotification from '../../utils/simpleNotification';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(80);
  const [finalTotal, setFinalTotal] = useState(0);
  
  // Customer data form state
  const [customerData, setCustomerData] = useState({
    fullName: '',
    governorate: '',
    address: '',
    phone1: '',
    phone2: ''
  });
  const [showCustomerForm, setShowCustomerForm] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

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


  // Update quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotals(updatedCart);
    
    // Trigger cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotals(updatedCart);
    
    // Trigger cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
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
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update shipping cost when governorate changes
    if (name === 'governorate') {
      updateShippingCost(value);
    }
  };

  // Validate customer data
  const validateCustomerData = () => {
    const { fullName, governorate, address, phone1 } = customerData;
    return fullName.trim() && governorate.trim() && address.trim() && phone1.trim();
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
      alert('حدث خطأ في حفظ الطلب. يرجى المحاولة مرة أخرى.');
      return;
    }

    // Clear cart and form
    clearCart();
    setCustomerData({
      fullName: '',
      governorate: '',
      address: '',
      phone1: '',
      phone2: ''
    });
    setShowCustomerForm(false);

  };


  // Handle Submit order
  const handleSubmitOrder = () => {
    if (!validateCustomerData()) {
      setShowCustomerForm(true);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    
    // Save order and redirect to confirmation page
    saveOrder();
    navigate('/order-confirmation');
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
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>You have {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div 
                className="item-image clickable" 
                onClick={() => window.location.href = `/product/${item.productId}`}
                title="Click to view poster details"
              >
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="item-details">
                <h3 
                  className="clickable-title"
                  onClick={() => window.location.href = `/product/${item.productId}`}
                  title="Click to view poster details"
                >
                  {item.name}
                </h3>
                <p className="item-category">{item.category}</p>
                <p className="item-size">Size: {item.size}</p>
                <p className="item-color">
                  Color: {item.color} 
                  {item.color === 'Classic Black' ? ' 🖤' : 
                   item.color === 'Pure White' ? ' 🤍' : ' 🤎'}
                </p>
              </div>

              <div className="item-quantity">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-number">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              <div className="item-price">
                <p className="price-per-item">{item.price} EGP</p>
                <p className="price-total">{item.price * item.quantity} EGP</p>
              </div>

              <button 
                onClick={() => removeItem(item.id)}
                className="remove-btn"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          
          {/* Items List */}
          <div className="order-items-list">
            {cartItems.map((item, index) => (
              <div key={index} className="order-item-card">
                <div className="item-bar"></div>
                <div className="item-content">
                  <div className="item-info">
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-category">{item.category}</p>
                    <p className="item-details">Size: {item.size} | Color: {item.color} | Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-pricing">
                    <p className="item-price-breakdown">{item.price} EGP × {item.quantity} =</p>
                    <p className="item-total-price">{item.price * item.quantity} EGP</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Customer Data Form */}
          {showCustomerForm && (
            <div className="customer-form">
              <h4>ادخل بياناتك</h4>
              <div className="form-group">
                <label>الاسم الكامل *</label>
                <input
                  type="text"
                  name="fullName"
                  value={customerData.fullName}
                  onChange={handleCustomerDataChange}
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>المحافظة *</label>
                <select
                  name="governorate"
                  value={customerData.governorate}
                  onChange={handleCustomerDataChange}
                  required
                  className="governorate-select"
                >
                  <option value="">اختر المحافظة</option>
                  {GOVERNORATES.map((governorate) => (
                    <option key={governorate.value} value={governorate.value}>
                      {governorate.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>العنوان التفصيلي *</label>
                <textarea
                  name="address"
                  value={customerData.address}
                  onChange={handleCustomerDataChange}
                  placeholder="أدخل العنوان التفصيلي"
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>رقم التليفون *</label>
                <input
                  type="tel"
                  name="phone1"
                  value={customerData.phone1}
                  onChange={handleCustomerDataChange}
                  placeholder="رقم التليفون الأساسي"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>رقم التليفون البديل</label>
                <input
                  type="tel"
                  name="phone2"
                  value={customerData.phone2}
                  onChange={handleCustomerDataChange}
                  placeholder="رقم تليفون إضافي"
                />
              </div>
            </div>
          )}

          {/* Cost Summary - Now after customer form */}
          <div className="cost-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{totalPrice} EGP</span>
            </div>
            
            <div className="summary-row shipping">
              <span>Shipping: {customerData.governorate ? GOVERNORATES.find(g => g.value === customerData.governorate)?.name : '??'}</span>
              <span>+{shippingCost} EGP</span>
            </div>
            
            <div className="summary-divider"></div>
            
            {(customerData.fullName && customerData.governorate && customerData.address && customerData.phone1) && (
              <div className="summary-row total">
                <span>Total:</span>
                <span>{finalTotal} EGP</span>
              </div>
            )}
          </div>

          <div className="cart-actions">
            <button onClick={clearCart} className="clear-cart-btn">
              Clear Cart
            </button>
            <button onClick={handleSubmitOrder} className="submit-order-btn">
              <FaCheckCircle />
              Submit
            </button>
          </div>

          <div className="shipping-info">
            <h4>🚚 Shipping Information</h4>
            <p>• Shipping Cost: {shippingCost} EGP</p>
            <p>• Delivery to the mentioned address</p>
            <p>• Expected Delivery Time: 2-6 working days</p>
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
    </div>
  );
}

export default Cart;
