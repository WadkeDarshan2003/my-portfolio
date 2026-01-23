import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Project } from '../../types';

const PROJECTS_COLLECTION = 'projects';

/**
 * Check if Firestore database is empty
 */
export async function isDatabaseEmpty(): Promise<boolean> {
  try {
    const snapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    return snapshot.empty;
  } catch (error) {
    console.error('Error checking database:', error);
    return true; // Assume empty on error
  }
}

/**
 * Migrate projects from local data to Firestore using BATCH WRITES (fast!)
 * @param projects Array of projects to migrate
 * @returns Object with migration status and details
 */
export async function migrateProjectsToFirebase(
  projects: Project[]
): Promise<{
  success: boolean;
  migrated: number;
  failed: number;
  errors: Array<{ projectId: string | number; error: string }>;
}> {
  try {
    console.log(`🚀 Starting BATCH migration of ${projects.length} projects...`);

    const batch = writeBatch(db);
    const projectsRef = collection(db, PROJECTS_COLLECTION);

    // Add all projects to the batch
    projects.forEach((project, index) => {
      const { id, ...projectData } = project; // Remove old ID
      const newDocRef = doc(projectsRef);
      
      batch.set(newDocRef, {
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log(`📦 [${index + 1}/${projects.length}] Added to batch: ${project.title}`);
    });

    // Commit all at once - MUCH FASTER!
    console.log('⏳ Committing batch write...');
    await batch.commit();
    console.log(`✅ Batch migration complete! ${projects.length} projects added`);

    return {
      success: true,
      migrated: projects.length,
      failed: 0,
      errors: [],
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Batch migration failed:', errorMsg);
    
    return {
      success: false,
      migrated: 0,
      failed: projects.length,
      errors: [{ projectId: 'batch', error: errorMsg }],
    };
  }
}

/**
 * Get migration status
 */
export async function getMigrationStatus(): Promise<{
  isDatabaseEmpty: boolean;
  projectCount: number;
}> {
  try {
    const snapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    return {
      isDatabaseEmpty: snapshot.empty,
      projectCount: snapshot.size,
    };
  } catch (error) {
    console.error('Error getting migration status:', error);
    return {
      isDatabaseEmpty: true,
      projectCount: 0,
    };
  }
}
