import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Inquiry {
  name: string;
  email: string;
  phone: string;
  packageName: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt?: any;
}

export const submitInquiry = async (inquiry: Omit<Inquiry, 'createdAt' | 'status'>): Promise<boolean> => {
  try {
    const docRef = await addDoc(collection(db, 'inquiries'), {
      ...inquiry,
      status: 'new',
      createdAt: serverTimestamp()
    });
    return !!docRef.id;
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    return false;
  }
};
