import { CloudUpload, Loader, Plus } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FirebaseContext } from "../contexts/FirebaseContext";

// locomotive-scroll-css
import useLocomotiveScroll from "../utils/useLocomotiveScroll";

export default function HomePage() {
  const upBox = useRef(null);
  const [IsDrag, setIsDrag] = useState(false);
  const {
    currentUser, // logged user
    images, // images in database

    setIsUserUploadingImage,  // uploaded funtion
    setupimages, // users uploaded image data sate funtion

    setUserLoggedData, // login user data
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
    setIsDrop(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  }

  // file uploaded images
  function handleFileInput(e) {
    const files = e.target.files;
    handleFiles(files);
  }

  // share data in upload box
  async function handleFiles(files) {
    const currentUserData = currentUser.reloadUserInfo;

    // Convert files to an array of objects
    const filesArr = Array.from(files).map((file) => ({
      imgurl: URL.createObjectURL(file),
      rawFile: file,
    }));

    console.log(filesArr);

    setIsUserUploadingImage(true);
    setupimages(filesArr);
    setUserLoggedData(currentUserData);
  }



  // Hook থেকে ref আর instance নাও
  const { containerRef, scrollInstance } = useLocomotiveScroll({
    smooth: true,
    lerp: 0.07,
  });

  // scroll pause/resume control
  useEffect(() => {
    if (!scrollInstance) return;
    if (searchBoxShowing) {
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
  }, [searchBoxShowing, scrollInstance]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollInstance) scrollInstance.update();
    }, 500); // 0.5s delay after images loaded
    return () => clearTimeout(timer);
  }, [scrollInstance, images]);

  return (
    <div
      ref={containerRef}
      data-scroll-container
      className="min-h-screen w-full flex flex-col home pt-[62px]"
    >
      {/* Preview Area */}
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-5 m-4">
        {images.map((file, idx) => (
          <div
            key={idx}
            className={`relative ${
              file.statuses == "public" ? "flex" : "hidden"
            } w-full flex-col items-center my-5`}
          >
            <img
              loading="lazy"
              src={file.image.url} // file.blob নয়, file দিয়েই blob তৈরি হয়
              alt={""}
              className="w-full h-auto object-cover rounded-lg"
            />
            <div className="absolute w-full bottom-0 left-0 bg-black/20 px-3 py-2 flex flex-col gap-[2px]">
              <div className="flex items-center gap-[5px]">
                <img
                  loading="lazy"
                  className="w-[30px] h-[30px] object-cover rounded-full"
                  src={file.photoUrl}
                  alt={file.image.title}
                />
                <p className="text-[1rem] font-semibold">{file.displayName}</p>
              </div>
              <p className="pl-3 pt-1 text-[0.8rem]">{file.image.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* IsUpload */}
      <div style={{ paddingBottom: "20px" }} className="w-full">
        {uploading ? (
          <section
            className="mt-20 w-full h-[250px] flex flex-col items-center gap-6 justify-center"
          >
            <div className="bg-slate-800/70 border-slate-700 w-[90%] xl:w-[40%] mt-20 h-[250px] flex flex-col justify-center items-center gap-[10px] border-dashed border-[2px] border-slate-50/60 rounded-xl py-40 transition-colors duration-200 overflow-hidden">
              <div className="w-full h-full flex justify-center items-center">
                <Loader className="animate-spin" size={140} />
              </div>
            </div>
          </section>
        ) : (
          <section className="w-full flex flex-col items-center gap-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              ref={upBox}
              className="bg-slate-800/70 border-slate-700 w-[90%] xl:w-[40%] mt-20 h-[250px] flex flex-col justify-center items-center gap-[10px] border-dashed border-[2px] border-slate-50/60 rounded-xl py-40 transition-colors duration-200 overflow-hidden"
            >
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
                    <h1 className="text-[1.2rem] lg:text-[1.3rem]">or</h1>
                    <input
                      type="file"
                      id="uploadFrom"
                      className="hidden"
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
              {IsDrop && (
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
