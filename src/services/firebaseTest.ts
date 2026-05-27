import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Test Firebase connection
 * This helps diagnose connection issues
 */
export async function testFirebaseConnection(): Promise<{
  connected: boolean;
  error?: string;
  details?: any;
}> {
  try {
    console.log('Testing Firebase connection...');
    console.log('Firebase config:', {
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    });

    // Try to read from a collection (any collection)
    const testCollection = collection(db, 'projects');
    
    console.log('Attempting to read from Firestore...');
    const snapshot = await getDocs(testCollection);
    
    console.log('✅ Firebase connected successfully!');
    console.log(`Found ${snapshot.size} documents in projects collection`);
    
    return {
      connected: true,
      details: {
        documentsFound: snapshot.size,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      },
    };
  } catch (error: any) {
    console.error('❌ Firebase connection failed:', error);
    
    let errorMessage = 'Unknown error';
    let troubleshooting: string[] = [];
    
    if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied - check Firestore security rules';
      troubleshooting = [
        'Go to Firebase Console → Firestore Database → Rules',
        'Ensure test mode rules are enabled',
        'Click "Publish" after changing rules',
      ];
    } else if (error.code === 'unavailable') {
      errorMessage = 'Firebase service unavailable - check internet connection';
      troubleshooting = [
        'Check your internet connection',
        'Verify Firebase project is active',
        'Check if VPN/firewall is blocking Firebase',
      ];
    } else if (error.message.includes('Failed to get document')) {
      errorMessage = 'Firestore database may not be created';
      troubleshooting = [
        'Go to Firebase Console',
        'Create Firestore Database if not exists',
        'Select "Start in test mode"',
      ];
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Connection timeout - network issue or Firebase down';
      troubleshooting = [
        'Check internet connection',
        'Try disabling VPN',
        'Check Firebase status: https://status.firebase.google.com',
      ];
    }
    
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      troubleshooting,
    });
    
    return {
      connected: false,
      error: errorMessage,
      details: {
        code: error.code,
        message: error.message,
        troubleshooting,
      },
    };
  }
}

/**
 * Test adding a document to Firebase
 */
export async function testFirebaseWrite(): Promise<boolean> {
  try {
    console.log('Testing Firebase write...');
    const testDoc = await addDoc(collection(db, 'test'), {
      test: true,
      timestamp: new Date().toISOString(),
    });
    console.log('✅ Write test successful! Doc ID:', testDoc.id);
    return true;
  } catch (error) {
    console.error('❌ Write test failed:', error);
    return false;
  }
}
