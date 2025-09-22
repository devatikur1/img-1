import React, { useContext } from "react";
import emptyProfileImg from "../../assets/emptyProfileImg.svg";
import { Upload } from "lucide-react";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import { toast } from "react-toastify";

export default function Header() {
  const { currentUser, logged, handleFiles } = useContext(FirebaseContext);
  // console.table(currentUser);

  // file uploaded images
  function handleFileInput(e) {
      const files = e.target.files;
      let mainFile = Array.from(files).filter((file) => file.size < 32000000);
      console.log(mainFile);
      if (mainFile.length == 0) {
        toast.error("Please upload image up to 35MB");
        return;
      }
      handleFiles(mainFile);
    }

  return (
    <header className="shadow-primary-lg h-[62px] flex justify-between items-center fixed top-0 left-0 right-0 z-30 w-full bg-background backdrop-blur-2xl border-b-[2px] border-b-[#4953b2] py-2 px-3">
      <Link to="/" className="flex justify-center items-center">
        <div>
          <Logo />
        </div>
        <h1 className="block text-[1.6rem] font-semibold">Imagary</h1>
      </Link>
      <div>
        <ul className="flex gap-2 sm:gap-5">
          <NavLink
            className={({ isActive }) =>
              isActive ? "sideOption active" : "sideOption"
            }
            to={"/"}
          >
            <li className="text-[0.9rem] sm:text-[1rem]">Home</li>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "sideOption active" : "sideOption"
            }
            to={"/login"}
          >
            <li className="text-[0.9rem] sm:text-[1rem]">Login</li>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "sideOption active" : "sideOption"
            }
            to={"/register"}
          >
            <li className="text-[0.9rem] sm:text-[1rem]">Register</li>
          </NavLink>
        </ul>
      </div>
      {logged && currentUser && (
        <div className="flex items-center gap-[20px]">
          <label htmlFor="upfile">
            <Upload />
          </label>
          <input
            onChange={(e) => handleFileInput(e)}
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
            type="file"
            id="upfile"
          />

          <button className="border-2 border-[#7d97f4] shadow-primary-lg rounded-full">
            <img
              className="w-[45px] rounded-full"
              src={currentUser?.profileImgUrl || emptyProfileImg}
              alt={currentUser?.name || "User"}
            />
          </button>
        </div>
      )}
    </header>
  );
}
