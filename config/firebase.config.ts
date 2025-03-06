import { initializeApp } from "@firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import ENV from './env.config';
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
};

// Log configuration in development mode
if (__DEV__) {
  console.log('Firebase initialized with config:',
    Object.keys(firebaseConfig).reduce((acc, key) => {
      const k = key as keyof typeof firebaseConfig;
      return { ...acc, [key]: firebaseConfig[k] ? '✓' : '✗' };
    }, {})
  );
}

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
