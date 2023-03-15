import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // apiKey: import.meta.env.VITE_API_KEY,
  // authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  // projectId: import.meta.env.VITE_PROJECT_ID,
  // storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  // messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  // appId: import.meta.env.VITE_APP_ID,
  // measurementId: import.meta.env.VITE_MASUREMENT_ID

  apiKey: "AIzaSyAdZ8hmAO9uxcCUkxwsz2fJgkOGJEyZ8ss",
  authDomain: "acropolis-dev-6dec9.firebaseapp.com",
  projectId: "acropolis-dev-6dec9",
  storageBucket: "acropolis-dev-6dec9.appspot.com",
  messagingSenderId: "656692497423",
  appId: "1:656692497423:web:e35198bf7b4cf46411277a",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
const db = getFirestore(app);
export { db };
