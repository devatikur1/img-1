import React from 'react'

export default function ErrorPage() {
  return (
    <div className='w-screen min-h-screen flex justify-center items-center *:text-white *:select-none'>
        <div className='flex flex-col justify-center items-center'>
          <h1 className='text-[15rem] font-extrabold leading-[15.8rem]'>404</h1>
          <h2 className='text-2xl'>Page Not Found</h2>
        </div>
    </div>
  )
}
