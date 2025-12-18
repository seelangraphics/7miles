
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALiwC0_37wl_Ku5wy215NfqJ_ANxBD6l0",
  authDomain: "miles-a720a.firebaseapp.com",
  projectId: "miles-a720a",
  storageBucket: "miles-a720a.firebasestorage.app",
  messagingSenderId: "840452424160",
  appId: "1:840452424160:web:d4ba49eead348a970d6b85",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
