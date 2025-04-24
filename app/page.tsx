/* eslint-disable @next/next/no-img-element */

"use client"
import React, {useEffect } from 'react';
import { FaceProvider } from './context/FaceContext';
import FaceCamera from './components/FaceCamera';
import { useGlobalContext } from './context/GlobalContext';
// import { DocsProvider } from './context/DocsContext';
// import DocCamera from './components/DocCamera';
import DocChoice from './components/DocChoice';


const MyComponent: React.FC = () => {

  const {dataValidValidation, loading,setLoading, statusValidation} = useGlobalContext();


  useEffect(() => {
    const fetchData = async () => {
      try {
        //here add the fetch valid api
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setLoading(false);// Hide the logo after loading
         return true;
      } catch {
        setLoading(true);
      }
    };

    fetchData();
  }, [setLoading,loading]);

  if(dataValidValidation) return (
      <>
      {loading ? (
        <div className='flex  bg-white justify-center items-center h-[100vh]'>
        <div  className=''>
                <img src="https://builder.spring-builder.prod.yospace.ai/fs/userFiles-v2/segurobet-18751649/images/favicon.png?v=1709064268" 
                alt="client logo" style={{ maxWidth: '200px' }} />
              <div className='flex bottom-0'>
              <h1 className='text-black'>{statusValidation}</h1> 
              </div>
       </div>
       </div>

      ) : (
      <div className="flex items-center justify-center h-screen bg-white">



    { <FaceProvider><FaceCamera /></FaceProvider> }
     </div>
      )}
      </>
  );

  if(!dataValidValidation) return (
    <>
    <DocChoice/>
      {/* {loading ? (
         <div className='flex  bg-white justify-center items-center h-[100vh]'>
         <div  className=''>
                 <img src="https://builder.spring-builder.prod.yospace.ai/fs/userFiles-v2/segurobet-18751649/images/favicon.png?v=1709064268" 
                 alt="client logo" style={{ maxWidth: '200px' }} />
               <div className='flex bottom-0'>
               <p className='text-black'>{statusValidation}</p> 
               </div>
        </div>
        </div>
      
    ) : (
      <div className="flex items-center justify-center h-screen bg-green-200">


    <DocsProvider>
      <DocCamera />
    </DocsProvider>
    </div>
      )} */}
      </>
  )


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
