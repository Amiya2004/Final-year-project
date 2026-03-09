import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBAfqVqYqI5JOsKTtG7RgnvZS0HV1s7zBk",
  authDomain: "grocery-shop-26e87.firebaseapp.com",
  databaseURL: "https://grocery-shop-26e87-default-rtdb.firebaseio.com",
  projectId: "grocery-shop-26e87",
  storageBucket: "grocery-shop-26e87.firebasestorage.app",
  messagingSenderId: "477477145132",
  appId: "1:477477145132:web:b20d00729c6b6286b01f89",
  measurementId: "G-N0C2QXCMSW"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export default app;
