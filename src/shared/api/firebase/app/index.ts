
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY || process.env.NEXT_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN || process.env.NEXT_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || process.env.NEXT_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || process.env.NEXT_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || process.env.NEXT_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID || process.env.NEXT_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID || process.env.NEXT_MEASUREMENT_ID
}

const firebaseApp = initializeApp(firebaseConfig);

const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId', 'measurementId'];
for (const field of requiredFields) {
  if (!(field in firebaseConfig) || !firebaseConfig[field as keyof typeof firebaseConfig]) {
    throw new Error(`Firebase configuration error: ${field} is missing.`);
  }
}

export default firebaseApp;
