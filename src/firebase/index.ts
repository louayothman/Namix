
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * تهيئة Firebase للاستخدام مع Firestore و Auth و Messaging.
 */
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const firebaseApp = app;

export function initializeFirebase() {
  return {
    firebaseApp: app,
    firestore: getFirestore(app),
    auth: getAuth(app)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';
