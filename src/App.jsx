import React, { useContext } from "react";
import Header from "./components/Header/Header";
import LoginPage from "./Pages/LoginPage";
import SignUpPages from "./Pages/SignUpPages";
import HomePage from "./Pages/HomePage";
import { Navigate, Route, Routes } from "react-router-dom";
import { FirebaseContext } from "./contexts/FirebaseContext";
import SearchBox from "./components/SearchBox/SearchBox";


export default function App() {
  const { currentUser } = useContext(FirebaseContext);
  // console.log(currentUser);

  return (
    <div className="flex flex-col overflow-hidden">
      <Header />
      <SearchBox />
      <Routes>
        <Route
          path="/login"
          element={!currentUser ? <LoginPage /> : <Navigate to={"/"} replace />}
        />
        <Route
          path="/register"
          element={
            !currentUser ? <SignUpPages /> : <Navigate to={"/"} replace />
          }
        />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}
