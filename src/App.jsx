import React, { useContext } from "react";
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import { FirebaseContext } from "./contexts/FirebaseContext";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignUpPages from "./Pages/SignUpPages";
import RootLayout from "./Layout/RootLayout";
import ErrorPage from "./Pages/ErrorPage";

export default function App() {
  const { logged } = useContext(FirebaseContext);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route 
        index 
        element={<HomePage /> }
        />
        <Route
          path="login"
          element={
            !logged ? <LoginPage /> : <Navigate to={"/"} replace />
          }
        />
        <Route
          path="register"
          element={
            !logged ? <SignUpPages /> : <Navigate to={"/"} replace />
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    )
  )

  return (
      <RouterProvider router={router}/>
  );
}
