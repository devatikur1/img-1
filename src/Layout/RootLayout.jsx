import { Outdent } from 'lucide-react'
import React from 'react'
import Header from '../components/Header/Header'
import SearchBox from '../components/SearchBox/SearchBox'

export default function RootLayout() {
  return (
    <div className="flex flex-col overflow-hidden">
        <Header />
        <SearchBox />
        <Outdent />
    </div>
  )
}
