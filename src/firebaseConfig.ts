// firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase configuration object containing the keys and identifiers
 * required to initialize Firebase services for the application.
 */
const firebaseConfig = {
  apiKey: "AIzaSyAj5jFusly3mZRpgPr4EpZkeR3N78p6ang",
  authDomain: "trackflow-70e72.firebaseapp.com",
  projectId: "trackflow-70e72",
  storageBucket: "trackflow-70e72.appspot.com",
  messagingSenderId: "1017548183587",
  appId: "1:1017548183587:web:e3bb83e73cf8142a9bb996",
  measurementId: "G-JL1561WJ51",
};

/**
 * Initializes Firebase with the provided configuration.
 * This setup ensures the Firebase app is correctly initialized for the application.
 */
const app = initializeApp(firebaseConfig);

/**
 * Initializes Firestore, Firebase's cloud database service.
 * This allows interactions with the Firestore database for reading and writing data.
 */
const db = getFirestore(app);

// Export Firestore instance to be used in other parts of the application
export { db };
