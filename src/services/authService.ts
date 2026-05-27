import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Admin email for authorization (you can store this in environment variables)
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@portfolio.com';

export async function loginAdmin(email: string, password: string): Promise<User | null> {
  try {
    // Set persistence to local so user stays logged in
    await setPersistence(auth, browserLocalPersistence);
    
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Verify that the user is the admin
    if (result.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      console.log('✅ Admin login successful:', result.user.email);
      return result.user;
    } else {
      // Non-admin user tried to login
      await signOut(auth);
      throw new Error('Access denied. Only admin users can access this panel.');
    }
  } catch (error: any) {
    console.error('❌ Login failed: Invalid credentials or network error.');
    throw error;
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await signOut(auth);
    console.log('✅ Admin logout successful');
  } catch (error) {
    console.error('❌ Logout failed: Session could not be terminated.');
    throw error;
  }
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function onUserAuthStateChanged(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    // Only allow admin users
    if (user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      callback(user);
    } else {
      callback(null);
    }
  });
}

export function isAdminAuthenticated(): boolean {
  const user = auth.currentUser;
  return user !== null && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
