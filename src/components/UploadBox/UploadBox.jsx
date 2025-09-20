import React, { useContext, useEffect, useRef, useState } from "react";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { CloudUpload, Loader2Icon, X } from "lucide-react";
import { serverTimestamp } from "firebase/firestore";
import clsx from "clsx";

export default function UploadBox() {
  const upBox = useRef(null);
  const {
    currentUser,

    isUserUploadingImage,  // uploaded data
    setIsUserUploadingImage,  // uploaded funtion

    upimages, // users uploaded image data sate data
    setupimages, // users uploaded image data sate funtion

    handleFiles,

    dataStore, // store data

    uploading, // user uploading image ?? check this data
    setUploading, // user uploading image ?? check  funtion

    setupdateData,

    useAddImageInStorafe
  } = useContext(FirebaseContext);


  const [err, setErr] = useState(false);
  const [submitImage, setSubmitImage] = useState([]);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [satus, setSatus] = useState("");
  const [des, setDes] = useState("");

  const [IsDrag, setIsDrag] = useState(false);

  // submit Data in database
  async function handleSubmit(e) {
    e.preventDefault();
    if (
      tags.length > 0 &&
      title &&
      satus &&
      des &&
      upimages &&
      upimages.length > 0
    ) {
      setUploading(true);

      const promises = upimages.map(async (link) => {
        console.log(link);

        const newImag = await useAddImageInStorafe(link.rawFile);
        console.log(newImag);

        let IsSubmited = await dataStore.addData(["images"], {
          authorEmail: currentUser.email,
          displayName: currentUser.displayName,
          photoUrl: currentUser?.photoURL ?? null,
          uploadTimeFirebase: serverTimestamp(),
          uploadTime: new Date(),
          image: {
            url: newImag,
            title,
            tag: tags.map((t) => t.name),
            description: des,
          },
          statuses: satus,
        });
        return IsSubmited
      });

      try {
        await Promise.all(promises);
        console.log(promises);
        setupdateData((prev) => prev + 1);
        setIsUserUploadingImage(false);
        setupimages(null);
        setTitle("");
        setTags([]);
        setSatus("");
        setDes("");
        setErr(false);
      } catch (err) {
        console.log("Upload failed:", err);
        setErr(true);
      } finally {
        setUploading(false);
      }
      return;
    }
    setErr(true);
  }

  // map all image user uloaded
  useEffect(() => {
    if (!upimages || upimages.length === 0) {
      setSubmitImage([]);
      return;
    }

    function mapFuntion() {
      const results = upimages.map((fileObj) => {
        const file = fileObj.imgurl;
        return { imgurl: file };
      });
      setSubmitImage(results);
    }

    mapFuntion();
  }, [upimages]);

  // sarch box
  function IsNotSing() {
    setIsUserUploadingImage(false);
    setupimages(null);
    setTitle("");
    setTags([]);
    setSatus("");
    setDes("");
    setErr(false);
    setSubmitImage(null);
  }

  // filterImage
  function filterImage(id) {
    setupimages((prev) => prev.filter((_, idx) => idx !== id));
  }

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
  return (
    <>
      {isUserUploadingImage && !uploading && (
        <div className="min-h-screen fixed z-50 overflow-hidden w-full h-full bg-black/30 backdrop-blur-md flex justify-center items-center py-14">
          
          {/* blur bg */}
          <div
            onClick={IsNotSing}
            className="w-screen h-screen absolute z-20"
          ></div>

          {/* main upload box */}
          <div className="scroll-area h-[100%] lg:h-[80%] overflow-y-auto overflow-x-hidden py-8 px-5 relative z-30 w-full md:w-[80%] lg:w-[60%] xl:w-[50%] bg-slate-800/70 border-slate-200/50 border-dashed border-2 rounded-lg text-white">
            <div className="w-full flex justify-between flex-row-reverse mb-5">
              <div onClick={() => IsNotSing()}>
                <X />
              </div>
              {/* Scroll hint text for mobile */}
              <div className="block sm:hidden text-slate-400 text-xs mb-2 animate-pulse">
                👉 Slide to see more
              </div>
            </div>

            {/* Preview Area */}
            <div>
              <div className="relative w-full">
                {/* Left fade gradient */}
                <div className="rounded-2xl absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-slate-900 to-transparent z-10 sm:hidden" />
                {/* Right fade gradient */}
                <div className="rounded-2xl absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-slate-900 to-transparent z-10 sm:hidden" />

                {/* images box */}
                <div className="px-3 py-2 scroll-area h-[200px] pb-3 flex gap-[20px] even:bg-black justify-start items-center overflow-x-auto shadow-inner shadow-slate-900 rounded-xl">
                  {submitImage.length > 0 &&
                    submitImage.map((link, idx) => (
                      <div
                        key={idx}
                        className="relative w-full min-w-[250px] h-full overflow-hidden"
                      >
                        <img
                          loading="lazy"
                          src={link.imgurl}
                          alt={`img-${idx}`}
                          className="h-full w-full object-cover rounded-2xl"
                        />
                        <button
                          onClick={() => filterImage(idx)}
                          className="absolute top-2 right-2 bg-black/80 backdrop-blur-2xl rounded-full p-1"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}

                  {submitImage.length == 0 && (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      ref={upBox}
                      className="bg-slate-800/70 border-slate-700 w-full py-3 flex flex-col justify-center items-center gap-[10px] border-dashed border-[1px] border-slate-50/60 rounded-xl transition-colors data-scroll-section"
                    >
                      {!IsDrag && (
                        <>
                          <label
                            htmlFor="uploadFrom"
                            className="flex flex-col items-center cursor-pointer"
                          >
                            <CloudUpload size={80} />
                            <h1 className="text-[1.2rem] ">
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
                              className="text-[1rem] lg:text-[1.1rem] text-[#7d97f4] font-medium cursor-pointer"
                            >
                              Browse
                            </label>
                          </div>
                        </>
                      )}
                      {IsDrag && (
                        <div className="flex flex-col justify-center items-center gap-2">
                        <Plus size={120} />
                      </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="flex flex-col gap-3 mt-4">
                <label className="text-[1.25rem]" htmlFor="title">
                  Title
                </label>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  className={clsx(
                    "w-full ring-2",
                      err  && "ring-red-400 text-red-500",
                      !err  && "ring-[#61DBFB] text-black",
                    "text-[1.28rem] font-normal px-3 pr-[35px] py-2 rounded-lg border-none outline-none"
                  )}
                  id="title"
                  type="text"
                  placeholder="type title..."
                  required
                />
              </div>
              <div>
                <div className="flex flex-col gap-3 mt-4">
                  <label className="text-[1.25rem]" htmlFor="tags">
                    Tags
                  </label>
                  <input
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (e.target.value.trim() !== "") {
                          setTags([...tags, { name: e.target.value.trim() }]);
                          e.target.value = "";
                        }
                      }
                    }}
                    className={clsx(
                      "w-full ring-2",
                        err  && "ring-red-400 text-red-500",
                        !err  && "ring-[#61DBFB] text-black",
                      "text-[1.28rem] font-normal px-3 pr-[35px] py-2 rounded-lg border-none outline-none"
                    )}
                    type="text"
                    placeholder="type tags then press space or enter..."
                  />
                </div>
                <div
                  className={clsx(
                    "relative mt-5 bg-slate-100 w-full min-h-[250px] ring-2",
                      err  && "ring-red-400 text-red-500",
                      !err  && "ring-[#61DBFB] text-black",
                    "text-[1.28rem] font-normal px-3 pr-[35px] py-2 rounded-lg border-none outline-none"
                  )}
                >
                  {tags &&
                    tags.map((tag, idx) => (
                      <div
                        key={idx}
                        className="flex overflow-hidden bg-[#61DBFB] min-w-7 h-10 rounded-xl"
                      >
                        <div className="w-full flex justify-center origin-center px-3 py-1">
                          {tag.name}
                        </div>
                        <button
                          onClick={() => filterTags(idx)}
                          className="w-[20px] bg-black/50 backdrop-blur-2xl rounded-e-xl p-1"
                        >
                          <X color="#fff" size={13} />
                        </button>
                      </div>
                    ))}
                  {Object.values(tags).length == 0 && (
                    <span className="select-none absolute top-2 left-3 text-[1.28rem] font-m text-black/40">
                      Tags Place e@ there added all tag
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full mt-4">
                <label className="text-[1.25rem]" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  onChange={(e) => setDes(e.target.value)}
                  value={des}
                  placeholder="type your description.."
                  className={clsx(
                    "h-full resize-none flex gap-3 flex-wrap mt-3 min-h-[150px] w-full ring-2",
                    err && "ring-red-400 text-red-500",
                    !err && "ring-[#61DBFB] text-black",
                    "text-[1.28rem] font-normal px-3 pr-[35px] py-2 rounded-lg border-none outline-none bg-slate-50"
                  )}
                ></textarea>
              </div>
              <div className="flex flex-col gap-3 mt-4 px-5">
                <label className="text-[1.25rem]" htmlFor="satus">
                  Select Satus
                </label>
                <select
                  value={satus}
                  onChange={(e) => setSatus(e.target.value)}
                  className={clsx(
                    "w-full ring-2",
                      err  && "ring-red-400 text-red-500",
                      !err  && "ring-[#61DBFB] text-black",
                    "text-[1.28rem] font-normal px-3 pr-[35px] py-2 rounded-lg border-none outline-none"
                  )}
                  required
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="w-full flex flex-col justify-center items-center mt-8">
                <button
                  className={`${
                    err ? "bg-red-400" : "bg-[#61DBFB] text-gray-950"
                  } w-[60%] px-3 py-2 text-xl rounded-lg font-semibold flex justify-center items-center`}
                  type="submit"
                >
                  {uploading ? (
                    <Loader2Icon className="animate-spin" size={35} />
                  ) : (
                    "Public"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUserUploadingImage && uploading && (
        <>
          {/* main upload box */}
          <div className="scroll-area h-[100%] lg:h-[80%] overflow-y-auto overflow-x-hidden py-8 px-5 relative z-30 w-full md:w-[80%] lg:w-[60%] xl:w-[50%] bg-slate-800/70 border-slate-200/50 border-dashed border-2 rounded-lg text-white">
              <h1>Uploading</h1>
          </div>
        </>
      )}
    </>
  );
}
