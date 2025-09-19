import { app } from "./Firebase";
import {
    getAuth,
    createUserWithEmailAndPassword, // sign In 
    signInWithEmailAndPassword, // Log In
    GoogleAuthProvider, // google logIn and signIn
    signInWithPopup, // google logIn and signIn popup
    signOut, // signout user
  } from "firebase/auth";

// add, log out login object.
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const userAuth = {
  useLogin: async (email, password) => {
    try {
      const loginRes = await signInWithEmailAndPassword(auth, email, password);
      return loginRes.user;
    } catch (error) {
      console.error(error);
      return "error";
    }
  },

  useSignIn: async (email, password) => {
    try {
      const signRes = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return signRes.user;
    } catch (error) {
      console.error(error);
      return "error";
    }
  },

  googleAuth: async () => {
    try {
      const googleRes = await signInWithPopup(auth, googleProvider);
      return googleRes.user;
    } catch (error) {
      console.error(error);
      return "error";
    }
  },

  logout: async () => {
    await signOut(auth);
  },
};
