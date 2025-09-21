import React, { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { Loader, CloudUpload, Plus } from "lucide-react";

export default function UploadFeed() {
  const upBox = useRef(null);
  const [IsDrag, setIsDrag] = useState(null);
  const [IsUpload, setIsUpload] = useState(null);

  const { handleFiles, uploading, logged } = useContext(FirebaseContext);

  // Drag Over
  function handleDragOver(e) {
    e.preventDefault();
    upBox.current.classList.add("border-[#4953b2]");
    upBox.current.classList.remove("border-slate-700");
    setIsDrag(true);
  }

  // Drag leave
  function handleDragLeave() {
    upBox.current.classList.remove("border-[#4953b2]");
    upBox.current.classList.add("border-slate-700");
    setIsDrag(false);
  }

  // Drop image
  function handleDrop(e) {
    e.preventDefault();
    upBox.current.classList.remove("border-[#4953b2]");
    upBox.current.classList.add("border-slate-700");
    setIsDrag(false);

    const files = e.dataTransfer.files;
    setIsUpload(true);
    let mainFile = Array.from(files).filter((file) => file.size < 32000000);
    console.log(mainFile);
    if (mainFile.length == 0) {
      toast.error("Please upload image up to 35MB");
      return;
    }
    setIsUpload(false);
    handleFiles(mainFile);
  }

  // file uploaded images
  function handleFileInput(e) {
    const files = e.target.files;
    setIsUpload(true);
    let mainFile = Array.from(files).filter((file) => file.size < 32000000);
    console.log(mainFile);
    if (mainFile.length == 0) {
      toast.error("Please upload image up to 35MB");
      return;
    }
    setIsUpload(false);
    handleFiles(mainFile);
  }
  
  return (
    <div style={{ paddingBottom: "20px" }} className="w-full">
      {/* Show upload section only if user is logged in */}
      {logged && (
        <>
          {/* when Uploading */}
          {(uploading || IsUpload) && (
        <section className="mt-20 w-full h-[250px] flex flex-col items-center gap-6 justify-center">
          <div className="bg-slate-800/70 border-slate-700 w-[90%] xl:w-[40%] mt-20 h-[250px] flex flex-col justify-center items-center gap-[10px] border-dashed border-[1px] border-slate-50/60 rounded-xl py-40 transition-colors duration-200 overflow-hidden">
            <div className="w-full h-full flex justify-center items-center">
              <Loader className="animate-spin" size={140} />
            </div>
          </div>
        </section>
      )}

       {/* when not Uploading */}
       {(!uploading && !IsUpload) && (
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
                  <h1 className="text-[0.75rem] font-light text-white/75 lg:text-[0.85rem]">
                    PNG, JPG, JPEG up to 35MB
                  </h1>
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
                    className="text-[1rem] lg:text-[1.1rem] text-[#7d97f4] font-medium cursor-pointer"
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
        </>
      )}
    </div>
  );
}
