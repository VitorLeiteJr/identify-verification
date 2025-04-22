/* eslint-disable @next/next/no-img-element */

"use client"
import React, { useState, useEffect } from 'react';
import { FaceProvider } from './context/FaceContext';
import FaceCamera from './components/FaceCamera';


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
      <div className="flex items-center justify-center h-screen bg-white">
     <FaceProvider><FaceCamera /></FaceProvider> 
     </div>
      )}
      </>
  );


  };
export default MyComponent;

// "use client";
// import React, { useState } from "react";
// import { FaceProvider } from "./context/FaceContext";
// import FaceCamera from "./components/FaceCamera";
// import DocCamera from "./components/DocCamera";
// import { DocsProvider } from "./context/DocsContext";


// const Home: React.FC = () => {
//  // const { cameraError, dataValidValidation } = useFaceContext();

//  const [test, setTest] = useState<boolean>(false);

 
 
   

//  if(test) return ( <>
//    <div className="flex items-center justify-center h-screen bg-white">
//  {<DocsProvider><DocCamera /></DocsProvider> }
//  </div>
//  </>);

//   return (
//     <>
//       <button className="absolute bg-black" onClick={()=>setTest(true)}>test</button>
//     <div className="flex items-center justify-center h-screen bg-white">
//       <FaceProvider><FaceCamera /></FaceProvider> 
//     </div>

//     </>
//   );

// };

// export default Home;
