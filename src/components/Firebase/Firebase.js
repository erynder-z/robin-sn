import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

export default database;
