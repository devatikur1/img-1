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
  getDoc,
  doc,
} from "firebase/firestore";
import { dataStore } from "./FireStore";
import { CheackSame } from "../Hooks/useCheackSame";

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

  // fetchImageData funtion database thke image data ane
  const fetchImageData = {
    fetchFirst: async () => {
      const q = query(
        collection(fireStore, "images"),
        orderBy("uploadTimeFirebase", "desc"),
        limit(80)
      );
      const snap = await getDocs(q);
      const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setImages(items);
    },

    fetchMore: async () => {
      const docRef = doc(fireStore, "images");
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());
      setImages(docSnap.data());
    },
  };

  // when upsateData id update then call this funtion
  useEffect(() => {
    fetchImageData.fetchFirst();
    fetchImageData.fetchMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateData]);

  useEffect(() => {
    console.log(images);
  }, [images]);

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

  // get api
  useEffect(() => {
    (async () => {
      let key = await dataStore.getApiKey();
      setKey(key);
    })();
  }, []);

  // emni..
  useEffect(() => {
    // console.log(images);
  }, [images]);

  const addImageInStorage = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    // console.log(key);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    // console.log(data);
    return data?.data?.url;
  };

  // handlefils
  async function handleFiles(files) {
    // Convert files to an array of objects
    const filesArr = Array.from(files).map((file) => ({
      imgurl: URL.createObjectURL(file),
      rawFile: file,
    }));

    // console.log(filesArr);
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

        upimages, // users uploaded image data sate data
        setupimages, // users uploaded image data sate funtion

        uploading, // user uploading image ?? check this data
        setUploading, // user uploading image ?? check  funtion

        setupdateData, // user updateData ?? check this update data funtion

        addImageInStorage, // photo convart funtion
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}
