import React, { useContext } from "react";
import logo from "../../assets/react.svg";
import { Upload } from "lucide-react";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { NavLink } from "react-router-dom";

export default function Header() {
    const { currentUser, setIsUserUploadingImage, setupimages, setUserLoggedData } = useContext(FirebaseContext);
    console.log(currentUser);
    // file uploaded images
    function handleFileInput(e) {
      const files = e.target.files;
      handleFiles(files);
    }
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
    
  return (
    <header className="h-[62px] flex justify-between items-center fixed top-0 left-0 right-0 z-30 w-full bg-black/10 backdrop-blur-2xl text-white border-b-[1px] border-b-slate-50/45 py-2 px-3">
      <a href="/" className="flex justify-center items-center gap-[10px]">
        <img loading="lazy" className="animateSpin w-[40px]" src={logo} />
        <h1 className="text-2xl font-semibold">ImgG</h1>
      </a>
      <div>
        <ul className="flex gap-5">
          <NavLink to={"/"}><li>Home</li></NavLink>
          <NavLink to={"/login"}><li>Login</li></NavLink>
          <NavLink to={"/register"}><li>Register</li></NavLink>
        </ul>
      </div>
      {currentUser && (
        <div className="flex items-center gap-[20px]">
          <label htmlFor="upfile">
          <button>
            <Upload />
          </button>
          </label>
          <input onChange={(e) => handleFileInput(e)} className="hidden" type="file" id="upfile" />
  
            <button>
            <img
              className="w-[45px] rounded-full"
              src={
                currentUser.photoURL ? currentUser.photoURL :
                "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
              }
              alt="User"
            />
          </button>
        </div>
      )}
    </header>
  );
}
