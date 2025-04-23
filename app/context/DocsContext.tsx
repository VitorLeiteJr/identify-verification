"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

type DocsContextType = {
  videoDocRef: React.RefObject<HTMLVideoElement | null > ;
  canvasRef: React.RefObject<HTMLCanvasElement | null> ;
  textStatus: string;
  faceTooSmall: boolean;
  cameraError: boolean;
  dataValidValidation: boolean;
  toggleFacingMode: () => void;
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const faceCapturedRef = useRef(false);

  const [textStatus, setTextStatus] = useState<string>("Posicione seu rosto dentro da marcação");
  const [faceTooSmall, setFaceTooSmall] = useState<boolean>(false);
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

      // navigator.mediaDevices
      //   .getUserMedia({ video: { facingMode }, audio: false })
      //   .then((stream) => {
      //     if (videoDocRef.current) videoDocRef.current.srcObject = stream;
      //     intervalRef.current = setInterval(detectFace, 1000);
      //   })
      //   .catch(() => setCameraError(true));

        navigator.mediaDevices
    .getUserMedia({ video: { facingMode }, audio: false })
    .then((stream) => {
      if (videoDocRef.current) {
        videoDocRef.current.srcObject = stream;
        intervalRef.current = setInterval(detectFace, 1000);
      }
    })
    .catch(() => setCameraError(true));
    };

    

    const detectFace = async () => {
      if (!videoDocRef.current || faceCapturedRef.current) return;

      const detection = await faceapi.detectSingleFace(
        videoDocRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detection) {
        // const { width, height } = detection.box;

        // if (width < 300 || height < 300) {
        //   setFaceTooSmall(true);
        //   setTextStatus("Aproxime seu rosto da câmera");
        //   return;
        // }

        // if (width > 320 || height > 320) {
        //   setFaceTooSmall(true);
        //   setTextStatus("Afaste seu rosto da câmera");
        //   return;
        // }

        setFaceTooSmall(false);
        faceCapturedRef.current = true;
        captureAndSendImage();
      }
    };

    const captureAndSendImage = () => {

      if (!canvasRef.current || !videoDocRef.current) return;

      const ctx = canvasRef.current.getContext("2d");
      ctx?.drawImage(videoDocRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
     // const imageData = canvasRef.current.toDataURL("image/jpeg");

   //  console.log("Imagem capturada:", imageData);
      setTextStatus("Imagem capturada e enviada para API (simulado)");
      setDataValidValidation(true);
      videoDocRef.current=null;
      canvasRef.current=null;
      return;

    };

    loadModels();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [facingMode]);

  const toggleFacingMode = () => {
    // Desliga o stream atual
    const stream = videoDocRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());

    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    console.log(facingMode);
  };

  

  return (
    <DocsContext.Provider
      value={{ videoDocRef, canvasRef, textStatus, faceTooSmall, cameraError, dataValidValidation, toggleFacingMode }}
    >
      {children}
    </DocsContext.Provider>
  );
};
