// Firebase connection test
import { db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Test adding a document
    const testOrder = {
      test: true,
      message: 'Firebase connection test',
      timestamp: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'test'), testOrder);
    console.log('✅ Firebase connection successful! Document ID:', docRef.id);
    
    // Test reading documents
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('✅ Firebase read test successful! Documents:', querySnapshot.size);
    
    return {
      success: true,
      message: 'Firebase connection working perfectly!',
      documentId: docRef.id,
      documentsCount: querySnapshot.size
    };
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Firebase connection failed. Check your configuration.'
    };
  }
};

// Auto-test on import
testFirebaseConnection().then(result => {
  if (result.success) {
    console.log('🎉 Firebase is ready to use!');
  } else {
    console.error('💥 Firebase setup incomplete:', result.error);
  }
});
