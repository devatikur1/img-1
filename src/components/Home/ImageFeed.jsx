import React, { useContext, useState, useEffect } from "react";
import clsx from "clsx";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { EllipsisVertical } from "lucide-react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../../contexts/Firebase";

const fireStore = getFirestore(app);

export default function ImageFeed() {
  const [showOption, setShowOption] = useState(null);
  const { images } = useContext(FirebaseContext);
  const [profiles, setProfiles] = useState({}); // {authId: url}

  // সব প্রোফাইল একসাথে ফেচ করা
  useEffect(() => {
    const fetchProfiles = async () => {
      const allProfiles = {};
      for (const file of images) {
        if (file.authId && !allProfiles[file.authId]) {
          try {
            const docRef = doc(fireStore, "users", file.authId);
            const docSnap = await getDoc(docRef);
            allProfiles[file.authId] = docSnap.exists()
              ? docSnap.data().profileImgUrl || null
              : null;
          } catch (err) {
            console.log(err);
            
            allProfiles[file.authId] = null;
          }
        }
      }
      setProfiles(allProfiles);
    };
    if (images.length > 0) {
      fetchProfiles();
    }
  }, [images]);

  // Download function
  const handleDownload = async (imageUrl, title) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-5 m-4">
      {images.map((file) => (
        <div
          key={file.id}
          className={clsx(
            "relative bg-border5 border-border backdrop-blur-lg sm:p-2 w-full flex-col items-center my-5 cursor-pointer rounded-lg overflow-hidden *:select-none",
            file.status === "public" ? "flex" : "hidden"
          )}
        >
          <div className="w-full h-full object-cover flex flex-col gap-2">
            <img
              loading="lazy"
              src={file.image.url}
              alt={file.image.title}
              className="w-full h-auto object-cover rounded-lg"
            />

            <div className="p-2 flex md:hidden items-center justify-between gap-[5px]">
              <div className="flex items-center gap-2">
                <img
                  loading="lazy"
                  className="w-[30px] h-[30px] object-cover rounded-full"
                  src={
                    profiles[file.authId] || "/src/assets/emptyProfileImg.svg"
                  }
                  alt="profile"
                />
                <p className="text-[1rem] font-semibold">{file.displayName}</p>
              </div>
              <div
                className="parent_optionBox"
                onClick={() =>
                  setShowOption(showOption === file.id ? null : file.id)
                }
              >
                <EllipsisVertical size={20} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-transparent via-transparent to-black absolute bottom-0 flex flex-row-reverse w-full px-2 pb-5 h-full justify-between">
            <div className="flex items-end">
              <div
                className="parent_optionBox"
                onClick={() =>
                  setShowOption(showOption === file.id ? null : file.id)
                }
              >
                <EllipsisVertical size={20} />
              </div>
            </div>
            <div className="flex items-end gap-2 pl-1">
              <img
                loading="lazy"
                className="w-[30px] h-[30px] object-cover rounded-full"
                src={profiles[file.authId] || "/src/assets/emptyProfileImg.svg"}
                alt="profile"
              />
              <p className="text-[1rem] font-semibold">
                {file.displayName || "Unkonw user"}
              </p>
            </div>
          </div>

          <div
            className={clsx(
              showOption === file.id ? "show" : "hidden",
              "optionBox bg-black/50 rounded-xl backdrop-blur-md px-2 py-2 absolute right-0 top-0 bottom-10 w-full h-[75%] z-40"
            )}
          >
            <ul className="flex flex-col gap-2 w-full">
              <li className="rounded-lg flex justify-start items-center cursor-pointer px-2 py-[0.2rem] md:hover:bg-[#61DBFB] md:hover:text-black">
                Info
              </li>
              <li
                onClick={() => handleDownload(file.image.url, file.image.title)}
                className="rounded-lg flex justify-start items-center cursor-pointer px-2 py-[0.2rem] md:hover:bg-[#61DBFB] md:hover:text-black"
              >
                Download
              </li>
              <hr />
              <li className="rounded-lg flex justify-start items-center cursor-pointer px-2 py-[0.2rem] md:hover:bg-red-500 md:hover:text-white text-red-500">
                Delete
              </li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
