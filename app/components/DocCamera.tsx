"use client";
import React from "react";
import { useDocsContext } from "../context/DocsContext";

const DocCamera: React.FC = () => {


  const { videoDocRef, canvasRef, toggleFacingMode, captureAndSendImage} = useDocsContext();

  return (
  <>
    <div className="absolute w-80 h-[400px] border-4 z-20">   
    
  <button className="text-black absolute top-0 right-0 z-30" onClick={()=>toggleFacingMode()} >change camera</button> 
      <video
        ref={videoDocRef}
        autoPlay
        muted
        playsInline
        className=" w-80 h-[394px] object-cover relative z-20"
      />
      <canvas ref={canvasRef} width={320} height={400} className="hidden" />


      <p 
      onClick={()=>captureAndSendImage()} 
      className="mt-6 text-center text-base z-30 text-black hover:cursor-pointer btn-primary">
        Enviar foto
      </p>
    </div>
  </>
  );
};

export default DocCamera;
