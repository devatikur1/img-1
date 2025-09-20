import { app } from "./Firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

const auth = getAuth(app);
const fireStore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const userAuth = {
  useLogin: async (email, password) => {
    try {
      const loginRes = await signInWithEmailAndPassword(auth, email, password);
      const user = loginRes.user;

      // Firestore doc ref using uid
      const userRef = doc(fireStore, "users", user.uid);

      // Update last login timestamp safely
      await setDoc(
        userRef,
        { atLastLogin: serverTimestamp() },
        { merge: true } // preserve other fields
      );

      return user;
    } catch (error) {
      console.error(error);
      return "error";
    }
  },

  useSignIn: async (email, password, username, fullName ) => {
    try {
      const signRes = await createUserWithEmailAndPassword(auth, email, password);
      const user = signRes.user;

      const userRef = doc(fireStore, "users", user.uid);
      const docSnap = await getDoc(userRef);

      await setDoc(userRef, {
        id: user.uid,
        name: fullName,
        email: user.email,
        username,
        profileImgUrl: null,
        atSignInFirebase: serverTimestamp(),
        atSignIn: new Date(),
        atLastLoginFirebase: serverTimestamp(),
        atLastLogin: new Date(),
        uploadImages: [],
        likeImages: [],
        amountOfLike: 0,
        amountOfPostImages: 0,
      });

      return user;
    } catch (error) {
      console.error(error);
      return "error";
    }
  },

  googleAuth: async () => {
    try {
      const googleRes = await signInWithPopup(auth, googleProvider);
      const user = googleRes.user;

      const userRef = doc(fireStore, "users", user.uid);
      await setDoc(
        userRef,
        {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          profileImgUrl: user.photoURL,
          atSignIn: serverTimestamp(),
          atLastLogin: serverTimestamp(),
        },
        { merge: true }
      );

      return user;
    } catch (error) {
      console.error(error);
      return "error";
    }
  },

  logout: async () => {
    await signOut(auth);
  },
};
