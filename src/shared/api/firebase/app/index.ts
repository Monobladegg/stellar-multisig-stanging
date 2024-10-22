// shared/api/firebase/app/index.ts
import { initializeApp, getApps, FirebaseApp, FirebaseOptions } from "firebase/app";

let firebaseApp: FirebaseApp | undefined;

/**
 * Initializes Firebase with the provided configuration.
 * If Firebase is already initialized, it returns the existing instance.
 *
 * @param config - Firebase configuration object
 * @returns Promise resolving to the FirebaseApp instance
 */
export const initializeFirebase = (config: FirebaseOptions): Promise<FirebaseApp> => {
  return new Promise((resolve, reject) => {
    try {
      if (!getApps().length) {
        firebaseApp = initializeApp(config);
        console.log("Firebase successfully initialized:", firebaseApp.name);
      } else {
        firebaseApp = getApps()[0];
        console.log("Firebase already initialized:", firebaseApp.name);
      }
      resolve(firebaseApp);
    } catch (error) {
      reject(error);
    }
  });
};

// Export the initialized Firebase app as default (can be undefined initially)
export default firebaseApp;
