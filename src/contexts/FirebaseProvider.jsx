import React, { useEffect, useState } from "react";
import { FirebaseContext } from "./FirebaseContext";
import { app } from "./Firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
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
  getDoc,
  doc,
} from "firebase/firestore";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const fireStore = getFirestore(app);

export function FirebaseProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [images, setImages] = useState([]);

  // upload state
  const [searchBoxShowing, setSearchBoxShowing] = useState(false);
  const [upimageLinks, setupimageLinks] = useState(null);
  const [upData, setUpData] = useState(null);
  const [upsateData, setupsateData] = useState(0);

  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [uploading, setUploading] = useState(false);


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

  const dataStore = {
    addData: async (dataName, data) => {
      try {
        const collectionRef = collection(fireStore, "images");
        const docRef = await addDoc(collectionRef, data);
        return docRef;
      } catch (error) {
        console.log(error);
        return "error";
      }
    },
  };

  const fetchData = {
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
      const filteredItems = items.filter(
        (newItem) =>
          !images.some((existingItem) => existingItem.id === newItem.id)
      );

      setImages((prev) => [...prev, ...filteredItems]);
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
      setLoading(false);
    },
  };



  useEffect(() => {
    fetchData.fetchFirst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upsateData]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        if (!loading && hasMore) fetchData.fetchMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastDoc, loading, hasMore]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(images);
  }, [images]);

  return (
    <FirebaseContext.Provider
      value={{
        userAuth,
        dataStore,
        currentUser,
        images,
        searchBoxShowing,
        setSearchBoxShowing,
        upimageLinks,
        setupimageLinks,
        upData,
        setUpData,
        uploading,
        setUploading,

        setupsateData,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}
