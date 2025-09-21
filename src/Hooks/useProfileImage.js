import { useState, useEffect } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../contexts/Firebase"; // তোমার Firebase app এর path

const fireStore = getFirestore(app);

// Hook: authId দিলে সেই ইউজারের প্রোফাইল ইমেজ URL আনবে
export function useProfileImage(authId) {
  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    if (!authId) return;

    const getProfileImg = async () => {
      try {
        const docRef = doc(fireStore, "users", authId); // users collection
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileImg(docSnap.data().profileImgUrl || null);
        } else {
          setProfileImg(null);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setProfileImg(null);
      }
    };

    getProfileImg();
  }, [authId]);

  return profileImg; // URL
}
