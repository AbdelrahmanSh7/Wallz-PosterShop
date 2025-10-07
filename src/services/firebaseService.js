import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, onSnapshot, query, orderBy, writeBatch } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbXnV4r3kDBrV_OpbKSfnf8p0vCYEpcKk",
  authDomain: "wallz-edc33.firebaseapp.com",
  projectId: "wallz-edc33",
  storageBucket: "wallz-edc33.firebasestorage.app",
  messagingSenderId: "272258313663",
  appId: "1:272258313663:web:c0af764ea6d55aeed7c50a",
  measurementId: "G-JR4B7002ST"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('🔥 Firebase initialized successfully');

class FirebaseService {
  constructor() {
    this.db = db;
    this.ordersCollection = 'orders';
  }

  // Save order to Firebase
  async saveOrder(orderData) {
    try {
      console.log('💾 Saving order to Firebase:', orderData);
      
      const docRef = await addDoc(collection(this.db, this.ordersCollection), {
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('✅ Order saved to Firebase with ID:', docRef.id);
      
      return {
        success: true,
        id: docRef.id,
        data: orderData
      };
    } catch (error) {
      console.error('❌ Error saving order to Firebase:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add order to Firebase (alias for saveOrder)
  async addOrder(orderData) {
    return await this.saveOrder(orderData);
  }

  // Get all orders from Firebase
  async getOrders() {
    try {
      console.log('📥 Loading orders from Firebase...');
      
      const ordersRef = collection(this.db, this.ordersCollection);
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`✅ Orders loaded from Firebase: ${orders.length} orders`);
      return {
        success: true,
        orders: orders
      };
    } catch (error) {
      console.error('❌ Error loading orders from Firebase:', error);
      return {
        success: false,
        error: error.message,
        orders: []
      };
    }
  }

  // Delete order from Firebase
  async deleteOrder(orderId) {
    try {
      console.log('🗑️ Deleting order from Firebase:', orderId);
      console.log('📊 Database:', this.db);
      console.log('📊 Collection:', this.ordersCollection);
      
      const orderRef = doc(this.db, this.ordersCollection, orderId);
      console.log('📊 Order reference:', orderRef);
      
      await deleteDoc(orderRef);
      
      console.log(`✅ Order ${orderId} deleted from Firebase successfully`);
      
      return {
        success: true,
        id: orderId
      };
    } catch (error) {
      console.error('❌ Error deleting order from Firebase:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update order status in Firebase
  async updateOrderStatus(orderId, newStatus) {
    try {
      console.log(`🔄 Updating order ${orderId} status to: ${newStatus}`);
      
      const orderRef = doc(this.db, this.ordersCollection, orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date()
      });
      
      console.log(`✅ Order ${orderId} status updated to ${newStatus}`);
      
      return {
        success: true,
        id: orderId,
        status: newStatus
      };
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Listen to real-time updates
  subscribeToOrders(callback) {
    try {
      console.log('👂 Setting up real-time listener for orders...');
      
      const ordersRef = collection(this.db, this.ordersCollection);
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const orders = [];
        querySnapshot.forEach((doc) => {
          orders.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        console.log(`🔥 Firebase orders updated: ${orders.length} orders`);
        callback({
          success: true,
          orders: orders
        });
      }, (error) => {
        console.error('❌ Error in real-time listener:', error);
        callback({
          success: false,
          error: error.message,
          orders: []
        });
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('❌ Error setting up real-time listener:', error);
      return null;
    }
  }

  // Test Firebase connection
  async testConnection() {
    try {
      console.log('🧪 Testing Firebase connection...');
      
      const testRef = collection(this.db, 'test');
      await addDoc(testRef, {
        message: 'Firebase connection test',
        timestamp: new Date()
      });
      
      console.log('✅ Firebase connection test successful');
      return {
        success: true,
        message: 'Firebase connection is working'
      };
    } catch (error) {
      console.error('❌ Firebase connection test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Test delete functionality
  async testDelete() {
    try {
      console.log('🧪 Testing delete functionality...');
      
      // First, get all orders to see what we have
      const ordersResult = await this.getOrders();
      console.log('📊 Current orders:', ordersResult.orders.length);
      
      if (ordersResult.orders.length > 0) {
        const firstOrder = ordersResult.orders[0];
        console.log('📊 First order ID:', firstOrder.id);
        
        // Try to delete the first order
        const deleteResult = await this.deleteOrder(firstOrder.id);
        console.log('📊 Delete result:', deleteResult);
        
        return deleteResult;
      } else {
        console.log('📊 No orders to test delete with');
        return {
          success: true,
          message: 'No orders to test delete with'
        };
      }
    } catch (error) {
      console.error('❌ Test delete failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete all orders (Secret WallZ function) - Enhanced version
  async deleteAllOrders() {
    try {
      console.log('🗑️ Delete All Orders: Starting deletion process...');
      
      // Get all orders first
      const ordersResult = await this.getOrders();
      if (!ordersResult.success || ordersResult.orders.length === 0) {
        console.log('📊 No orders to delete');
        return {
          success: true,
          message: 'No orders found to delete',
          deletedCount: 0
        };
      }

      const orders = ordersResult.orders;
      console.log(`📊 Found ${orders.length} orders to delete`);

      // Use batch operations for better performance and reliability
      const batch = writeBatch(this.db);
      let batchCount = 0;
      const maxBatchSize = 500; // Firestore batch limit
      
      // Add delete operations to batch
      for (const order of orders) {
        const orderRef = doc(this.db, this.ordersCollection, order.id);
        batch.delete(orderRef);
        batchCount++;
        
        // Commit batch if it reaches the limit
        if (batchCount >= maxBatchSize) {
          await batch.commit();
          console.log(`✅ Batch committed: ${batchCount} orders deleted`);
          batchCount = 0;
        }
      }
      
      // Commit remaining operations
      if (batchCount > 0) {
        await batch.commit();
        console.log(`✅ Final batch committed: ${batchCount} orders deleted`);
      }

      console.log(`✅ Delete All Orders: Successfully deleted ${orders.length} orders`);
      
      return {
        success: true,
        message: `Successfully deleted ${orders.length} orders`,
        deletedCount: orders.length,
        failedCount: 0
      };
    } catch (error) {
      console.error('❌ Delete All Orders: Error deleting all orders:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      return {
        success: false,
        error: error.message,
        deletedCount: 0
      };
    }
  }

  // Alternative delete method - Force delete all orders
  async forceDeleteAllOrders() {
    try {
      console.log('🗑️ Force Delete: Starting force deletion...');
      
      // Get all orders
      const ordersResult = await this.getOrders();
      if (!ordersResult.success || ordersResult.orders.length === 0) {
        return {
          success: true,
          message: 'No orders found to delete',
          deletedCount: 0
        };
      }

      const orders = ordersResult.orders;
      console.log(`📊 Force Delete: Found ${orders.length} orders to delete`);

      // Try individual deletion with retry mechanism
      let deletedCount = 0;
      let failedCount = 0;

      for (const order of orders) {
        try {
          const orderRef = doc(this.db, this.ordersCollection, order.id);
          await deleteDoc(orderRef);
          deletedCount++;
          console.log(`✅ Force Delete: Order ${order.id} deleted`);
        } catch (error) {
          failedCount++;
          console.error(`❌ Force Delete: Failed to delete order ${order.id}:`, error);
        }
      }

      console.log(`✅ Force Delete: Deleted ${deletedCount} orders, failed ${failedCount}`);
      
      return {
        success: deletedCount > 0,
        message: `Force deleted ${deletedCount} orders, failed ${failedCount}`,
        deletedCount: deletedCount,
        failedCount: failedCount
      };
    } catch (error) {
      console.error('❌ Force Delete: Error in force deletion:', error);
      return {
        success: false,
        error: error.message,
        deletedCount: 0
      };
    }
  }
}

// Create and export a singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;