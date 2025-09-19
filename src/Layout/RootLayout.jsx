import React from 'react'
import Header from '../components/Header/Header'
import UploadBox from '../components/UploadBox/UploadBox'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div className="flex flex-col overflow-hidden">
        <Header />
        <UploadBox />
        <Outlet />
    </div>
  )
}
