import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, browserLocalPersistence, Auth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyCvz2ukMyhGT_JfAf-vD5GEZsUxIcu0qpY",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "ailem-app.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "ailem-app",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "ailem-app.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "593836409742",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:593836409742:web:8df95255db34891b82dadf",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

let auth: Auth;
try {
  auth = getAuth(app);
  // Only set persistence in browser environment (not during SSR)
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    import('firebase/auth').then(({ browserLocalPersistence, setPersistence }) => {
      setPersistence(auth, browserLocalPersistence).catch(() => {});
    });
  } else if (Platform.OS !== 'web') {
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    const { getReactNativePersistence, initializeAuth } = require("firebase/auth");
    try {
      initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch (e) {
      // Auth already initialized
    }
  }
} catch (error) {
  console.warn('Firebase auth initialization error:', error);
}

const storage = getStorage(app);

export { app, db, auth, storage };
