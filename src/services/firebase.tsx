import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAJXl_j0txsz1eW5iZAWZ8O2CLAGVTM0Bw",
  authDomain: "todo-list-9b5f5.firebaseapp.com",
  databaseURL: "https://todo-list-9b5f5-default-rtdb.firebaseio.com",
  projectId: "todo-list-9b5f5",
  storageBucket: "todo-list-9b5f5.appspot.com",
  messagingSenderId: "239408038317",
  appId: "1:239408038317:web:eb0abfeb881e364f17a124",
  measurementId: "G-9CZXTPE31V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { db, auth };
