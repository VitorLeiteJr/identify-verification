/* eslint-disable @next/next/no-img-element */

"use client"
import React, {useEffect } from 'react';
import { FaceProvider } from './context/FaceContext';
import FaceCamera from './components/FaceCamera';
import { useGlobalContext } from './context/GlobalContext';
// import { DocsProvider } from './context/DocsContext';
// import DocCamera from './components/DocCamera';
import DocChoice from './components/DocChoice';
import Loading from './components/Loading';


const MyComponent: React.FC = () => {

  const {loading,setLoading, statusValidation, eventStatus} = useGlobalContext();


  useEffect(() => {
    const fetchData = async () => {
      try {
        //here add the fetch valid api
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setLoading(false);// Hide the logo after loading
        //setEventStatus("END_KYC");
         return true;
      } catch {
        setLoading(true);
      }
    };

    fetchData();
  }, [setLoading,loading]);

  if(eventStatus==="START_KYC") return (
      <>
      {loading ? (
       <Loading status={statusValidation}/>
      ) : (
      <div className="flex items-center justify-center h-screen bg-white">

    { <FaceProvider><FaceCamera /></FaceProvider> }
     </div>
      )}
      </>
  );

  if(eventStatus==="STEP_REQUIRED_FRONT_DOC") return (
    <>
    
       {loading ? (
          <Loading status={statusValidation}/>
          ) : (
            <div className="flex items-center justify-center h-screen bg-white">  
                <DocChoice/>
          </div>
      )}
      </>
  )



  };
export default MyComponent;
