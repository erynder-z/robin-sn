import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAuInTSs3C0O_AEYTW9LZoFEyT3jdqFMKw',
  authDomain: 'twitter-clone-4015b.firebaseapp.com',
  projectId: 'twitter-clone-4015b',
  storageBucket: 'twitter-clone-4015b.appspot.com',
  messagingSenderId: '85652114945',
  appId: '1:85652114945:web:798dc5823423a34ac1fa00'
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

connectAuthEmulator(auth, 'http://localhost:9099');
connectFirestoreEmulator(database, 'localhost', 8080);
connectStorageEmulator(storage, 'localhost', 9199);

export { database, auth, storage };
