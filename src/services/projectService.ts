import {
  collection,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Project } from '../types';

const PROJECTS_COLLECTION = 'projects';
const FIREBASE_TIMEOUT = 15000; // 15 second timeout
const MAX_RETRIES = 2;

type ProjectWithLegacyFontFields = Partial<Project> & {
  titleFont?: unknown;
  descriptionFont?: unknown;
  sectionTitleFont?: unknown;
};

const stripProjectFontFields = (project: ProjectWithLegacyFontFields) => {
  const {
    titleFont,
    descriptionFont,
    sectionTitleFont,
    ...projectWithoutFonts
  } = project;

  return projectWithoutFonts;
};

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

// Deduplicate projects by title or id
const dedupeProjects = (projects: Project[]) => {
  const seen = new Set<string>();
  return projects.filter((project) => {
    const key = project.title ? project.title.toLowerCase().trim() : String(project.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const mapDocToProject = (doc: any): Project => {
  const data = doc.data() as Partial<Project>;
  const { id: _storedId, ...cleanData } = data;
  return {
    ...stripProjectFontFields(cleanData),
    id: doc.id,
  } as Project;
};

// Get all projects - simplified for empty database
export async function getProjects(): Promise<Project[]> {
  try {
    console.log('Fetching projects from Firebase...');
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    console.log(`Found ${snapshot.size} projects in Firebase`);
    
    return dedupeProjects(snapshot.docs.map(mapDocToProject));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Subscribe to real-time project updates (cache-first)
export function subscribeToProjects(
  onData: (projects: Project[]) => void,
  onError: (error: Error) => void
): () => void {
  const q = query(collection(db, PROJECTS_COLLECTION), orderBy('createdAt', 'desc'));
  
  const unsubscribe = onSnapshot(
    q,
    { includeMetadataChanges: true },
    (snapshot) => {
      const projects = dedupeProjects(snapshot.docs.map(mapDocToProject));
      onData(projects);
    },
    (error) => {
      console.error('Error in projects subscription:', error);
      onError(error);
    }
  );
  
  return unsubscribe;
}

// Add a new project - simplified
export async function addProject(
  project: Omit<Project, 'id'> | Project
): Promise<string | null> {
  try {
    console.log('Adding project to Firebase:', project.title);
    const { id: _storedId, ...projectData } = project as any;
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      ...stripProjectFontFields(projectData),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('✅ Project added with ID:', docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error('❌ Failed to add project. Please check if Firestore is in test mode or if your internet is stable.');
    
    if (error.code === 'permission-denied') {
      console.error('🚨 PERMISSION DENIED - Firestore security rules are blocking writes!');
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
    const { id: _storedId, createdAt, ...projectData } = updates as any;
    await setDoc(
      projectRef,
      {
        ...stripProjectFontFields(projectData),
        ...(createdAt ? { createdAt } : { createdAt: Timestamp.now() }),
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('❌ Failed to update project:', error);
    return false;
  }
}

// Delete a project
export async function deleteProject(projectId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
    return true;
  } catch (error) {
    console.error('❌ Failed to delete project. Please try again.');
    return false;
  }
}
