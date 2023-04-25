import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZ6v-Hs2G-mYdYoG5kGVD3RDdNxWDAA78",
  authDomain: "sistemagvh.firebaseapp.com",
  projectId: "sistemagvh",
  storageBucket: "sistemagvh.appspot.com",
  messagingSenderId: "133959555224",
  appId: "1:133959555224:web:ee1a86cdc1ee1b1dd298ed",
  measurementId: "G-E5GPWVXKK3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);