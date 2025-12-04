import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
//   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
apiKey: 'AIzaSyAvwJeUSAutn2DbvP-3Hmeuetaes8kjscY',
authDomain:'offersholic-612a0.firebaseapp.com',
projectId:'offersholic-612a0',
storageBucket:'offersholic-612a0.appspot.com',
messagingSenderId:'1041739766789',
appId:'1:1041739766789:web:ace3b5eded2f5ce43d506c',
measurementId:'G-BMC1BC3MRK'

};

if (!getApps().length) {
    initializeApp(firebaseConfig);
  }

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
