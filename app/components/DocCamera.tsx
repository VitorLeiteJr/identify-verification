"use client";
import React from "react";
import { useDocsContext } from "../context/DocsContext";

const DocCamera: React.FC = () => {


  const { videoDocRef, canvasRef, textStatus, faceTooSmall } = useDocsContext();

  return (
    <div className="absolute w-80 h-[400px] border-4 border-green-700 rounded-full z-20">
      <video
        ref={videoDocRef}
        autoPlay
        muted
        playsInline
        className="w-80 h-[400px] object-cover rounded-full relative z-10"
      />
      <canvas ref={canvasRef} width={320} height={400} className="hidden" />
      <p
        className={`absolute mt-6 text-center text-base z-30 ${
          faceTooSmall ? "text-red-600 animate-bounce" : "text-black"
        }`}
      >
        {textStatus}
      </p>
    </div>
  );
};

export default DocCamera;
