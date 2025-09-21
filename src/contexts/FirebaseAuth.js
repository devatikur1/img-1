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
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const auth = getAuth(app);
const fireStore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const userAuth = {
  useLogin: async (email, password) => {
    try {
      const loginRes = await signInWithEmailAndPassword(auth, email, password);
      const user = loginRes.user;
      
      const userRef = doc(fireStore, "users", user.uid);
      await setDoc(
        userRef,
        { atLastLogin: serverTimestamp() },
        { merge: true }
      );
      return user;
    } catch (error) {
      console.error(error);
      return "error";
    }
  },

  useSignIn: async (email, password, signUpPayload) => {
    try {
      const signRes = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = signRes.user;
      const userRef = doc(fireStore, "users", user.uid);

      await setDoc(userRef, {
        id: user.uid,
        email: user.email,
        atSignInFirebase: serverTimestamp(),
        atLastLoginFirebase: serverTimestamp(),
        ...signUpPayload,
      });

      return user;
    } catch (error) {
      console.error(error);
      return "error";
    }
  },

  googleAuth: async (GooglesignUpPayload) => {
    try {
      const googleRes = await signInWithPopup(auth, googleProvider);
      const user = googleRes.user;

      let baseName = user.displayName
        ? user.displayName.replace(/\s+/g, "").toLowerCase()
        : user.email.split("@")[0].toLowerCase();

      let username;

      while (true) {
        const randomNum = Math.floor(100 + Math.random() * 900);
        username = `${baseName}${randomNum}`;

        const q = query(
          collection(fireStore, "users"),
          where("username", "==", username)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) break;
      }

      console.log("Saving user with username:", username);

      const userRef = doc(fireStore, "users", user.uid);
      await setDoc(
        userRef,
        {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          profileImgUrl: user.photoURL,
          username,
          atSignIn: serverTimestamp(),
          atLastLogin: serverTimestamp(),
          ...GooglesignUpPayload,
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
