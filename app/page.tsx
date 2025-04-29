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

  const {loading,setLoading, statusValidation, eventStatus,setEventStatus} = useGlobalContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        //here add the fetch valid api
        //await new Promise((resolve) => setTimeout(resolve, 2000));

        switch(eventStatus){
          case "START_KYC":
            const data = await fetch("http://localhost:3001/start", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userid: "123"
              })
            });
               

              const startData = data;
            //  console.log(status)
              const body =await startData.json();
            
              if(startData.status ===200){
                  
                if(!body.code){ 
                  
                  setEventStatus("ERROR");
                  
                }
                 setLoading(false);// Hide the logo after loading

            break;
            }
            else{
              console.log("error")
              setEventStatus("ERROR");
              setLoading(false);
              break;
            }
          
          
          
          case "SUCCESS":
              

                await new Promise((resolve) => setTimeout(resolve, 1000));

                setLoading(false);
                break;
            
          case  "STEP_REQUIRED_DOC":
                  await new Promise((resolve) => setTimeout(resolve, 1000));

                   setLoading(false);
                   break;

          case  "ERROR":
                    await new Promise((resolve) => setTimeout(resolve, 1000));
  
                     setLoading(false);
                     break;   

        }
      } catch {
        setEventStatus("ERROR")
        setLoading(false);
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

  if(eventStatus==="STEP_REQUIRED_DOC") return (
    <>
    
       {loading ? (
          <Loading status={statusValidation}/>
          ) : (
            <div className="flex items-center justify-center h-screen bg-white">  
                <DocChoice/>
          </div>
      )}
      </>
  );

  if(eventStatus==="SUCCESS") return (
    <>
    
    {loading ? (
          <Loading status={statusValidation}/>
          ) : (
            <div className="flex items-center justify-center h-screen bg-text">  
                all ok, end kyc
          </div>
      )}
    </>
  )


  if(eventStatus==="ERROR") return (
    <>

    {loading ? (
          <Loading status={statusValidation}/>
          ) : (
            <div className="flex items-center justify-center h-screen bg-text">  
                something is wrong, try again
          </div>
      )}

    </>
  );



  };
export default MyComponent;
