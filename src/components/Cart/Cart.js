import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaTrash, FaShoppingCart, FaTruck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingCost] = useState(80);
  const [finalTotal, setFinalTotal] = useState(0);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCartItems(items);
      calculateTotals(items);
    }
  }, []);

  // Calculate totals whenever cart changes
  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(subtotal);
    setFinalTotal(subtotal + shippingCost);
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
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotals(updatedCart);
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    setTotalPrice(0);
    setFinalTotal(0);
  };

  // Generate WhatsApp message for multiple orders
  const generateWhatsAppMessage = () => {
    if (cartItems.length === 0) return '';

    let message = `Hi, I want to order multiple posters:\n\n`;
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.category} : ${item.name} (${item.size})\n`;
      message += `   Color: ${item.color} ${item.color === 'Classic Black' ? '🖤' : item.color === 'Pure White' ? '🤍' : '🤎'}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ${item.price} EGP x ${item.quantity} = ${item.price * item.quantity} EGP\n`;
      message += `   Link: ${window.location.origin}/product/${item.productId}\n\n`;
    });

    message += `📊 Order Summary:\n`;
    message += `Subtotal: ${totalPrice} EGP\n`;
    message += `Shipping: +${shippingCost} EGP\n`;
    message += `Final Total: ${finalTotal} EGP\n\n`;
    message += `🚚 Shipping Details: +${shippingCost} EGP\n`;
    message += `📍 Delivery to your address\n\n`;
    message += `Please confirm my order.`;

    return message;
  };

  // Handle WhatsApp order
  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/201112659808?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
          
          <div className="summary-row">
            <span>Items ({cartItems.length}):</span>
            <span>{totalPrice} EGP</span>
          </div>
          
          <div className="summary-row shipping">
            <span>
              <FaTruck /> Shipping
            </span>
            <span>+{shippingCost} EGP</span>
          </div>
          
          <div className="summary-row total">
            <span>Total:</span>
            <span>{finalTotal} EGP</span>
          </div>

          <div className="cart-actions">
            <button onClick={clearCart} className="clear-cart-btn">
              Clear Cart
            </button>
            <button onClick={handleWhatsAppOrder} className="order-whatsapp-btn">
              <FaWhatsapp />
              Order via WhatsApp
            </button>
          </div>

          <div className="shipping-info">
            <h4>🚚 Shipping Information</h4>
            <p>• Shipping cost: {shippingCost} EGP</p>
            <p>• Delivery to your address</p>
            <p>• Estimated delivery: 2-5 business days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
