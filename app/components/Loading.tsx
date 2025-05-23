/* eslint-disable @next/next/no-img-element */

import React from 'react'


interface loadingProps {
    status: string;
}

const Loading = ({status}: loadingProps) => {
  return (
    <div className='flex  bg-white justify-center items-center h-[100vh]'>
        <div  className=''>
                <img src="#" 
                alt="client logo" style={{ maxWidth: '200px' }} />
              <div className='flex bottom-0'>
              <h1 className='text-black'>{status}</h1> 
              </div>
       </div>
       </div>
  )
}

export default Loading
