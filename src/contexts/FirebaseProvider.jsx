import React, { useEffect, useState } from "react";
import { FirebaseContext } from "./FirebaseContext";
import { app } from "./Firebase";
import {
  getAuth,
  createUserWithEmailAndPassword, // sign In 
  signInWithEmailAndPassword, // Log In
  GoogleAuthProvider, // google logIn and signIn
  signInWithPopup, // google logIn and signIn popup
  onAuthStateChanged, // what user logged
  signOut, // signout user
} from "firebase/auth";
import {
  collection,
  getFirestore,
  getDocs,
  addDoc,
  query,
  orderBy,
  startAfter,
  limit,
} from "firebase/firestore";
import useCheackSame from "../Hooks/useCheackSame";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const fireStore = getFirestore(app);

export function FirebaseProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedData, setUserLoggedData] = useState(null);

  // get data state
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);

  // upload state
  const [isUserUploadingImage, setIsUserUploadingImage] = useState(false);
  const [upimages, setupimages] = useState(null);
  const [updateData, setupdateData] = useState(0);


  // add, log out login object.
  const userAuth = {
    useLogin: async (email, password) => {
      try {
        const loginRes = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
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

  // store data in database use this obeject dataStore
  const dataStore = {
    addData: async (dataName, data) => {
      try {
        const collectionRef = collection(fireStore, dataName);
        if (!data) return;
        const docRef = await addDoc(collectionRef, data);
        return docRef;
      } catch (error) {
        console.log(`Add-data: ${error}`);
        return "error";
      }
    },

  };

  // fetchImageData funtion database thke image data ane
  const fetchImageData = {
    fetchFirst: async () => {
      setLoading(true);
      const q = query(
        collection(fireStore, "images"),
        orderBy("uploadTimeFirebase", "desc"),
        limit(10)
      );
      const snap = await getDocs(q);
      const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setImages(items);
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
      setLoading(false);
      if (snap.empty) setHasMore(false);
    },

    fetchMore: async () => {
      if (!lastDoc || !hasMore) return;
      setLoading(true);
      const q = query(
        collection(fireStore, "images"),
        orderBy("uploadTimeFirebase", "desc"),
        startAfter(lastDoc),
        limit(20)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const filteredItems = useCheackSame(parent, images, "id")
      console.log(filteredItems);

      setImages((prev) => [...prev, ...filteredItems]);
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
      setLoading(false);
    },
    
  };

  // when upsateData id update then call this funtion
  useEffect(() => {
    fetchImageData.fetchFirst();
  }, [updateData]);

  // scroll base data add
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        if (!loading && hasMore) fetchImageData.fetchMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

  }, [lastDoc, loading, hasMore]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // emni..
  useEffect(() => {
    console.log(images);
  }, [images]);

  return (
    <FirebaseContext.Provider
      value={{
        userAuth, // auth
        dataStore, // store data
        currentUser, // logged user
        images, // images in database

        isUserUploadingImage,  // uploaded data
        setIsUserUploadingImage,  // uploaded funtion

        upimages, // users uploaded image data sate data
        setupimages, // users uploaded image data sate funtion

        userLoggedData, // login user data
        setUserLoggedData, // login user data funtion

        uploading, // user uploading image ?? check this data
        setUploading, // user uploading image ?? check  funtion

        setupdateData // user updateData ?? check this update data funtion
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}
