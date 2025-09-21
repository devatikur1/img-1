import { app } from "./Firebase";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  doc,
} from "firebase/firestore";
const fireStore = getFirestore(app);

// store data in database use this obeject dataStore
export const dataStore = {
  addData: async (dataName, data) => {
    try {
      const collectionRef = collection(fireStore, dataName);
      const docRef = await addDoc(collectionRef, data);
      return docRef;
    } catch (error) {
      console.log(`Add-data: ${error}`);
      return "error";
    }
  },

  getApiKey: async () => {
    const docRef = doc(fireStore, "api", "key");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().key;
    } else {
      console.log("No such document!");
      return "error";
    }
  },

  getUserData: async (userId) => {
    const docRef = doc(fireStore, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  },
};
