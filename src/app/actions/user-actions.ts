
'use server';

import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

/**
 * البحث عن مستخدم عبر المعرف الرقمي أو البريد الإلكتروني
 */
export async function findUserByIdOrEmail(identifier: string) {
  try {
    const { firestore } = initializeFirebase();
    const cleanId = identifier.trim();
    
    // 1. البحث عبر Namix ID
    const q1 = query(collection(firestore, "users"), where("namixId", "==", cleanId), limit(1));
    const snap1 = await getDocs(q1);
    
    if (!snap1.empty) {
      const data = snap1.docs[0].data();
      return { 
        success: true, 
        user: { id: snap1.docs[0].id, displayName: data.displayName, namixId: data.namixId } 
      };
    }

    // 2. البحث عبر البريد الإلكتروني
    const q2 = query(collection(firestore, "users"), where("email", "==", cleanId.toLowerCase()), limit(1));
    const snap2 = await getDocs(q2);
    
    if (!snap2.empty) {
      const data = snap2.docs[0].data();
      return { 
        success: true, 
        user: { id: snap2.docs[0].id, displayName: data.displayName, namixId: data.namixId } 
      };
    }

    return { success: false, error: "لم يتم العثور على مستخدم مطابقة لهذه البيانات." };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
