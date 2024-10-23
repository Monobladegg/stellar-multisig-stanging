// shared/api/firebase/app/index.ts
import {
  initializeApp,
  getApps,
  FirebaseApp,
  FirebaseOptions,
} from "firebase/app";

let firebaseApp: FirebaseApp | undefined;

export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

export default firebaseApp;

/**
 * Initializes Firebase with the provided configuration.
 * If Firebase is already initialized, it returns the existing instance.
 *
 * @param config - Firebase configuration object
 * @returns Promise resolving to the FirebaseApp instance
 */
export const initializeFirebase = (
  config: FirebaseOptions
): Promise<FirebaseApp> => {
  return new Promise((resolve, reject) => {
    try {
      if (!getApps().length) {
        firebaseApp = initializeApp(config);
      } else {
        firebaseApp = getApps()[0];
      }
      resolve(firebaseApp);
    } catch (error) {
      reject(error);
    }
  });
};
