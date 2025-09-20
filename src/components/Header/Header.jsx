import React, { useContext } from "react";
import logo from "../../assets/react.svg";
import emptyProfileImg from '../../assets/emptyProfileImg.svg'
import { Upload } from "lucide-react";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
    const { currentUser, logged, handleFiles } = useContext(FirebaseContext);
    // console.table(currentUser);

    // file uploaded images
    function handleFileInput(e) {
      const files = e.target.files;
      handleFiles(files);
    }
    
  return (
    <header className="h-[62px] flex justify-between items-center fixed top-0 left-0 right-0 z-30 w-full bg-black/10 backdrop-blur-2xl text-white border-b-[1px] border-b-slate-50/45 py-2 px-3">
      <Link to="/" className="flex justify-center items-center gap-[10px]">
        <img loading="lazy" className="animateSpin w-[40px]" src={logo} />
        <h1 className="block text-2xl font-semibold">ImgG</h1>
      </Link>
      <div>
        <ul className="flex gap-2 sm:gap-5">
          <NavLink to={"/"}><li className="text-[0.9rem] sm:text-[1rem]">Home</li></NavLink>
          <NavLink to={"/login"}><li className="text-[0.9rem] sm:text-[1rem]">Login</li></NavLink>
          <NavLink to={"/register"}><li className="text-[0.9rem] sm:text-[1rem]">Register</li></NavLink>
        </ul>
      </div>
      {logged && (
        <div className="flex items-center gap-[20px]">
          <label htmlFor="upfile">

            <Upload />
          </label>
          <input onChange={(e) => handleFileInput(e)} className="hidden" type="file" id="upfile" />
  
            <button>
            <img
              className="w-[45px] rounded-full"
              src={currentUser?.profileImgUrl || emptyProfileImg}
              alt="User"
            />
          </button>
        </div>
      )}
    </header>
  );
}