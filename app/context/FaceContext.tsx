"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

type FaceContextType = {
  videoRef: React.RefObject<HTMLVideoElement | null > ;
  canvasRef: React.RefObject<HTMLCanvasElement | null> ;
  textStatus: string;
  faceTooSmall: boolean;
  cameraError: boolean;
  dataValidValidation: boolean;
};

const FaceContext = createContext<FaceContextType | undefined>(undefined);

export const useFaceContext = () => {
  const ctx = useContext(FaceContext);
  if (!ctx) throw new Error("useFaceContext must be used inside a FaceProvider");
  return ctx;
};

export const FaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const faceCapturedRef = useRef(false);

  const [textStatus, setTextStatus] = useState<string>("Posicione seu rosto dentro da marcação");
  const [faceTooSmall, setFaceTooSmall] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<boolean>(false);

  const [dataValidValidation, setDataValidValidation] = useState<boolean>(false);



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

      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" }, audio: false })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
          intervalRef.current = setInterval(detectFace, 1000);
        })
        .catch(() => setCameraError(true));
    };

    const detectFace = async () => {
      if (!videoRef.current || faceCapturedRef.current) return;

      const detection = await faceapi.detectSingleFace(
        videoRef.current,
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

      if (!canvasRef.current || !videoRef.current) return;

      const ctx = canvasRef.current.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
     // const imageData = canvasRef.current.toDataURL("image/jpeg");

   //  console.log("Imagem capturada:", imageData);
      setTextStatus("Imagem capturada e enviada para API (simulado)");
      setDataValidValidation(true);
      videoRef.current=null;
      canvasRef.current=null;
      return;

    };

    loadModels();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <FaceContext.Provider
      value={{ videoRef, canvasRef, textStatus, faceTooSmall, cameraError, dataValidValidation }}
    >
      {children}
    </FaceContext.Provider>
  );
};
