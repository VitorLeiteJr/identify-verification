/* eslint-disable @next/next/no-img-element */

"use client"
import React, {useEffect, useState } from 'react';
import { FaceProvider } from './context/FaceContext';
import FaceCamera from './components/FaceCamera';
import { useGlobalContext } from './context/GlobalContext';
// import { DocsProvider } from './context/DocsContext';
// import DocCamera from './components/DocCamera';
import DocChoice from './components/DocChoice';
import Loading from './components/Loading';


const MyComponent: React.FC = () => {

  const {loading,setLoading, statusValidation, eventStatus} = useGlobalContext();


  const [code, setCode] = useState<string | null>(null);

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
            })
            .then((res) => res.json())
            .then((data) => {
              setCode(data.code);
              return data;
            });
                      

              if(code!=null){
    
                console.log(data.code)
                 setLoading(false);// Hide the logo after loading
            break;
            }
            else{
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


              
            
          

        }
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



  };
export default MyComponent;
