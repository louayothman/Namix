
'use server';

import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

/**
 * البحث عن مستخدم عبر المعرف الرقمي أو البريد الإلكتروني (مطابقة تامة)
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
        user: { id: snap1.docs[0].id, displayName: data.displayName, namixId: data.namixId, email: data.email } 
      };
    }

    // 2. البحث عبر البريد الإلكتروني
    const q2 = query(collection(firestore, "users"), where("email", "==", cleanId.toLowerCase()), limit(1));
    const snap2 = await getDocs(q2);
    
    if (!snap2.empty) {
      const data = snap2.docs[0].data();
      return { 
        success: true, 
        user: { id: snap2.docs[0].id, displayName: data.displayName, namixId: data.namixId, email: data.email } 
      };
    }

    return { success: false, error: "لم يتم العثور على مستخدم مطابقة لهذه البيانات." };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * البحث المتقدم عن مستخدمين عبر مطابقة جزئية للاسم أو البريد أو المعرف
 * تم تحسينه ليدعم البحث بكلمة واحدة من الاسم
 */
export async function searchUsers(term: string) {
  try {
    const { firestore } = initializeFirebase();
    const cleanTerm = term.trim().toLowerCase();
    
    if (!cleanTerm) return { success: true, users: [] };

    // جلب عينة من المستخدمين للفلترة البرمجية (لضمان دعم الكلمات الجزئية في الاسم)
    const q = query(collection(firestore, "users"), limit(100));
    const snap = await getDocs(q);
    
    const results = snap.docs
      .map(d => ({ id: d.id, ...d.data() } as any))
      .filter(u => 
        u.displayName?.toLowerCase().includes(cleanTerm) || 
        u.email?.toLowerCase().includes(cleanTerm) || 
        u.namixId?.includes(cleanTerm) ||
        u.phoneNumber?.includes(cleanTerm)
      );

    return { 
      success: true, 
      users: results.slice(0, 10).map(u => ({
        id: u.id,
        displayName: u.displayName,
        email: u.email,
        namixId: u.namixId
      })) 
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
