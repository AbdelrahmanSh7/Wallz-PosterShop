// Firebase service for orders management
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

class FirebaseService {
  constructor() {
    this.ordersCollection = 'orders';
    this.setupRealtimeListener();
  }

  // Setup real-time listener for orders
  setupRealtimeListener() {
    const ordersQuery = query(
      collection(db, this.ordersCollection),
      orderBy('createdAt', 'desc')
    );

    onSnapshot(ordersQuery, (snapshot) => {
      const orders = [];
      snapshot.forEach((doc) => {
        const orderData = doc.data();
        // Only include orders that are not marked as deleted
        if (!orderData.deleted) {
          orders.push({
            id: doc.id,
            ...orderData
          });
        }
      });

      // Trigger custom event for components to update
      window.dispatchEvent(new CustomEvent('firebaseOrdersUpdate', {
        detail: { orders }
      }));

      console.log('🔥 Firebase orders updated:', orders.length, 'orders');
    }, (error) => {
      console.error('❌ Firebase listener error:', error);
    });
  }

  // Add new order
  async addOrder(orderData) {
    try {
      const orderWithTimestamp = {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.ordersCollection), orderWithTimestamp);
      
      console.log('✅ Order added to Firebase with ID:', docRef.id);
      
      return {
        success: true,
        id: docRef.id,
        data: orderData
      };
    } catch (error) {
      console.error('❌ Error adding order to Firebase:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get all orders
  async getOrders() {
    try {
      const querySnapshot = await getDocs(collection(db, this.ordersCollection));
      const orders = [];
      
      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        // Only include orders that are not marked as deleted
        if (!orderData.deleted) {
          orders.push({
            id: doc.id,
            ...orderData
          });
        }
      });

      // Sort by creation date (newest first)
      orders.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB - dateA;
      });

      return {
        success: true,
        orders
      };
    } catch (error) {
      console.error('❌ Error getting orders from Firebase:', error);
      return {
        success: false,
        error: error.message,
        orders: []
      };
    }
  }

  // Update order status
  async updateOrderStatus(orderId, newStatus) {
    try {
      const orderRef = doc(db, this.ordersCollection, orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      console.log('✅ Order status updated in Firebase:', orderId, '→', newStatus);
      
      return {
        success: true,
        id: orderId,
        status: newStatus
      };
    } catch (error) {
      console.error('❌ Error updating order status in Firebase:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete order (mark as deleted instead of actual deletion)
  async deleteOrder(orderId) {
    try {
      const orderRef = doc(db, this.ordersCollection, orderId);
      await updateDoc(orderRef, {
        deleted: true,
        deletedAt: serverTimestamp()
      });
      
      console.log('✅ Order marked as deleted in Firebase:', orderId);
      
      return {
        success: true,
        id: orderId
      };
    } catch (error) {
      console.error('❌ Error marking order as deleted in Firebase:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const orderRef = doc(db, this.ordersCollection, orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (orderDoc.exists()) {
        return {
          success: true,
          order: {
            id: orderDoc.id,
            ...orderDoc.data()
          }
        };
      } else {
        return {
          success: false,
          error: 'Order not found'
        };
      }
    } catch (error) {
      console.error('❌ Error getting order from Firebase:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get orders count
  async getOrdersCount() {
    try {
      const querySnapshot = await getDocs(collection(db, this.ordersCollection));
      return {
        success: true,
        count: querySnapshot.size
      };
    } catch (error) {
      console.error('❌ Error getting orders count from Firebase:', error);
      return {
        success: false,
        error: error.message,
        count: 0
      };
    }
  }

  // Get total revenue
  async getTotalRevenue() {
    try {
      const querySnapshot = await getDocs(collection(db, this.ordersCollection));
      let totalRevenue = 0;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status !== 'cancelled') {
          const subtotal = data.subtotal || (data.total - (data.shipping || data.shippingCost || 0)) || 0;
          totalRevenue += subtotal;
        }
      });

      return {
        success: true,
        revenue: totalRevenue
      };
    } catch (error) {
      console.error('❌ Error getting total revenue from Firebase:', error);
      return {
        success: false,
        error: error.message,
        revenue: 0
      };
    }
  }
}

// Create global instance
const firebaseService = new FirebaseService();

export default firebaseService;
