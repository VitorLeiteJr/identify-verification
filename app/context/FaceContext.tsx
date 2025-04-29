"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { useGlobalContext } from "./GlobalContext";
import base64Size from "../utils/checkImageSize";

type FaceContextType = {
  videoRef: React.RefObject<HTMLVideoElement | null > ;
  canvasRef: React.RefObject<HTMLCanvasElement | null> ;
  textStatus: string;
  faceTooSmall: boolean;
  cameraError: boolean;
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

  const {setDataValidValidation, setLoading,setStatusValidation, setEventStatus} = useGlobalContext();



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

      console.log("start camera face context")

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
        
              const { width, height } = detection.box;
                  if (width < 250 || height < 250) {
                    setTextStatus("Aproxime mais o rosto da câmera");
                    setFaceTooSmall(true);
                    return;
                }
                

        setFaceTooSmall(false);
        faceCapturedRef.current = true;
        captureAndSendImage();
      }
    };

    const captureAndSendImage = async() => {
      if (!canvasRef.current || !videoRef.current) return;
    
      const canvas = canvasRef.current;
      const video = videoRef.current;
    
      // Ajusta o canvas para 750x750
      canvas.width = 750;
      canvas.height = 750;
    
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
    
      ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, 750, 750);
    
      const imageData = canvas.toDataURL("image/png", 0.95); // qualidade boa, compressão

      if (base64Size(imageData) > 3) {
        setTextStatus("Imagem muito pesada. Ajuste iluminação ou distância.");
        return;
      }
    
     //console.log(imageData);
    
      // here the fetch to datavalid

      const data = await fetch("http://localhost:3001/facevalid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: "123"
        })
      });

      const dataStart = data;
      const body = await dataStart.json();
                        
        if(dataStart.status===200){
          
          console.log(body);
        

      setEventStatus("SUCCESS");
      setTextStatus("Imagem capturada e enviada para o data valid.");
      setLoading(true);
      setStatusValidation("Validando imagem no data valid...");
      stopCamera();
   
      }else{

      
        setLoading(true);
        setStatusValidation("Validando sua imagem, aguarde...");
        stopCamera();
        setEventStatus("STEP_REQUIRED_DOC");

      }



      //setEventStatus("LOADING");
      
      // Limpa referências
      videoRef.current = null;
      canvasRef.current = null;
    };

    const stopCamera = () => {
      console.log("Parando a câmera...");
    
     //if(videoRef.current?.srcObject===null) return;
        const stream = videoRef.current?.srcObject as MediaStream;
      if(stream?.getTracks() ===undefined) return;

        stream?.getTracks()?.forEach(track => track.stop());
        videoRef.current!.srcObject = null;
      
    
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    
      faceCapturedRef.current = false;
    };

    loadModels();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [setDataValidValidation, setEventStatus, setLoading, setStatusValidation]);


  

  return (
    <FaceContext.Provider
      value={{ videoRef, canvasRef, textStatus, faceTooSmall, cameraError }}
    >
      {children}
    </FaceContext.Provider>
  );
};
