import { Eye, EyeOff } from "lucide-react";
import React, { useContext, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import google from "../assets/google.png";
import { FirebaseContext } from "../contexts/FirebaseContext";

export default function LoginPage() {
  const [err, setErr] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const { userAuth } = useContext(FirebaseContext);

  async function HandleLoginSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setErr(true);
      toast.error("Email এবং Password লাগবে!");
      return;
    }

    setErr(false);

    try {
      const res = await userAuth.useLogin(email, password);
      if (res !== "error") {
        toast.success("Login Successful!");
        console.log("Logged in user:", res);
      } else {
        toast.error("Login Failed! Wrong credentials.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login Failed! Something went wrong.");
    }
  }

  return (
    <section className="w-full h-screen flex justify-center items-center">
      <form
        onSubmit={(e) => HandleLoginSubmit(e)}
        className="relative z-20 w-[98%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] flex flex-col items-center gap-3 justify-center px-10 py-10 bg-black/10 backdrop-blur-2xl text-white border-[1px] border-slate-50/20 outline-none rounded-xl"
      >
        <h1 className="text-4xl mb-[20px] font-semibold">Login Now</h1>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className={`w-full ring-2 ${
            err ? "ring-red-400 text-red-500" : "ring-[#61DBFB] text-black"
          } text-black text-xl px-3 py-2 rounded-lg border-none outline-none`}
          type="email"
          placeholder="Email..."
        />
        <div className="w-full relative">
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className={`w-full ring-2 ${
              err ? "ring-red-400 text-red-500" : "ring-[#61DBFB] text-black"
            } text-xl px-3 pr-[35px] py-2 rounded-lg border-none outline-none`}
            type={showPass ? "text" : "password"}
            placeholder="Password..."
          />
          <div
            onClick={() => setShowPass((prev) => !prev)}
            className="cursor-pointer absolute right-2 top-[10px]"
          >
            {showPass ? <EyeOff color="#111" /> : <Eye color="#111" />}
          </div>
        </div>
        <div className="w-full flex justify-center items-center">
          <button
            className={`${
              err ? "bg-red-400" : "bg-[#61DBFB] text-gray-950"
            } w-[60%] px-3 py-2 text-xl rounded-lg font-semibold`}
            type="submit"
          >
            Login
          </button>
        </div>
        <hr className="w-full opacity-30 h-[1px]" />
        <div
          onClick={() => {
            userAuth.googleAuth();
          }}
          className="w-full flex justify-center items-center"
        >
          <div className="flex items-center gap-[10px] bg-black/20 border-[1px] border-slate-50/20 px-3 py-2 rounded-2xl cursor-pointer">
            <img className="w-[25px]" src={google} alt="" />
            <h1 className="font-medium">Countinue With Google</h1>
          </div>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </section>
  );
}
