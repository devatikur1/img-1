import { Eye, EyeOff } from "lucide-react";
import React, { useContext, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import google from "../assets/google.png";
import { FirebaseContext } from "../contexts/FirebaseContext";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { getPostCodeAndState } from "../Hooks/useGetPostCodeAndState";
import { getGeoLocation } from "../Hooks/useGetGeoLocation";
import { getOS } from "../Hooks/useGetOs";
import { getData } from "../Hooks/useGetData";

export default function LoginPage() {
  const [err, setErr] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [errPassword, setErrPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [errEmail, setErrEmail] = useState(false);

  const { userAuth } = useContext(FirebaseContext);
  const navigate = useNavigate();

  async function HandleLoginSubmit(e) {
    e.preventDefault();

    // Reset error states
    setErr(false);
    setErrEmail(false);
    setErrPassword(false);

    // Validate email
    if (!email || email.trim() === "") {
      setErrEmail(true);
      toast.error("Please enter your email!");
      return;
    }

    // Validate password
    if (!password || password.trim() === "") {
      setErrPassword(true);
      toast.error("Please enter your password!");
      return;
    }

    try {
      const res = await userAuth.useLogin(email, password);
      console.log(res);

      if (res !== "error") {
        toast.success("Login Successful!");
        console.log("Logged in user:", res);
        navigate("/");
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
        className={clsx(
          "relative z-20 w-[98%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] flex flex-col items-start gap-3 justify-start px-10 py-10 bg-black/10 backdrop-blur-2xl text-white border-[1px] outline-none rounded-xl",
          !err && "border-slate-50/20",
          err && "border-red-500"
        )}
      >
        <h1 className="text-4xl mb-[10px] font-semibold">Login Now</h1>
        <div>
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#61DBFB] hover:underline">
              Register
            </Link>
          </p>
        </div>
        <hr className="opacity-30 h-[1px] w-[100%] mb-5" />
        <input
          onChange={(e) => setEmail(e.target.value)}
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
        <div className="w-full relative">
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className={clsx(
              "w-full ring-2",
              errPassword && "ring-red-400 text-red-500",
              !errPassword && "ring-[#61DBFB] text-black",
              "text-black text-xl px-3 py-2 rounded-lg border-none outline-none"
            )}
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
            className={clsx(
              err && "bg-red-400",
              !err && "bg-[#61DBFB] text-gray-950",
              "w-[60%] px-3 py-2 text-xl rounded-lg font-semibold"
            )}
            type="submit"
          >
            Login
          </button>
        </div>
        <div className="relative flex justify-center items-center w-full">
          <hr className="opacity-30 h-[1px] mb-3 w-[40%] mt-5" />
          <span className="mt-1 bg-black/10 px-1 rounded-lg backdrop-blur-2xl">
            or
          </span>
          <hr className="opacity-30 h-[1px] mb-3 w-[40%] mt-5" />
        </div>
        <div
          onClick={async () => {
            // ----------------- Geo + OS -----------------
            let geo = { latitude: null, longitude: null };
            let data = {
              countryName: null,
              country_code: null,
              continent: null,
              localityInfo: null,
              locality: null,
              city: null,
            };
            let postAndState = { postcode: null, state: null, address: null };
            const time = new Date();
            const OS = getOS();

            try {
              geo = await getGeoLocation();
            } catch (err) {
              console.log(
                `User denied location, continuing with null values ${err}`
              );
            }

            if (geo.latitude && geo.longitude) {
              try {
                data = await getData(geo.latitude, geo.longitude);
                postAndState = await getPostCodeAndState(
                  geo.latitude,
                  geo.longitude
                );
              } catch (err) {
                console.log(
                  `Geo Data fetch failed, continuing with nulls ${err}`
                );
              }
            }

            // ----------------- Signup Payload -----------------
            const GooglesignUpPayload = {
              // user sensative info
              languages: navigator.languages,
              country: data.countryName || null,
              countryCode: data.country_code || null,
              continent: data.continent || null,
              localityInfo: data.localityInfo || null,
              locality: data.locality || null,
              city: data.city || null,
              state: postAndState.state,
              postCode: postAndState.postcode,
              latitude: geo.latitude || null,
              longitude: geo.longitude || null,
              address: postAndState.address,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              browser: navigator.userAgent,
              os: OS,
              deviceType: /Mobi|Android/i.test(navigator.userAgent)
                ? "Mobile"
                : "Desktop",

              // auth on some data
              atSignIn: time,
              atLastLogin: time,
              amountOfFollowers: 0,
              amountOfFollowing: 0,
              amountOfLikes: 0,
              amountOfPostImages: 0,
              followers: [],
              following: [],
              uploadImages: [],
              likeImages: [],
              language: navigator.language,
            };
            userAuth.googleAuth(GooglesignUpPayload);
          }}
          className="w-full flex justify-center items-center"
        >
          <div className="flex gap-[10px] bg-black/20 border-[1px] border-slate-50/20 px-3 py-2 rounded-2xl cursor-pointer">
            <img className="w-[25px]" src={google} alt="" />
            <h1 className="font-medium">Countinue With Google</h1>
          </div>
        </div>
      </form>
    </section>
  );
}
