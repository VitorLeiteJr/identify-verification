"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

type DocsContextType = {
  videoDocRef: React.RefObject<HTMLVideoElement | null > ;
  canvasRef: React.RefObject<HTMLCanvasElement | null> ;
  textStatus: string;
  cameraError: boolean;
  dataValidValidation: boolean;
  toggleFacingMode: () => void;
  captureAndSendImage: () => void;
};

const DocsContext = createContext<DocsContextType | undefined>(undefined);

export const useDocsContext = () => {
  const ctx = useContext(DocsContext);
  if (!ctx) throw new Error("useDocsContext must be used inside a DocsProvider");
  return ctx;
};

export const DocsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const videoDocRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  //const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [textStatus, setTextStatus] = useState<string>("Posicione seu rosto dentro da marcação");
  const [cameraError, setCameraError] = useState<boolean>(false);

  const [dataValidValidation, setDataValidValidation] = useState<boolean>(false);

  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");


  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      startVideo();
    };

    const startVideo = () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(true);
        return;
      }


      console.log("start camera docs context")

        navigator.mediaDevices
    .getUserMedia({ video: { facingMode }, audio: false })
    .then((stream) => {
      if (videoDocRef.current) {
        videoDocRef.current.srcObject = stream;
      }
    })
    .catch(() => setCameraError(true));
    };


    loadModels();
  }, [facingMode]);

  const captureAndSendImage = () => {

    if (!canvasRef.current || !videoDocRef.current) return;

    const canvas = canvasRef.current;
    const video = videoDocRef.current;
  

    canvas.width = 1024;
      canvas.height = 768;
    
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
    
      // Proporção original da câmera
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const aspectRatio = videoWidth / videoHeight;
    
      let sx = 0, sy = 0, sWidth = videoWidth, sHeight = videoHeight;
    
      // Corta o centro do vídeo mantendo proporção
      if (aspectRatio > 1) {
        // Mais largo que alto: corta nas laterais
        sWidth = videoHeight;
        sx = (videoWidth - sWidth) / 2;
      } else {
        // Mais alto que largo: corta no topo/baixo
        sHeight = videoWidth;
        sy = (videoHeight - sHeight) / 2;
      }
    
      ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, 1024, 768);
    
      const imageData = canvas.toDataURL();

      console.log(imageData);
    setTextStatus("Imagem capturada e enviada para API (simulado)");
    setDataValidValidation(true);
    videoDocRef.current=null;
    canvasRef.current=null;
    return;

  };

  const toggleFacingMode = () => {
    // Desliga o stream atual
    const stream = videoDocRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());

    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    console.log(facingMode);
  };

  

  return (
    <DocsContext.Provider
      value={{ videoDocRef, canvasRef, textStatus, cameraError, dataValidValidation, toggleFacingMode,captureAndSendImage }}
    >
      {children}
    </DocsContext.Provider>
  );
};
