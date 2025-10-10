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
  FaTrash,
  FaFilter,
  FaSearch,
  FaFileExcel
} from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';
import ExcelJS from 'exceljs';
import { sendStatusUpdateNotification } from '../../utils/emailService';
import firebaseService from '../../services/firebaseService';
import PrintOrder from './PrintOrder';
import emailService from '../../services/emailService';
import notificationService from '../../services/notificationService';
import { useCustomAlert } from '../../hooks/useCustomAlert';
import CustomAlert from '../CustomAlert/CustomAlert';
import { testFirebaseConnection } from '../../utils/firebaseTest';
import { useLoadingContext } from '../Loading/LoadingProvider';
import Loading from '../Loading/Loading';
import Notification from '../Notification/Notification';
import PasswordDialog from '../PasswordDialog/PasswordDialog';
import NotificationManager from '../Notifications/NotificationManager';
import './AdminOrders.css';

function AdminOrders() {
  const navigate = useNavigate();
  const { alertState, showAlert } = useCustomAlert();
  const { startComponentLoading, stopComponentLoading, isComponentLoading } = useLoadingContext();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [newOrders, setNewOrders] = useState(new Set());
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [deletedOrdersCount, setDeletedOrdersCount] = useState(0);
  const [showNotificationManager, setShowNotificationManager] = useState(false);
  const [showPrintOrder, setShowPrintOrder] = useState(false);
  const [printOrderData, setPrintOrderData] = useState(null);

  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  // Update deleted orders count and auto-refresh
  useEffect(() => {
    const updateDeletedCount = () => {
      const deleted = JSON.parse(localStorage.getItem('deletedOrders') || '[]');
      setDeletedOrdersCount(deleted.length);
    };
    
    updateDeletedCount();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      updateDeletedCount();
    };
    
    // Auto-refresh orders every 30 seconds for cross-device sync
    const refreshInterval = setInterval(async () => {
      try {
        console.log('🔄 Auto-refreshing orders for cross-device sync...');
        const result = await firebaseService.getOrders();
        if (result.success) {
          // Get deleted orders from Firebase for cross-device sync
          const deletedOrdersResult = await firebaseService.getDeletedOrders();
          let deletedOrderIds = [];
          
          if (deletedOrdersResult.success) {
            const firebaseDeletedOrders = deletedOrdersResult.deletedOrders || [];
            deletedOrderIds = firebaseDeletedOrders.map(order => order.originalId || order.id);
            // Update localStorage with Firebase data
            localStorage.setItem('deletedOrders', JSON.stringify(firebaseDeletedOrders));
            setDeletedOrdersCount(firebaseDeletedOrders.length);
            console.log('✅ Deleted orders synced from Firebase:', firebaseDeletedOrders.length);
          } else {
            // Fallback to localStorage
            deletedOrderIds = JSON.parse(localStorage.getItem('deletedOrders') || '[]').map(order => order.originalId || order.id);
          }
          
          const activeOrders = result.orders.filter(order => !deletedOrderIds.includes(order.id));
          
          // Only update if orders have changed
          if (JSON.stringify(activeOrders) !== JSON.stringify(orders)) {
            setOrders(activeOrders);
            setFilteredOrders(activeOrders);
            console.log('🔄 Orders updated from Firebase:', activeOrders.length);
          }
        }
      } catch (error) {
        console.error('❌ Auto-refresh failed:', error);
      }
    }, 30000); // Refresh every 30 seconds
    
    // Listen for custom orders update event
    const handleOrdersUpdate = () => {
      console.log('🔄 Orders update event received, refreshing...');
      // Trigger a manual refresh
      window.location.reload();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ordersUpdated', handleOrdersUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ordersUpdated', handleOrdersUpdate);
      clearInterval(refreshInterval);
    };
  }, [orders]);

  // Helper function to clean deleted orders from localStorage
  const cleanDeletedOrdersFromStorage = () => {
    const deletedOrderIds = JSON.parse(localStorage.getItem('deletedOrders') || '[]').map(order => order.originalId || order.id);
    const currentOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const activeOrders = currentOrders.filter(order => !deletedOrderIds.includes(order.id));
    localStorage.setItem('orders', JSON.stringify(activeOrders));
    console.log('🧹 Cleaned deleted orders from localStorage');
  };

  // Hide notification when admin panel is opened
  useEffect(() => {
    if (window.location.pathname.includes('/admin/orders')) {
      setShowNotification(false);
    }
  }, []);


  // Load orders from Firebase
  useEffect(() => {
    const loadOrders = async () => {
      try {
        startComponentLoading('loadOrders', 'Loading orders...');
        
        // Test Firebase connection first
        const connectionTest = await testFirebaseConnection();
        if (!connectionTest.success) {
          console.error('❌ Firebase connection failed:', connectionTest.error);
          alert('Firebase connection failed. Please check your configuration.');
          return;
        }

        const result = await firebaseService.getOrders();
        if (result.success) {
          // Get deleted orders from Firebase for cross-device sync
          const deletedOrdersResult = await firebaseService.getDeletedOrders();
          let deletedOrderIds = [];
          
          if (deletedOrdersResult.success) {
            const firebaseDeletedOrders = deletedOrdersResult.deletedOrders || [];
            deletedOrderIds = firebaseDeletedOrders.map(order => order.originalId || order.id);
            // Update localStorage with Firebase data
            localStorage.setItem('deletedOrders', JSON.stringify(firebaseDeletedOrders));
            setDeletedOrdersCount(firebaseDeletedOrders.length);
            console.log('✅ Deleted orders synced from Firebase:', firebaseDeletedOrders.length);
          } else {
            // Fallback to localStorage
            deletedOrderIds = JSON.parse(localStorage.getItem('deletedOrders') || '[]').map(order => order.originalId || order.id);
            console.log('⚠️ Using localStorage deleted orders as fallback');
          }
          
          const activeOrders = result.orders.filter(order => !deletedOrderIds.includes(order.id));
          
          setOrders(activeOrders);
          setFilteredOrders(activeOrders);
          console.log('✅ Orders loaded from Firebase:', activeOrders.length, '(filtered out deleted orders)');
          
          // Mark new orders (created in last 24 hours)
          const now = new Date();
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          const newOrderIds = activeOrders
            .filter(order => new Date(order.date) > oneDayAgo)
            .map(order => order.id);
          setNewOrders(new Set(newOrderIds));
          
          // Show notification if there are new orders and admin panel is not currently open
          const isAdminPanelOpen = window.location.pathname.includes('/admin/orders');
          if (newOrderIds.length > 0 && !isAdminPanelOpen) {
            setNotificationCount(newOrderIds.length);
            setShowNotification(true);
          }
        } else {
          console.error('❌ Failed to load orders from Firebase:', result.error);
          // Fallback to localStorage
          const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
          // Filter out deleted orders from localStorage too
          const deletedOrderIds = JSON.parse(localStorage.getItem('deletedOrders') || '[]').map(order => order.originalId || order.id);
          const activeOrders = savedOrders.filter(order => !deletedOrderIds.includes(order.id));
          
          setOrders(activeOrders);
          setFilteredOrders(activeOrders);
          
          // Check for new orders in localStorage
          const now = new Date();
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          const newOrderIds = activeOrders
            .filter(order => new Date(order.date) > oneDayAgo)
            .map(order => order.id);
          setNewOrders(new Set(newOrderIds));
          
          // Show notification if there are new orders
          const isAdminPanelOpen = window.location.pathname.includes('/admin/orders');
          if (newOrderIds.length > 0 && !isAdminPanelOpen) {
            setNotificationCount(newOrderIds.length);
            setShowNotification(true);
          }
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        // Fallback to localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(savedOrders);
        setFilteredOrders(savedOrders);
        
        // Check for new orders in localStorage
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const newOrderIds = savedOrders
          .filter(order => new Date(order.date) > oneDayAgo)
          .map(order => order.id);
        setNewOrders(new Set(newOrderIds));
        
        // Show notification if there are new orders
        const isAdminPanelOpen = window.location.pathname.includes('/admin/orders');
        if (newOrderIds.length > 0 && !isAdminPanelOpen) {
          setNotificationCount(newOrderIds.length);
          setShowNotification(true);
        }
      } finally {
        stopComponentLoading('loadOrders');
      }
    };

    loadOrders();
  }, []);

  // Listen for Firebase real-time updates
  useEffect(() => {
    console.log('👂 Setting up Firebase real-time listener...');
    
    const unsubscribe = firebaseService.subscribeToOrders((result) => {
      if (result.success) {
        console.log('🔥 Firebase orders updated:', result.orders.length);
        
        setOrders(result.orders);
        setFilteredOrders(result.orders);
        
        // Mark new orders (created in last 24 hours)
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const newOrderIds = result.orders
          .filter(order => new Date(order.date) > oneDayAgo)
          .map(order => order.id);
        setNewOrders(new Set(newOrderIds));
        
        // Show notification for new orders
        if (result.orders.length > orders.length) {
          console.log('🛍️ New order detected via Firebase!');
          const isAdminPanelOpen = window.location.pathname.includes('/admin/orders');
          if (newOrderIds.length > 0 && !isAdminPanelOpen) {
            setNotificationCount(newOrderIds.length);
            setShowNotification(true);
          }
        }
      } else {
        console.error('❌ Firebase real-time listener error:', result.error);
      }
    });

    // Hide NEW badges after 5 seconds
    const hideNewBadges = () => {
      setTimeout(() => {
        setNewOrders(new Set());
      }, 5000);
    };

    hideNewBadges();

    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [orders.length]);


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

    // First, filter out any deleted orders (use current localStorage data)
    const deletedOrderIds = JSON.parse(localStorage.getItem('deletedOrders') || '[]').map(order => order.originalId || order.id);
    filtered = filtered.filter(order => !deletedOrderIds.includes(order.id));

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
        // Send email notification
        try {
          const emailResult = await emailService.sendOrderStatusUpdateEmail(order, newStatus);
          if (emailResult.success) {
            console.log('✅ Status update email sent successfully');
          } else {
            console.error('❌ Failed to send status update email:', emailResult.error);
          }
        } catch (error) {
          console.error('❌ Email sending error:', error);
        }
        
        // Also send the old notification system
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
      
      // Send notification for status update
      if (firebaseResult.success && order && oldStatus !== newStatus) {
        try {
          await notificationService.sendOrderStatusNotification(order, oldStatus, newStatus);
          console.log('✅ Status update notification sent');
        } catch (error) {
          console.error('❌ Failed to send status update notification:', error);
        }
      }
  };

  const deleteOrder = async (orderId) => {
    console.log('🗑️ Delete button clicked for order:', orderId);
    
    const confirmed = await showAlert(
      'هل أنت متأكد من حذف هذا الطلب نهائياً؟',
      'delete',
      { 
        showCancel: true, 
        confirmText: 'حذف نهائياً', 
        cancelText: 'إلغاء' 
      }
    );
    
    if (confirmed) {
      try {
        console.log('🗑️ Attempting to delete order:', orderId);
        console.log('📊 Current orders count before delete:', orders.length);
        
        // Delete from Firebase
        console.log('🔥 Calling firebaseService.deleteOrder...');
        const firebaseResult = await firebaseService.deleteOrder(orderId);
        console.log('🔥 Firebase delete result:', firebaseResult);
        
        if (firebaseResult.success) {
          console.log(`✅ Order ${orderId} deleted from Firebase successfully`);
          
          // Find the order to move to deleted
          const orderToDelete = orders.find(order => order.id === orderId);
          
          // Add to deleted orders FIRST
          if (orderToDelete) {
            const deletedOrders = JSON.parse(localStorage.getItem('deletedOrders') || '[]');
            const orderWithDeleteInfo = {
              ...orderToDelete,
              deletedAt: new Date().toISOString(),
              deletedBy: 'admin',
              originalId: orderId // Keep original ID for reference
            };
            deletedOrders.push(orderWithDeleteInfo);
            localStorage.setItem('deletedOrders', JSON.stringify(deletedOrders));
            setDeletedOrdersCount(deletedOrders.length);
            console.log('🗑️ Order moved to deleted orders:', orderId);
            
            // Force update the count immediately
            setTimeout(() => {
              setDeletedOrdersCount(prev => prev + 1);
            }, 100);
            
            // Save to Firebase for cross-device sync
            try {
              const syncResult = await firebaseService.saveDeletedOrders(deletedOrders);
              if (syncResult.success) {
                console.log('✅ Deleted orders synced to Firebase successfully');
                // Trigger immediate refresh for cross-device sync
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('ordersUpdated'));
                }, 1000);
              } else {
                console.error('❌ Failed to sync deleted orders to Firebase:', syncResult.error);
              }
            } catch (error) {
              console.error('❌ Failed to sync deleted orders to Firebase:', error);
            }
          }
          
          // Update local state immediately - remove from active orders
          const updatedOrders = orders.filter(order => order.id !== orderId);
          console.log('📊 Updated orders count after delete:', updatedOrders.length);
          
          // Force immediate UI update
          setOrders(updatedOrders);
          setFilteredOrders(updatedOrders);
          
          // Update localStorage - remove from active orders
          localStorage.setItem('orders', JSON.stringify(updatedOrders));
          console.log('💾 Updated localStorage - removed from active orders');
          
          // Clean any remaining deleted orders from localStorage
          cleanDeletedOrdersFromStorage();
          
          // Force re-render to ensure UI updates
          setTimeout(() => {
            console.log('🔄 Forcing UI update after delete');
            setOrders(prev => [...prev]);
            setFilteredOrders(prev => [...prev]);
          }, 50);
          
          // Remove from new orders set if it was there
          setNewOrders(prev => {
            const updated = new Set(prev);
            updated.delete(orderId);
            return updated;
          });
          
          // Force a small delay to ensure state update
          setTimeout(() => {
            console.log('🔄 Final state check - orders count:', orders.length - 1);
          }, 100);
          
          await showAlert(
            'تم حذف الطلب وانتقاله لصفحة الحذوفات\n\nيمكنك الذهاب لصفحة الحذوفات لاستعادته',
            'success'
          );
          console.log('✅ Delete operation completed successfully - order moved to deleted');
        } else {
          console.error('❌ Failed to delete order from Firebase:', firebaseResult.error);
          await showAlert(`حدث خطأ في حذف الطلب من Firebase: ${firebaseResult.error}`, 'error');
        }
      } catch (error) {
        console.error('❌ Error deleting order:', error);
        await showAlert(`حدث خطأ في حذف الطلب: ${error.message}`, 'error');
      }
    } else {
      console.log('❌ Delete operation cancelled by user');
    }
  };





  // WallZ Secret: Delete all orders with password protection
  const deleteAllOrders = () => {
    console.log('🗑️ WallZ Secret: Delete all orders requested');
    setShowPasswordDialog(true);
  };

  // Handle password confirmation
  const handlePasswordConfirm = async (password) => {
    setShowPasswordDialog(false);
    
    if (password !== 'WallZ') {
      await showAlert('❌ كلمة السر غير صحيحة!\n\nالوصول مرفوض.', 'error');
      console.log('❌ WallZ Secret: Wrong password entered');
      return;
    }
    
    console.log('✅ WallZ Secret: Correct password entered');
    
    // Show confirmation dialog
    const confirmed = await showAlert(
      `🔐 تم التحقق من كلمة السر بنجاح!\n\nهل أنت متأكد من حذف جميع الطلبات نهائياً؟\n\nسيتم حذف ${orders.length} طلب من Firebase و localStorage.\n\nهذا الإجراء لا يمكن التراجع عنه!`,
      'delete'
    );
    
    if (!confirmed) {
      console.log('❌ WallZ Secret: Delete cancelled by user');
      return;
    }

    try {
      startComponentLoading('deleteAll', 'Deleting all orders...');
      
      // Try batch deletion first
      let firebaseResult = await firebaseService.deleteAllOrders();
      
      // If batch deletion fails, try force deletion
      if (!firebaseResult.success || firebaseResult.deletedCount === 0) {
        console.log('🔄 Batch deletion failed, trying force deletion...');
        firebaseResult = await firebaseService.forceDeleteAllOrders();
      }
      
      if (firebaseResult.success && firebaseResult.deletedCount > 0) {
        console.log('✅ Delete All Orders: Firebase deletion successful');
        
        // Move all orders to deleted orders instead of permanent deletion
        const allOrders = [...orders]; // Copy current orders
        const deletedOrders = JSON.parse(localStorage.getItem('deletedOrders') || '[]');
        
        // Add all orders to deleted orders with delete info
        allOrders.forEach(order => {
          const orderWithDeleteInfo = {
            ...order,
            deletedAt: new Date().toISOString(),
            deletedBy: 'admin',
            originalId: order.id
          };
          deletedOrders.push(orderWithDeleteInfo);
        });
        
        // Save to deleted orders
        localStorage.setItem('deletedOrders', JSON.stringify(deletedOrders));
        setDeletedOrdersCount(deletedOrders.length);
        console.log('🗑️ All orders moved to deleted orders:', allOrders.length);
        
        // Force update the count immediately
        setTimeout(() => {
          setDeletedOrdersCount(deletedOrders.length);
        }, 100);
        
        // Save to Firebase for cross-device sync
        try {
          const syncResult = await firebaseService.saveDeletedOrders(deletedOrders);
          if (syncResult.success) {
            console.log('✅ All deleted orders synced to Firebase successfully');
            // Trigger immediate refresh for cross-device sync
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('ordersUpdated'));
            }, 1000);
          } else {
            console.error('❌ Failed to sync deleted orders to Firebase:', syncResult.error);
          }
        } catch (error) {
          console.error('❌ Failed to sync deleted orders to Firebase:', error);
        }
        
        // Clear active orders completely
        localStorage.removeItem('orders');
        setOrders([]);
        setFilteredOrders([]);
        setNewOrders(new Set());
        
        // Force immediate UI update
        setTimeout(() => {
          console.log('🔄 Forcing complete UI clear after delete all');
          setOrders([]);
          setFilteredOrders([]);
        }, 50);
        
        console.log('✅ Delete All Orders: All orders moved to deleted');
        
        // Show success message
        await showAlert(
          `🎉 تم حذف جميع الطلبات وانتقالها لصفحة الحذوفات!\n\nتم نقل ${firebaseResult.deletedCount} طلب لصفحة الحذوفات\nيمكنك استعادتها من هناك\n\nتم تنفيذ "Delete All Orders" بنجاح!`,
          'success'
        );
        
        console.log('🎉 Delete All Orders: All orders moved to deleted successfully!');
      } else {
        console.error('❌ Delete All Orders: Firebase deletion failed:', firebaseResult.error);
        await showAlert('فشل في حذف الطلبات من Firebase: ' + (firebaseResult.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('❌ Delete All Orders: Error deleting all orders:', error);
      await showAlert('خطأ في حذف جميع الطلبات: ' + error.message, 'error');
    } finally {
      stopComponentLoading('deleteAll');
    }
  };

  // Handle password dialog cancel
  const handlePasswordCancel = () => {
    setShowPasswordDialog(false);
    console.log('❌ WallZ Secret: Password dialog cancelled by user');
  };

  // Handle print order
  const handlePrintOrder = (order) => {
    setPrintOrderData(order);
    setShowPrintOrder(true);
  };

  const handleClosePrintOrder = () => {
    setShowPrintOrder(false);
    setPrintOrderData(null);
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

  const getTotalOrders = () => filteredOrders.length;
  const getTotalRevenue = () => {
    // Use filtered orders to exclude deleted orders
    return filteredOrders.reduce((sum, order) => {
      // استبعاد الطلبات الملغية
      if (order.status === 'cancelled') {
        return sum;
      }
      
      // حساب السعر بدون الشحن (subtotal فقط)
      const subtotal = order.subtotal || (order.total - (order.shipping || order.shippingCost || 0)) || 0;
      return sum + subtotal;
    }, 0);
  };


  // Check if order is new (within last 24 hours)
  const isNewOrder = (order) => {
    return newOrders.has(order.id);
  };

  // Hide notification function
  const hideNotification = () => {
    setShowNotification(false);
    setNotificationCount(0);
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

      // Add data rows - use filteredOrders to exclude deleted orders
      filteredOrders.forEach(order => {
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
      
      summaryRow.getCell(9).value = `Total Orders: ${filteredOrders.length}`;
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
    }
  };

  return (
    <div className="admin-orders-container">
      {/* Loading Overlay */}
      {isComponentLoading('loadOrders') && (
        <div className="loading-overlay">
          <Loading 
            size="large" 
            color="primary" 
            text="Loading orders..." 
            overlay={true}
          />
        </div>
      )}
      
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="header-top">
            <button 
              onClick={() => navigate('/')} 
              className="back-to-home-btn"
            >
              ← Back to Home
            </button>
            <h1>📊 Orders Management</h1>
          </div>
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
        <button 
          onClick={deleteAllOrders} 
          className="delete-all-orders-btn"
          disabled={isComponentLoading('deleteAll')}
        >
          {isComponentLoading('deleteAll') ? (
            <>
              <Loading size="small" color="light" showText={false} />
              <span style={{ marginLeft: '8px' }}>Deleting...</span>
            </>
          ) : (
            <>
              🗑️
              Delete All Orders
            </>
          )}
        </button>
        <button onClick={exportToExcel} className="export-excel-btn">
          <FaFileExcel />
          Export to Excel
        </button>
        <button 
          onClick={() => setShowNotificationManager(!showNotificationManager)}
          className="notification-settings-btn"
        >
          <FaBell />
          Notification Settings
        </button>
        <Link to="/admin/deleted-orders" className="deleted-orders-btn">
          <FaTrash />
          Deleted Orders ({deletedOrdersCount})
        </Link>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {!filteredOrders || filteredOrders.length === 0 ? (
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
                  <div className="order-title-row">
                    <h3>Order #{order.id.slice(-6)}</h3>
                    {isNewOrder(order) && (
                      <span className="new-badge">New</span>
                    )}
                  </div>
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
                </div>
                <div className="order-total">
                  <span>${order.subtotal || (order.total - (order.shipping || order.shippingCost || 0)) || 0}</span>
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
                
                <button 
                  onClick={() => handlePrintOrder(order)}
                  className="print-btn"
                >
                  🖨️ Print
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
                    <Link 
                      to={`/product/${item.productId}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="item-image-link"
                    >
                      <img src={item.image} alt={item.name} />
                    </Link>
                    <div className="item-info">
                      <Link 
                        to={`/product/${item.productId}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="item-name-link"
                      >
                        <h4>{item.name}</h4>
                      </Link>
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
                onClick={() => handlePrintOrder(selectedOrder)} 
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
      
      <Notification
        show={showNotification}
        count={notificationCount}
        onClose={hideNotification}
      />

      {/* Password Dialog */}
      <PasswordDialog
        show={showPasswordDialog}
        onConfirm={handlePasswordConfirm}
        onCancel={handlePasswordCancel}
        title="Delete All Orders"
        message="أدخل كلمة السر للوصول لوظيفة حذف جميع الطلبات نهائياً"
        correctPassword="WallZ"
      />

      {/* Notification Manager */}
      {showNotificationManager && (
        <div className="notification-manager-overlay">
          <div className="notification-manager-modal">
            <div className="modal-header">
              <h3>🔔 Notification Settings</h3>
              <button 
                className="close-btn"
                onClick={() => setShowNotificationManager(false)}
              >
                ✕
              </button>
            </div>
            <NotificationManager />
          </div>
        </div>
      )}

      {/* Print Order Modal */}
      {showPrintOrder && printOrderData && (
        <PrintOrder 
          order={printOrderData} 
          onClose={handleClosePrintOrder}
        />
      )}
    </div>
  );
}

export default AdminOrders;
