import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignout,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDV4Vb1iTj7mAsOuFU3AsjHEkLHdxQfnQU",
    authDomain: "group-project-c0696.firebaseapp.com",
    projectId: "group-project-c0696",
    storageBucket: "group-project-c0696.appspot.com",
    messagingSenderId: "129244516313",
    appId: "1:129244516313:web:bc0c7727188ed76131d3c8"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        await addDoc(collection(db, "users"), { uid: user.uid, email: user.email });
        return true;
    } catch (error) {
        return { error: error.message };
    }
};
const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        return true;
    } catch (error) {
        return { error: error.message };
    }
};
const signOut = async () => {
    try {
        await firebaseSignout(auth);
        return true;
    } catch (error) {
        return false;
    }
};
export { app, signUp, signIn, signOut };
