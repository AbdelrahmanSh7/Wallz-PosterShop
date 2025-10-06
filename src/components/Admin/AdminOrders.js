import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaUser, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaCalendarAlt,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaSignOutAlt,
  FaFilter,
  FaSearch,
  FaFileExcel
} from 'react-icons/fa';
import ExcelJS from 'exceljs';
import { sendStatusUpdateNotification } from '../../utils/emailService';
import firebaseService from '../../services/firebaseService';
import simpleNotification from '../../utils/simpleNotification';
import { testFirebaseConnection } from '../../utils/firebaseTest';
import './AdminOrders.css';

function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  // Load orders from Firebase
  useEffect(() => {
    const loadOrders = async () => {
      // Test Firebase connection first
      const connectionTest = await testFirebaseConnection();
      if (!connectionTest.success) {
        console.error('❌ Firebase connection failed:', connectionTest.error);
        alert('Firebase connection failed. Please check your configuration.');
        return;
      }

      const result = await firebaseService.getOrders();
      if (result.success) {
        setOrders(result.orders);
        setFilteredOrders(result.orders);
        console.log('✅ Orders loaded from Firebase:', result.orders.length);
      } else {
        console.error('❌ Failed to load orders from Firebase:', result.error);
        // Fallback to localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(savedOrders);
        setFilteredOrders(savedOrders);
      }
    };

    loadOrders();
  }, []);

  // Listen for Firebase real-time updates
  useEffect(() => {
    const handleFirebaseUpdate = (event) => {
      console.log('🔥 Firebase orders updated:', event.detail.orders.length);
      
      setOrders(event.detail.orders);
      setFilteredOrders(event.detail.orders);
      
      // Show notification for new orders
      if (event.detail.orders.length > orders.length) {
        console.log('🛍️ New order detected via Firebase!');
      }
    };

    // Add event listener
    window.addEventListener('firebaseOrdersUpdate', handleFirebaseUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('firebaseOrdersUpdate', handleFirebaseUpdate);
    };
  }, [orders.length]);

  // Auto-export to Excel every 5 minutes
  useEffect(() => {
    const autoExportInterval = setInterval(() => {
      if (orders.length > 0) {
        // Silent auto-export without user notification
        const autoExport = async () => {
          try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Orders');

            // Add headers
            worksheet.columns = [
              { header: 'Order ID', key: 'id', width: 15 },
              { header: 'Date', key: 'date', width: 20 },
              { header: 'Customer Name', key: 'customerName', width: 25 },
              { header: 'Phone 1', key: 'phone1', width: 15 },
              { header: 'Phone 2', key: 'phone2', width: 15 },
              { header: 'Governorate', key: 'governorate', width: 20 },
              { header: 'Address', key: 'address', width: 30 },
              { header: 'Status', key: 'status', width: 15 },
              { header: 'Items Count', key: 'itemsCount', width: 12 },
              { header: 'Subtotal', key: 'subtotal', width: 15 },
              { header: 'Shipping', key: 'shipping', width: 15 },
              { header: 'Total', key: 'total', width: 15 },
              { header: 'Items Details', key: 'itemsDetails', width: 50 }
            ];

            // Style headers
            worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
            worksheet.getRow(1).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFE1306C' }
            };

            // Add data rows
            orders.forEach(order => {
              const customer = order.customer || order.customerData || {};
              const itemsDetails = order.items?.map(item => 
                `${item.name} (${item.size}, ${item.color}) x${item.quantity} = ${item.price * item.quantity} EGP`
              ).join('; ') || 'No items';

              worksheet.addRow({
                id: order.id,
                date: new Date(order.date).toLocaleDateString('en-GB'),
                customerName: customer.fullName || 'N/A',
                phone1: customer.phone1 || 'N/A',
                phone2: customer.phone2 || 'N/A',
                governorate: customer.governorate || 'N/A',
                address: customer.address || 'N/A',
                status: order.status,
                itemsCount: order.items?.length || 0,
                subtotal: order.subtotal || (order.total - (order.shipping || order.shippingCost || 0)) || 0,
                shipping: order.shipping || order.shippingCost || 0,
                total: order.total || order.finalTotal || 0,
                itemsDetails: itemsDetails
              });
            });

            // Auto-fit columns
            worksheet.columns.forEach(column => {
              column.width = Math.max(column.width, 10);
            });

            // Add summary row
            const summaryRow = worksheet.addRow({});
            summaryRow.getCell(1).value = 'SUMMARY';
            summaryRow.getCell(1).font = { bold: true };
            
            summaryRow.getCell(9).value = `Total Orders: ${getTotalOrders()}`;
            summaryRow.getCell(10).value = `Total Revenue: ${getTotalRevenue()} EGP`;
            summaryRow.getCell(9).font = { bold: true };
            summaryRow.getCell(10).font = { bold: true };

            // Generate and download file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `orders_auto_${new Date().toISOString().split('T')[0]}_${new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '-')}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error('Auto-export error:', error);
          }
        };
        
        autoExport();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(autoExportInterval);
  }, [orders]);

  // Sort orders function
  const sortOrders = (ordersToSort, sortType) => {
    const sorted = [...ordersToSort];
    
    switch (sortType) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'highest':
        return sorted.sort((a, b) => (b.total || b.finalTotal || 0) - (a.total || a.finalTotal || 0));
      case 'lowest':
        return sorted.sort((a, b) => (a.total || a.finalTotal || 0) - (b.total || b.finalTotal || 0));
      case 'name-asc':
        return sorted.sort((a, b) => {
          const nameA = (a.customer?.fullName || a.customerData?.fullName || '').toLowerCase();
          const nameB = (b.customer?.fullName || b.customerData?.fullName || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
      case 'name-desc':
        return sorted.sort((a, b) => {
          const nameA = (a.customer?.fullName || a.customerData?.fullName || '').toLowerCase();
          const nameB = (b.customer?.fullName || b.customerData?.fullName || '').toLowerCase();
          return nameB.localeCompare(nameA);
        });
      default:
        return sorted;
    }
  };

  // Filter and sort orders
  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        (order.customer?.fullName || order.customerData?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer?.phone1 || order.customerData?.phone1 || '').includes(searchTerm) ||
        (order.customer?.governorate || order.customerData?.governorate || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Sort orders
    const sorted = sortOrders(filtered, sortBy);
    setFilteredOrders(sorted);
  }, [orders, searchTerm, statusFilter, sortBy]);

  const updateOrderStatus = async (orderId, newStatus) => {
    const order = orders.find(order => order.id === orderId);
    const oldStatus = order?.status;
    
    // Update in Firebase
    const firebaseResult = await firebaseService.updateOrderStatus(orderId, newStatus);
    
    if (firebaseResult.success) {
      console.log(`✅ Order ${orderId} status updated to ${newStatus} in Firebase`);
      
      // Also update localStorage as backup
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Send status update notification
      if (order && oldStatus !== newStatus) {
        sendStatusUpdateNotification(order, oldStatus, newStatus).then(result => {
          if (result.success) {
            console.log('Status update notification sent successfully');
          } else {
            console.error('Failed to send status update notification:', result.error);
          }
        });
      }
    } else {
      console.error('❌ Failed to update order status in Firebase:', firebaseResult.error);
      alert('حدث خطأ في تحديث حالة الطلب. يرجى المحاولة مرة أخرى.');
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      // Delete from Firebase
      const firebaseResult = await firebaseService.deleteOrder(orderId);
      
      if (firebaseResult.success) {
        console.log(`✅ Order ${orderId} deleted from Firebase successfully`);
        
        // Also update localStorage as backup
        const updatedOrders = orders.filter(order => order.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
      } else {
        console.error('❌ Failed to delete order from Firebase:', firebaseResult.error);
        alert('حدث خطأ في حذف الطلب. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    navigate('/admin/login');
  };

  // Manual refresh function
  const handleManualRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    
    // Reload orders from Firebase
    const result = await firebaseService.getOrders();
    
    if (result.success) {
      setOrders(result.orders);
      setFilteredOrders(result.orders);
      
      // Show success message
      alert(`✅ Orders refreshed successfully!\nFound ${result.orders.length} orders from Firebase.`);
      console.log(`✅ Found ${result.orders.length} orders from Firebase`);
    } else {
      console.error('❌ Failed to refresh orders from Firebase:', result.error);
      
      // Fallback to localStorage
      const updatedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      
      alert(`⚠️ Firebase unavailable, using local data.\nFound ${updatedOrders.length} orders.`);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#27ae60';
      case 'shipped': return '#3498db';
      case 'delivered': return '#2ecc71';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getTotalOrders = () => orders.length;
  const getTotalRevenue = () => {
    return orders.reduce((sum, order) => {
      // استبعاد الطلبات الملغية
      if (order.status === 'cancelled') {
        return sum;
      }
      
      // حساب السعر بدون الشحن (subtotal فقط)
      const subtotal = order.subtotal || (order.total - (order.shipping || order.shippingCost || 0)) || 0;
      return sum + subtotal;
    }, 0);
  };

  // Export orders to Excel
  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Orders');

      // Add headers
      worksheet.columns = [
        { header: 'Order ID', key: 'id', width: 15 },
        { header: 'Date', key: 'date', width: 20 },
        { header: 'Customer Name', key: 'customerName', width: 25 },
        { header: 'Phone 1', key: 'phone1', width: 15 },
        { header: 'Phone 2', key: 'phone2', width: 15 },
        { header: 'Governorate', key: 'governorate', width: 20 },
        { header: 'Address', key: 'address', width: 30 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Items Count', key: 'itemsCount', width: 12 },
        { header: 'Subtotal', key: 'subtotal', width: 15 },
        { header: 'Shipping', key: 'shipping', width: 15 },
        { header: 'Total', key: 'total', width: 15 },
        { header: 'Items Details', key: 'itemsDetails', width: 50 }
      ];

      // Style headers
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE1306C' }
      };

      // Add data rows
      orders.forEach(order => {
        const customer = order.customer || order.customerData || {};
        const itemsDetails = order.items?.map(item => 
          `${item.name} (${item.size}, ${item.color}) x${item.quantity} = ${item.price * item.quantity} EGP`
        ).join('; ') || 'No items';

        worksheet.addRow({
          id: order.id,
          date: new Date(order.date).toLocaleDateString('en-GB'),
          customerName: customer.fullName || 'N/A',
          phone1: customer.phone1 || 'N/A',
          phone2: customer.phone2 || 'N/A',
          governorate: customer.governorate || 'N/A',
          address: customer.address || 'N/A',
          status: order.status,
          itemsCount: order.items?.length || 0,
          subtotal: order.subtotal || (order.total - (order.shipping || order.shippingCost || 0)) || 0,
          shipping: order.shipping || order.shippingCost || 0,
          total: order.total || order.finalTotal || 0,
          itemsDetails: itemsDetails
        });
      });

      // Auto-fit columns
      worksheet.columns.forEach(column => {
        column.width = Math.max(column.width, 10);
      });

      // Add summary row
      const summaryRow = worksheet.addRow({});
      summaryRow.getCell(1).value = 'SUMMARY';
      summaryRow.getCell(1).font = { bold: true };
      
      summaryRow.getCell(9).value = `Total Orders: ${getTotalOrders()}`;
      summaryRow.getCell(10).value = `Total Revenue: ${getTotalRevenue()} EGP`;
      summaryRow.getCell(9).font = { bold: true };
      summaryRow.getCell(10).font = { bold: true };

      // Generate and download file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting to Excel. Please try again.');
    }
  };

  return (
    <div className="admin-orders-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>📊 Orders Management</h1>
          <div className="admin-stats">
            <div className="stat-card">
              <FaShoppingCart />
              <div>
                <span className="stat-number">{getTotalOrders()}</span>
                <span className="stat-label">Total Orders</span>
              </div>
            </div>
            <div className="stat-card">
              <FaCheckCircle />
              <div>
                <span className="stat-number">${getTotalRevenue()}</span>
                <span className="stat-label">Total Revenue</span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name, phone, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <FaFilter />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="sort-box">
          <FaFilter />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">🕒 Newest First</option>
            <option value="oldest">🕐 Oldest First</option>
            <option value="highest">💰 Highest Price</option>
            <option value="lowest">💵 Lowest Price</option>
            <option value="name-asc">👤 Name A-Z</option>
            <option value="name-desc">👤 Name Z-A</option>
          </select>
        </div>
        <button onClick={handleManualRefresh} className="refresh-btn">
          🔄
          Refresh Orders
        </button>
        <button onClick={exportToExcel} className="export-excel-btn">
          <FaFileExcel />
          Export to Excel
        </button>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <FaShoppingCart />
            <h3>No Orders Found</h3>
            <p>No orders match the specified criteria</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id.slice(-6)}</h3>
                  <span className="order-date">
                    <FaCalendarAlt />
                    {formatDate(order.orderDate)}
                  </span>
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              <div className="order-customer">
                <div className="customer-info">
                  <FaUser />
                  <span>{order.customer?.fullName || order.customerData?.fullName || 'N/A'}</span>
                </div>
                <div className="customer-location">
                  <FaMapMarkerAlt />
                  <span>{order.customer?.governorate || order.customerData?.governorate || 'N/A'}</span>
                </div>
                <div className="customer-phone">
                  <FaPhone />
                  <span>{order.customer?.phone1 || order.customerData?.phone1 || 'N/A'}</span>
                </div>
              </div>

              <div className="order-summary">
                <div className="order-items">
                  <span>{order.items.length} items</span>
                  <div className="items-preview">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="item-preview">
                        <div className="item-image">
                          <Link 
                            to={`/product/${item.productId}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img 
                              src={item.image || `/images/${item.productId}.jpg`} 
                              alt={item.name}
                              className="poster-thumbnail"
                              onError={(e) => {
                                e.target.src = '/images/placeholder.jpg';
                              }}
                            />
                          </Link>
                        </div>
                        <div className="item-details">
                          <Link 
                            to={`/product/${item.productId}`} 
                            className="item-name-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.name}
                          </Link>
                          <span className="item-category">{item.category}</span>
                          <span className="item-specs">Size: {item.size} | Color: {item.color}</span>
                        </div>
                        <div className="item-quantity">x{item.quantity}</div>
                        <div className="item-price">${item.price * item.quantity}</div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="more-items">+{order.items.length - 3} more items</div>
                    )}
                  </div>
                </div>
                <div className="order-total">
                  <span>${order.total || order.finalTotal || 0}</span>
                </div>
              </div>


              <div className="order-actions">
                <button 
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderDetails(true);
                  }}
                  className="view-btn"
                >
                  <FaEye />
                  View Details
                </button>
                
                <div className="status-actions">
                  <select 
                    value={order.status} 
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="confirmed">✅ Confirmed</option>
                    <option value="shipped">🚚 Shipped</option>
                    <option value="delivered">📦 Delivered</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </div>

                <button 
                  onClick={() => deleteOrder(order.id)}
                  className="delete-btn"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details #{selectedOrder.id.slice(-6)}</h2>
              <button 
                onClick={() => setShowOrderDetails(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="customer-details">
                <h3>👤 Customer Information</h3>
                <div className="detail-row">
                  <strong>Full Name:</strong>
                  <span>{selectedOrder.customer?.fullName || selectedOrder.customerData?.fullName || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <strong>Governorate:</strong>
                  <span>{selectedOrder.customer?.governorate || selectedOrder.customerData?.governorate || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <strong>Address:</strong>
                  <span>{selectedOrder.customer?.address || selectedOrder.customerData?.address || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <strong>Phone 1:</strong>
                  <span>{selectedOrder.customer?.phone1 || selectedOrder.customerData?.phone1 || 'N/A'}</span>
                </div>
                {(selectedOrder.customer?.phone2 || selectedOrder.customerData?.phone2) && (
                  <div className="detail-row">
                    <strong>Phone 2:</strong>
                    <span>{selectedOrder.customer?.phone2 || selectedOrder.customerData?.phone2}</span>
                  </div>
                )}
              </div>

              <div className="order-items-details">
                <h3>🛍️ Ordered Items</h3>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="item-detail">
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>{item.category} - {item.size}</p>
                      <p>Color: {item.color}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-total-details">
                <h3>💰 Order Summary</h3>
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${selectedOrder.subtotal || selectedOrder.totalPrice || 0}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>${selectedOrder.shipping || selectedOrder.shippingCost || 0}</span>
                </div>
                <div className="total-row final">
                  <span>Total:</span>
                  <span>${selectedOrder.total || selectedOrder.finalTotal || 0}</span>
                </div>
              </div>
            </div>
            
            {/* Print Button */}
            <div className="modal-actions">
              <button 
                onClick={() => window.print()} 
                className="print-order-btn"
              >
                🖨️ Print Order
              </button>
              <button 
                onClick={() => setShowOrderDetails(false)} 
                className="close-modal-btn"
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
