import React from 'react';
import './PrintOrder.css';

const PrintOrder = ({ order, onClose }) => {
  if (!order) return null;

  // Calculate estimated delivery date (3-5 business days)
  const calculateDeliveryDate = () => {
    const orderDate = new Date(order.timestamp || order.date || new Date());
    const deliveryDays = 4; // 4 business days average
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format order date
  const formatOrderDate = () => {
    const orderDate = new Date(order.timestamp || order.date || new Date());
    return orderDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get customer data - check multiple possible structures
  const customer = order.customer || order.customerData || {};
  
  // Debug: Log customer data to console
  console.log('🔍 Print Order - Customer Data:', customer);
  console.log('🔍 Print Order - Full Order:', order);
  console.log('🔍 Print Order - Customer Keys:', Object.keys(customer));
  console.log('🔍 Print Order - Order Keys:', Object.keys(order));
  
  // Calculate totals
  const subtotal = order.subtotal || (order.total - (order.shipping || order.shippingCost || 0)) || 0;
  const shipping = order.shipping || order.shippingCost || 0;
  const total = order.total || order.finalTotal || (subtotal + shipping);

  const handlePrintAll = () => {
    // Simple print - show all content in one page
    console.log('🖨️ Printing complete order with customer data...');
    window.print();
  };


  return (
    <div className="print-order-container">
      {/* Print Buttons - Hidden in Print */}
      <div className="print-actions no-print">
        <button onClick={handlePrintAll} className="print-btn primary">
          🖨️ Print Order
        </button>
        <button onClick={onClose} className="close-btn">
          ✕ Close
        </button>
      </div>

      {/* Complete Print Content */}
      <div className="print-content">
        {/* Header */}
        <div className="print-header">
          <div className="logo-section">
            <h1>WallZ</h1>
            <p>Premium Posters for Your Walls</p>
          </div>
          <div className="order-info">
            <h2>Order Summary</h2>
            <p className="order-number">Order #: {order.id.slice(-8).toUpperCase()}</p>
            <p className="order-date">Date: {formatOrderDate()}</p>
            <p className="order-status">Status: <span className={`status-${order.status}`}>{order.status}</span></p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="print-section">
          <h3>👤 Customer Information</h3>
          <div className="customer-grid">
            <div className="customer-item">
              <strong>Full Name:</strong>
              <span>{customer.fullName || customer.name || (customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : 'N/A')}</span>
            </div>
            <div className="customer-item">
              <strong>Phone Number:</strong>
              <span>{customer.phone1 || customer.phone || customer.phoneNumber || 'N/A'}</span>
            </div>
            {(customer.phone2 && customer.phone2.trim()) && (
              <div className="customer-item">
                <strong>Alternative Phone:</strong>
                <span>{customer.phone2}</span>
              </div>
            )}
            <div className="customer-item">
              <strong>Email:</strong>
              <span>{customer.email || 'N/A'}</span>
            </div>
            <div className="customer-item">
              <strong>Governorate:</strong>
              <span>{customer.governorate || customer.city || 'N/A'}</span>
            </div>
            <div className="customer-item full-width">
              <strong>Full Address:</strong>
              <span>{customer.address || customer.fullAddress || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="print-section">
          <h3>🛍️ Ordered Items</h3>
          <div className="items-table">
            <div className="table-header">
              <div className="col-image">Image</div>
              <div className="col-details">Product Details</div>
              <div className="col-quantity">Qty</div>
              <div className="col-price">Price</div>
              <div className="col-total">Total</div>
            </div>
            {order.items.map((item, index) => (
              <div key={index} className="table-row">
                <div className="col-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="col-details">
                  <h4>{item.name}</h4>
                  <p>{item.category} - {item.size}</p>
                  <p>Color: {item.color}</p>
                </div>
                <div className="col-quantity">
                  {item.quantity}
                </div>
                <div className="col-price">
                  ${item.price}
                </div>
                <div className="col-total">
                  ${item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="print-section">
          <h3>💰 Order Summary</h3>
          <div className="summary-table">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping Cost:</span>
              <span>${shipping}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>${total}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="print-section">
          <h3>📦 Delivery Information</h3>
          <div className="delivery-info">
            <div className="delivery-item">
              <strong>Estimated Delivery Date:</strong>
              <span>{calculateDeliveryDate()}</span>
            </div>
            <div className="delivery-item">
              <strong>Delivery Address:</strong>
              <span>{customer.address || 'N/A'}, {customer.governorate || 'N/A'}</span>
            </div>
            <div className="delivery-item">
              <strong>Contact Phone:</strong>
              <span>{customer.phone1 || 'N/A'}</span>
            </div>
            <div className="delivery-item">
              <strong>Delivery Status:</strong>
              <span className={`delivery-status-${order.status}`}>
                {order.status === 'pending' && 'Preparing for shipment'}
                {order.status === 'confirmed' && 'Confirmed - Processing'}
                {order.status === 'shipped' && 'Shipped - In transit'}
                {order.status === 'delivered' && 'Delivered successfully'}
                {order.status === 'cancelled' && 'Order cancelled'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="print-footer">
          <div className="footer-info">
            <h4>Thank you for choosing WallZ!</h4>
            <p>For any inquiries, please contact us at:</p>
            <p>📧 Email: wallz.egy@gmail.com</p>
            <p>📱 Phone: +20 1112659808</p>
          </div>
          <div className="footer-note">
            <p><strong>Note:</strong> This is a computer-generated order summary. Please keep this document for your records.</p>
            <p>Delivery times may vary based on location and external factors.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintOrder;
