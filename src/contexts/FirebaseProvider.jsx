import React, { useEffect, useState } from "react";
import { FirebaseContext } from "./FirebaseContext";
import { app } from "./Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { userAuth } from './FirebaseAuth';
import {
  collection,
  getFirestore,
  getDocs,
  query,
  orderBy,
  startAfter,
  limit,
} from "firebase/firestore";
import { dataStore } from "./FireStore";
import useCheackSame from "../Hooks/useCheackSame";

const auth = getAuth(app);
const fireStore = getFirestore(app);

export function FirebaseProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const [key, setKey] = useState("");

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

  const [logged, setLogged] = useState(false);


  // fetchImageData funtion database thke image data ane
  const fetchImageData = {
    fetchFirst: async () => {
      setLoading(true);
      const q = query(
        collection(fireStore, "images"),
        orderBy("uploadTimeFirebase", "desc"),
        limit(20)
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
      const filteredItems = useCheackSame(images, items, "id")
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
      if (user) {
        let userObj = {
          name: user.displayName || null,
          email: user.email, // safer
          profileImgUrl: user.photoURL || null,
          atLogged: new Date(),
          atSignIn: new Date(),
        };
        console.log("Logged in:", userObj);
        console.log("Logged in:", userObj.atLogged.getDay());
        console.log(user);
        
        setCurrentUser(user);
        setLogged(true);
      } else {
        console.log("No user logged in");
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

  const useAddImageInStorafe = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    console.log(key);
    

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${key}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    console.log(data);
    return data?.data?.url;
  };

  async function handleFiles(files) {

    // files.filter((file) => console.log(file)
    // )
  
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

        isUserUploadingImage,  // uploaded data
        setIsUserUploadingImage,  // uploaded funtion

        upimages, // users uploaded image data sate data
        setupimages, // users uploaded image data sate funtion

        uploading, // user uploading image ?? check this data
        setUploading, // user uploading image ?? check  funtion

        setupdateData, // user updateData ?? check this update data funtion

        useAddImageInStorafe // photo convart funtion
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}
