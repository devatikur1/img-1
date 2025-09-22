import React, { useEffect, useState } from "react";
import { FirebaseContext } from "./FirebaseContext";
import { app } from "./Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { userAuth } from "./FirebaseAuth";
import {
  collection,
  getFirestore,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { dataStore } from "./FireStore";

const auth = getAuth(app);
const fireStore = getFirestore(app);

export function FirebaseProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const [key, setKey] = useState("");

  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);

  // upload state
  const [isUserUploadingImage, setIsUserUploadingImage] = useState(false);
  const [upimages, setupimages] = useState(null);
  const [updateData, setupdateData] = useState(0);

  const [logged, setLogged] = useState(false);

  // Pagination cursor (শেষ doc ধরে রাখার জন্য)
  const [lastDoc, setLastDoc] = useState(null);

  // fetchImageData function database থেকে image data আনে
  const fetchImageData = {
    fetchFirst: async () => {
      const q = query(
        collection(fireStore, "images"),
        orderBy("uploadTimeFirebase", "desc"),
        limit(80)
      );
      const snap = await getDocs(q);

      // doc.id যুক্ত করা হচ্ছে
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      setImages(items);
      // pagination cursor সেট করা হচ্ছে
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
    },

    fetchMore: async () => {
      if (!lastDoc) return; // আর লোড করার কিছু নেই

      const q = query(
        collection(fireStore, "images"),
        orderBy("uploadTimeFirebase", "desc"),
        startAfter(lastDoc),
        limit(20)
      );
      const snap = await getDocs(q);
      const newItems = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // আগের + নতুন, ডুপ্লিকেট বাদ দিয়ে
      setImages((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNew = newItems.filter((item) => !existingIds.has(item.id));
        return [...prev, ...uniqueNew];
      });

      setLastDoc(snap.docs[snap.docs.length - 1] || null);
    },
  };

  // যখন updateData আপডেট হবে তখন fetch হবে
  useEffect(() => {
    fetchImageData.fetchFirst();
    fetchImageData.fetchMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateData]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLogged(true);
        try {
          // dataStore থেকে user data fetch
          const userData = await dataStore.getUserData(user.uid);
          if (userData) {
            setCurrentUser(userData);
            console.log("User Data from dataStore:", userData);
          } else {
            console.log("No user data found in dataStore!");
          }
        } catch (error) {
          console.error("Error fetching user data from dataStore:", error);
        }
      } else {
        setCurrentUser(null);
        setLogged(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // get API key
  useEffect(() => {
    (async () => {
      let key = await dataStore.getApiKey();
      setKey(key);
    })();
  }, []);

  const addImageInStorage = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data?.data?.url;
  };

  // handle files
  async function handleFiles(files) {
    // Convert files to an array of objects
    const filesArr = Array.from(files).map((file) => ({
      imgurl: URL.createObjectURL(file),
      rawFile: file,
    }));

    setIsUserUploadingImage(true);
    setupimages(filesArr);
  }

  return (
    <FirebaseContext.Provider
      value={{
        userAuth, // auth
        dataStore, // store data
        currentUser, // logged user
        logged, // user logged ?? this
        images, // images in database

        handleFiles,

        isUserUploadingImage, // uploaded data
        setIsUserUploadingImage, // uploaded funtion

        upimages, // users uploaded image data state data
        setupimages, // users uploaded image data state funtion

        uploading, // user uploading image ?? check this data
        setUploading, // user uploading image ?? check  funtion

        setupdateData, // user updateData ?? check this update data funtion

        addImageInStorage, // photo convert funtion

        fetchImageData, // fetch functions export করে দিচ্ছি
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}
