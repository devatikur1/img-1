import { Eye, EyeOff } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { FirebaseContext } from "../contexts/FirebaseContext";
import google from "../assets/google.png";
import clsx from "clsx";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function SignUpPages() {
  const [err, setErr] = useState(false);

  // all input
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // password show funtion
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // from err input
  const [errFullName, setErrFullName] = useState(false);
  const [errUsername, setErrUsername] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errPassword, setErrPassword] = useState(false);
  const [errConfirmPassword, setErrConfirmPassword] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false)

  const { userAuth } = useContext(FirebaseContext);
  const navigate = useNavigate();

  const passRules = [
    {
      text: "At least 8 characters",
      isValid: password.length >= 8,
    },
    {
      text: "At least one uppercase letter",
      isValid: /[A-Z]/.test(password),
    },
    {
      text: "At least one number",
      isValid: /\d/.test(password),
    },
    {
      text: "At least one special character",
      isValid: /[@$!%#^()*?&]/.test(password),
    },
  ];

  useEffect(() => {
    // Email Validation
    if (email !== "" && !email.includes("@gmail.com")) {
      setErrEmail(true);
    } else {
      setErrEmail(false);
    }

    if (password !== "" && passRules.some((rule) => rule.isValid === false)) {
      setErrPassword(true);
    } else {
      setErrPassword(false);
    }
    

    // Confirm Password Validation
    if (confirmPassword !== "" && confirmPassword !== password) {
      setErrConfirmPassword(true);
    } else {
      setErrConfirmPassword(false);
    }

    const isInvalid =
    fullName === "" ||
    username === "" ||
    email === "" ||
    !email.includes("@gmail.com") ||
    passRules.some((rule) => rule.isValid === false) ||
    password !== confirmPassword;

    setIsDisabled(isInvalid);
  }, [fullName, username, email, password, confirmPassword]);

  async function HandleLoginSubmit(e) {
    e.preventDefault();
  
    const isInvalid =
    fullName === "" ||
    username === "" ||
    email === "" ||
    !email.includes("@gmail.com") ||
    passRules.some((rule) => rule.isValid === false) ||
    password !== confirmPassword;
  
    if (isInvalid) {
      setErrFullName(fullName === "");
      setErrUsername(username === "");
      setErrEmail(email === "" || !email.includes("@gmail.com"));
      setErrPassword(password === "" || passRules.some((rule) => !rule.isValid));
      setErrConfirmPassword(confirmPassword !== "" && confirmPassword !== password);
      setErr(true);
      toast.error("Invalid Form");
      return;
    }
  
    // valid হলে submit
    setErr(false);
    const signInRes = await userAuth.useSignIn(email, password);
    console.log(signInRes);
  
    if (signInRes === "error") {
      setErr(true);
      toast.error("Please type your Info");
      return;
    } else {
      toast.success("Account Created Successfully!");
      navigate("/");
    }
  }
  

  return (
    <section className="w-full h-screen flex justify-center items-center">
      <form
        onSubmit={(e) => HandleLoginSubmit(e)}
        className="relative z-20  w-[98%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] flex flex-col items-center gap-3 justify-center px-10 py-10 bg-black/10 backdrop-blur-2xl text-white border-[1px] border-slate-50/20 outline-none rounded-xl"
      >
        <h1 className="text-4xl mb-[20px] font-semibold">Create a Account</h1>
        <div className="w-full flex gap-[8px]">
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            className={clsx(
              "w-full ring-2",
              errFullName && "ring-red-400 text-red-500",
              !errFullName && "ring-[#61DBFB] text-black",
              "text-black text-xl px-3 py-2 rounded-lg border-none outline-none"
            )}
            type="text"
            placeholder="Full Name..."
          />
          <input
            onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
            value={username}
            className={clsx(
              "w-full ring-2",
              errUsername && "ring-red-400 text-red-500",
              !errUsername && "ring-[#61DBFB] text-black",
              "text-black text-xl px-3 py-2 rounded-lg border-none outline-none"
            )}
            type="text"
            placeholder="Username..."
          />
        </div>
        <input
          onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
          value={email}
          className={clsx(
            "w-full ring-2",
            errEmail && "ring-red-400 text-red-500",
            !errEmail && "ring-[#61DBFB] text-black",
            "text-black text-xl px-3 py-2 rounded-lg border-none outline-none"
          )}
          type="email"
          placeholder="Email..."
        />
        <article className="flex flex-col w-full gap-3">
          <div className="w-full relative">
            <input
              onChange={(e) => setPassword(e.target.value.trim())}
              value={password}
              className={clsx(
                "w-full ring-2",
                errPassword && "ring-red-400 text-red-500",
                !errPassword && "ring-[#61DBFB] text-black",
                "text-black text-xl px-3 py-2 rounded-lg border-none outline-none appearance-none"
              )}
              type={showPass ? "text" : "password"}
              placeholder="Password..."
            />
            <div
              onClick={() => setShowPass((prev) => !prev)}
              className="cursor-pointer absolute right-2 top-[10px]"
            >
              {showPass ? <Eye color="#111" /> : <EyeOff color="#111" />}
            </div>
          </div>

          {/* password ruls */}
          <article
            className={clsx(
              errPassword && "flex flex-col gap-[6px]",
              !errPassword && "hidden"
            )}
          >
            {passRules.map((passRule, id) => (
              <div key={id} className="flex items-center gap-[8px]">
                {passRule.isValid ? (
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="100%"
                    fill="var(--toastify-icon-color-success)"
                  >
                    <path d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"></path>
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="100%"
                    fill="var(--toastify-icon-color-error)"
                  >
                    <path d="M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"></path>
                  </svg>
                )}
                <p
                  className={`${
                    passRule.isValid ? "text-white" : "text-red-300"
                  } font-medium`}
                >
                  {passRule.text}
                </p>
              </div>
            ))}
          </article>

          {/* confrimpass */}
          <div className="w-full relative">
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className={clsx(
                "w-full ring-2",
                errConfirmPassword && "ring-red-400 text-red-500",
                !errConfirmPassword && "ring-[#61DBFB] text-black",
                "text-black text-xl px-3 py-2 rounded-lg border-none outline-none"
              )}
              type={showConfirmPass ? "text" : "password"}
              placeholder="Confirm Password..."
            />
            <div
              onClick={() => setShowConfirmPass((prev) => !prev)}
              className="cursor-pointer absolute right-2 top-[10px]"
            >
              {showConfirmPass ? <Eye color="#111" /> : <EyeOff color="#111" />}
            </div>
          </div>
        </article>
        <div className="w-full flex justify-center items-center">
          <button
            disabled={isDisabled}
            className={clsx(
              err && "bg-red-400 pointer-events-none opacity-[0.7]",
              !err  && "bg-[#61DBFB] text-gray-950 pointer-events-auto",
              isDisabled && "pointer-events-none",
              !isDisabled && "pointer-events-auto",
              "w-[60%] px-3 py-2 text-xl rounded-lg font-semibold select-none pointer-events-auto"
            )}
            type="submit"
          >
            Sign Up
          </button>
        </div>
        <hr className="w-full opacity-30 h-[1px]" />
        <div className="text-center mt-2">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#61DBFB] hover:underline">
              Log In
            </Link>
          </p>
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
        </div>{" "}
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
