import {
  collection,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { AchievementCardData } from '../types';

const ACHIEVEMENTS_COLLECTION = 'achievements';

const timestampToMillis = (value: unknown) => {
  if (value instanceof Timestamp) return value.toMillis();
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  return 0;
};

const sortAchievements = (achievements: AchievementCardData[]) =>
  achievements.sort((a, b) => {
    const aTimestamps = a as AchievementCardData & { createdAt?: unknown; updatedAt?: unknown };
    const bTimestamps = b as AchievementCardData & { createdAt?: unknown; updatedAt?: unknown };
    const aTime = timestampToMillis(aTimestamps.updatedAt) || timestampToMillis(aTimestamps.createdAt);
    const bTime = timestampToMillis(bTimestamps.updatedAt) || timestampToMillis(bTimestamps.createdAt);

    return bTime - aTime;
  });

const getAchievementIdentity = (achievement: AchievementCardData) =>
  [
    achievement.type,
    achievement.title,
    achievement.organization || achievement.issuer || '',
    achievement.period || achievement.issued || '',
    achievement.credentialId || '',
  ].join('|').toLowerCase();

const dedupeAchievements = (achievements: AchievementCardData[]) => {
  const seen = new Set<string>();

  return achievements.filter((achievement) => {
    const identity = getAchievementIdentity(achievement);

    if (seen.has(identity)) {
      return false;
    }

    seen.add(identity);
    return true;
  });
};

const mapDocToAchievement = (doc: any): AchievementCardData => {
  const data = doc.data();
  const { id: _storedId, ...cleanData } = data;
  return {
    ...cleanData,
    id: doc.id,
  } as AchievementCardData;
};

export async function getAchievements(): Promise<AchievementCardData[]> {
  try {
    console.log('Fetching achievements from Firebase...');
    const snapshot = await getDocs(collection(db, ACHIEVEMENTS_COLLECTION));
    
    return dedupeAchievements(sortAchievements(snapshot.docs.map(mapDocToAchievement)));
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
}

// Subscribe to real-time achievement updates (cache-first)
export function subscribeToAchievements(
  onData: (achievements: AchievementCardData[]) => void,
  onError: (error: Error) => void
): () => void {
  const unsubscribe = onSnapshot(
    collection(db, ACHIEVEMENTS_COLLECTION),
    { includeMetadataChanges: true },
    (snapshot) => {
      const achievements = snapshot.docs.map(mapDocToAchievement);
      
      onData(dedupeAchievements(sortAchievements(achievements)));
    },
    (error) => {
      console.error('Error in achievements subscription:', error);
      onError(error);
    }
  );
  
  return unsubscribe;
}

export async function addAchievement(
  achievement: Omit<AchievementCardData, 'id'> | AchievementCardData
): Promise<string | null> {
  try {
    const { id: _storedId, ...achievementData } = achievement as any;
    const docRef = await addDoc(collection(db, ACHIEVEMENTS_COLLECTION), {
      ...achievementData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Failed to add achievement:', error);
    return null;
  }
}

export async function updateAchievement(
  id: string,
  updates: Partial<AchievementCardData>
): Promise<boolean> {
  try {
    const docRef = doc(db, ACHIEVEMENTS_COLLECTION, id);
    const { id: _storedId, createdAt, ...updateData } = updates as any;
    await setDoc(
      docRef,
      {
        ...updateData,
        ...(createdAt ? { createdAt } : { createdAt: Timestamp.now() }),
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Failed to update achievement:', error);
    return false;
  }
}

export async function deleteAchievement(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, ACHIEVEMENTS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Failed to delete achievement:', error);
    return false;
  }
}
