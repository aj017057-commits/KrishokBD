import { getApps, initializeApp, type FirebaseApp } from "firebase/app";

const FIREBASE_CONFIG = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId
);

let _app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (getApps().length > 0) return getApps()[0];
  _app = initializeApp(FIREBASE_CONFIG as any);
  return _app;
}

export async function getDb() {
  if (!isFirebaseConfigured) return null;
  const { getFirestore } = await import("firebase/firestore");
  const app = getFirebaseApp();
  return app ? getFirestore(app) : null;
}

export async function getFirebaseAuth() {
  if (!isFirebaseConfigured) return null;
  const { getAuth } = await import("firebase/auth");
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}

export const COLLECTIONS = {
  USERS:         "users",
  FARMERS:       "farmers",
  PRODUCTS:      "products",
  ORDERS:        "orders",
  REVIEWS:       "reviews",
  NOTIFICATIONS: "notifications",
  SETTINGS:      "settings",
  WITHDRAWALS:   "withdrawals",
} as const;
