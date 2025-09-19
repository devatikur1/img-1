import { CloudUpload, EllipsisVertical, Heart, Loader, Plus } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FirebaseContext } from "../contexts/FirebaseContext";

// locomotive-scroll-css
import useLocomotiveScroll from "../Hooks/useLocomotiveScroll";
import clsx from "clsx";
import { toast } from "react-toastify";

export default function HomePage() {
  const upBox = useRef(null);
  const [showOption, setShowOption] = useState(false)


  const [IsDrag, setIsDrag] = useState(null);
  const [IsUpload, setIsUpload] = useState(null);
  const {
    images, // images in database

    isUserUploadingImage,
    handleFiles,

    uploading, // user uploading image ?? check this data
  } = useContext(FirebaseContext);

  // Drag Over
  function handleDragOver(e) {
    e.preventDefault();
    upBox.current.classList.add("border-slate-500");
    upBox.current.classList.remove("border-slate-700");
    setIsDrag(true);
  }

  // Drag leave
  function handleDragLeave() {
    upBox.current.classList.remove("border-slate-500");
    upBox.current.classList.add("border-slate-700");
    setIsDrag(false);
  }

  // Drop image
  function handleDrop(e) {
    e.preventDefault();
    upBox.current.classList.remove("border-blue-400");
    setIsDrag(false);

    const files = e.dataTransfer.files;
    setIsUpload(true);
    Array.f
    handleFiles(files);
  }

  // file uploaded images
  function handleFileInput(e) {
    const files = e.target.files;
    setIsUpload(true);
    let mainFile = Array.from(files).filter((file) => file.size < 32000000);
    console.log(mainFile);
    if (mainFile.length == 0) {
      toast.error("Please upload image up to 35MB")
      return;
    }
    setIsUpload(false);
    handleFiles(files);
  }


  // Hook থেকে ref আর instance নাও
  const { containerRef, scrollInstance } = useLocomotiveScroll({
    smooth: true,
    lerp: 0.07,
  });

  // scroll pause/resume control
  useEffect(() => {
    if (!scrollInstance) return;
    if (isUserUploadingImage) {
      scrollInstance.stop();
      document.body.classList.add("overflow-hidden");
    } else {
      scrollInstance.start();
      document.body.classList.remove("overflow-hidden");
    }

    // ✅ Change: cleanup on unmount
    return () => {
      scrollInstance.start();
      document.body.classList.remove("overflow-hidden");
    };
  }, [isUserUploadingImage, scrollInstance]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollInstance) scrollInstance.update();
    }, 500); // 0.5s delay after images loaded
    return () => clearTimeout(timer);
  }, [scrollInstance, images]);

  // download image
  const handleDownload = async (imageUrl, title) => { // parameter এর নাম imageUrl
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
    <div
      ref={containerRef}
      data-scroll-container
      className="min-h-screen w-full flex flex-col home pt-[62px]"
    >
      {/* Preview Area */}
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-5 m-4">
        {images.map((file) => (
          <div
            key={file.id}
            className={clsx(
              "relative",
              file.statuses == "public" && "flex",
              file.statuses == "private" && "hidden",
              "parent_optionBox bg-slate-800/80 border border-slate-700 sm:p-2 w-full flex-col items-center my-5 cursor-pointer rounded-lg overflow-hidden *:select-none"
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
                  <div onClick={() => setShowOption(showOption === file.id ? null : file.id)}>
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
                <div onClick={() => setShowOption(showOption === file.id ? null : file.id)}>
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
            
            <div className={clsx(
              showOption === file.id && "show",
              showOption !== file.id && "hidden",
              "bg-black/50 rounded-xl backdrop-blur-md px-2 py-2 absolute right-0 top-0 bottom-10 md:top-[25%] md:bottom-0 w-full h-[75%] z-40"
            )}>

              <ul className="flex flex-col gap-2">
                <li className="rounded-lg flex justify-start items-center cursor-pointer px-2 py-[0.2rem] md:hover:bg-[#61DBFB] md:hover:text-black">info</li>
                <li onClick={() => handleDownload(file.image.url, file.image.title)} className="rounded-lg flex justify-start items-center cursor-pointer px-2 py-[0.2rem] md:hover:bg-[#61DBFB] md:hover:text-black">Download</li>
                <hr />
                <li className="rounded-lg flex justify-start items-center cursor-pointer px-2 py-[0.2rem] md:hover:bg-red-500 md:hover:text-white text-red-500">Delete</li>
              </ul>
            </div>

          </div>
        ))}
      </div>

      {/* IsUpload */}
      <div style={{ paddingBottom: "20px" }} className="w-full">
        {uploading || IsUpload ? (
          // when Uploading
          <section
            className="mt-20 w-full h-[250px] flex flex-col items-center gap-6 justify-center"
          >
            <div className="bg-slate-800/70 border-slate-700 w-[90%] xl:w-[40%] mt-20 h-[250px] flex flex-col justify-center items-center gap-[10px] border-dashed border-[1px] border-slate-50/60 rounded-xl py-40 transition-colors duration-200 overflow-hidden">
              <div className="w-full h-full flex justify-center items-center">
                <Loader className="animate-spin" size={140} />
              </div>
            </div>
          </section>
        ) : (
          // when not Uploading
          <section className="w-full flex flex-col items-center gap-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              ref={upBox}
              className="bg-slate-800/70 border-slate-700 w-[90%] xl:w-[40%] mt-20 h-[250px] flex flex-col justify-center items-center gap-[10px] border-dashed border-[1px] border-slate-50/60 rounded-xl py-40 transition-colors duration-200 overflow-hidden"
            >
              {/* when is drag false */}
              {!IsDrag && (
                <>
                  <label
                    htmlFor="uploadFrom"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <CloudUpload size={90} />
                    <h1 className="text-[1rem] lg:text-xl">
                      Drag & Drop to Upload File
                    </h1>
                  </label>
                  <div className="flex items-center justify-center gap-2">
                  <h1 className="text-[0.75rem] font-light text-white/75 lg:text-[0.85rem]">PNG, JPG, JPEG up to 35MB</h1>
                    <input
                      type="file"
                      id="uploadFrom"
                      className="hidden"
                      accept="image/png, image/jpeg, image/jpg" 
                      multiple
                      onChange={handleFileInput}
                    />
                    <label
                      htmlFor="uploadFrom"
                      className="text-[1rem] lg:text-[1.1rem] text-[#61DBFB] font-medium cursor-pointer"
                    >
                      Browse
                    </label>
                  </div>
                </>
              )}
              {/* when is drag true */}
              {IsDrag && (
                <div className="flex flex-col justify-center items-center gap-2">
                  <Plus size={120} />
                </div>
              )}
            </div>
          </section>
        )}
      </div>

    </div>
  );
}
