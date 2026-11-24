// Configuración y conexión a Firebase / Firestore
import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Los valores salen de: Firebase Console > Configuración del proyecto >
// General > Tus apps > App web (</>) > SDK setup and configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.warn(
    "[Firebase] Falta FIREBASE_PROJECT_ID en el .env: las rutas de productos van a responder 500 hasta configurarlo."
  );
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
