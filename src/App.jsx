import React, { useContext } from "react";
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import { FirebaseContext } from "./contexts/FirebaseContext";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignUpPages from "./Pages/SignUpPages";
import RootLayout from "./Layout/RootLayout";


export default function App() {
  const { currentUser } = useContext(FirebaseContext);
  // console.log(currentUser);

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
            !currentUser ? <LoginPage /> : <Navigate index replace />
          }
        />
        <Route
          path="register"
          element={
            !currentUser ? <SignUpPages /> : <Navigate index replace />
          }
        />
      </Route>
    )
  )

  return (
      <RouterProvider router={router}/>
  );
}
