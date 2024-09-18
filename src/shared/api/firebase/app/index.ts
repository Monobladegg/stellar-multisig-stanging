
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_API_KEY,
  authDomain: process.env.NEXT_AUTH_DOMAIN,
  projectId: process.env.NEXT_PROJECT_ID,
  storageBucket: process.env.NEXT_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_APP_ID,
  measurementId: process.env.NEXT_MEASUREMENT_ID
}

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
