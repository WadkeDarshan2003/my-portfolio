import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Project } from '../../types';

const PROJECTS_COLLECTION = 'projects';
const FIREBASE_TIMEOUT = 15000; // 15 second timeout
const MAX_RETRIES = 2;

// Retry wrapper for Firebase operations
async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying Firebase operation... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
}

// Get all projects - simplified for empty database
export async function getProjects(): Promise<Project[]> {
  try {
    console.log('Fetching projects from Firebase...');
    const snapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    console.log(`Found ${snapshot.size} projects in Firebase`);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as unknown as Project));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Add a new project - simplified
export async function addProject(
  project: Omit<Project, 'id'>
): Promise<string | null> {
  try {
    console.log('Adding project to Firebase:', project.title);
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      ...project,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('✅ Project added with ID:', docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error('❌ Error adding project:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      console.error('🚨 PERMISSION DENIED - Firestore security rules are blocking writes!');
      console.error('📋 Fix: Go to Firebase Console → Firestore → Rules → Enable test mode');
    }
    return null;
  }
}

// Update a project
export async function updateProject(
  projectId: string,
  updates: Partial<Project>
): Promise<boolean> {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error('Error updating project:', error);
    return false;
  }
}

// Delete a project
export async function deleteProject(projectId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}
