/* eslint-disable @next/next/no-img-element */

"use client"
import React, { useState, useEffect } from 'react';
import FaceValidation from './components/faceValidation';


const MyComponent: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate a slight delay to show the logo
        //here add the fetch valid api
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setLoading(false);// Hide the logo after loading
         return true;
      } catch {
        setLoading(true);
      }
    };

    fetchData();
  }, []);

  return (
      <>
      {loading ? (<div  className='flex justify-center items-center h-[100vh] bg-white'>
        <img src="https://builder.spring-builder.prod.yospace.ai/fs/userFiles-v2/segurobet-18751649/images/favicon.png?v=1709064268" 
        alt="client logo" style={{ maxWidth: '200px' }} />
      </div>) : (
        <FaceValidation/>
      )}
      </>
  );


  };
export default MyComponent;