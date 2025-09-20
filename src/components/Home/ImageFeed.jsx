import React, { useContext, useState } from "react";
import clsx from "clsx";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { EllipsisVertical, Heart } from "lucide-react";

export default function ImageFeed() {
  const [showOption, setShowOption] = useState(false);
  const { images } = useContext(FirebaseContext);
  

  // download image
  const handleDownload = async (imageUrl, title) => {
    // parameter এর নাম imageUrl
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    console.log(downloadUrl);

    link.download = `${title}.jpg`; // যে নাম দিয়ে ডাউনলোড হবে
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
            "relative",
            file.statuses == "public" && "flex",
            file.statuses == "private" && "hidden",
            "parent_optionBox bg-border5 border-border backdrop-blur-lg sm:p-2 w-full flex-col items-center my-5 cursor-pointer rounded-lg overflow-hidden *:select-none"
          )}
        >
          <div className="w-full h-full object-cover flex flex-col gap-2">
            <img
              loading="lazy"
              src={file.image.url}
              alt={file.image.title}
              className="w-full h-auto object-cover profilePic rounded-lg"
            />
            <div className="p-2 flex md:hidden items-center justify-between gap-[5px]">
              <div className="flex items-center gap-2">
                <img
                  loading="lazy"
                  className="w-[30px] h-[30px] object-cover rounded-full"
                  src={file.photoUrl}
                />
                <p className="text-[1rem] font-semibold">{file.displayName}</p>
              </div>
              <div
                onClick={() =>
                  setShowOption(showOption === file.id ? null : file.id)
                }
              >
                <EllipsisVertical size={20} />
              </div>
            </div>
          </div>

          <div className="optionBox bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black absolute z-30 w-full h-full bottom-0 left-0 flex flex-col justify-between gap-[2px]">
            <article className="flex justify-between items-center">
              <div className="flex items-center gap-1 bg-black/50 rounded-xl">
                <Heart size={16} />
                <h1 className="text-[15px]">Like</h1>
              </div>
              <div
                onClick={() =>
                  setShowOption(showOption === file.id ? null : file.id)
                }
              >
                <EllipsisVertical size={20} />
              </div>
            </article>

            <article>
              <div className="flex items-center gap-[5px]">
                <img
                  loading="lazy"
                  className="w-[30px] h-[30px] object-cover rounded-full"
                  src={file.photoUrl}
                />
                <p className="text-[1rem] font-semibold">{file.displayName}</p>
              </div>
            </article>
          </div>

          <div
            className={clsx(
              showOption === file.id && "show",
              showOption !== file.id && "hidden",
              "bg-black/50 rounded-xl backdrop-blur-md px-2 py-2 absolute right-0 top-0 bottom-10 md:top-[25%] md:bottom-0 w-full h-[75%] z-40"
            )}
          >
            <ul className="flex flex-col gap-2">
              <li className="rounded-lg flex justify-start items-center cursor-pointer px-2 py-[0.2rem] md:hover:bg-[#61DBFB] md:hover:text-black">
                info
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
