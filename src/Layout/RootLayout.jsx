import React from 'react'
import Header from '../components/Header/Header'
import UploadBox from '../components/UploadBox/UploadBox'
import { Outlet } from 'react-router-dom'
import { Bounce, ToastContainer } from "react-toastify";

export default function RootLayout() {
  return (
    <div className="flex flex-col overflow-hidden">
        <Header />
        {/* Toast Container */}
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
        <UploadBox />
        <Outlet />
    </div>
  )
}
