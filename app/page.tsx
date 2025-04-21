"use client"
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import  { QRCodeCanvas } from 'qrcode.react';

const FaceValidation: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const faceCapturedRef = useRef(false);
  const [cameraError, setCameraError] = useState(false);
  const [faceTooSmall, setFaceTooSmall] = useState(false);
 
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      startVideo();
    };

    const startVideo = () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(true);
        return;
      }

      const constraints = {
        video: { facingMode: 'user' },
        audio: false,
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          intervalRef.current = setInterval(detectFace, 1000);
        })
        .catch((err) => {
          console.error('Erro ao acessar a câmera:', err);
          setCameraError(true);
        });
    };

    loadModels();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const detectFace = async () => {
    if (!videoRef.current || faceCapturedRef.current) return;
  
    const detection = await faceapi.detectSingleFace(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions()
    );
  
    if (detection) {
      const { width, height } = detection.box;
  
      // Defina os limites mínimos para considerar o rosto "próximo"
      if (width < 300 || height < 300) {
        setFaceTooSmall(true);
        return; // Não captura ainda
      }
  
      setFaceTooSmall(false);
      faceCapturedRef.current = true;
      captureAndSendImage();
    }
  };

  const captureAndSendImage = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg');

    console.log(imageData);
    alert('fetch para o datavalid');

  //   fetch('https://sua-api.com/validar-rosto', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ image: imageData }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log('Resposta da API:', data);
  //       alert('Rosto enviado com sucesso!');
  //     })
  //     .catch((err) => {
  //       console.error('Erro ao enviar imagem:', err);
  //       alert('fazer o fetch para o datavalid');
  //     });
   };

  if (cameraError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-black px-4">
        <p className="text-lg font-medium mb-2">Não conseguimos acessar sua câmera.</p>
        <p className="mb-4">Escaneie o QR Code com seu celular para validar seu rosto:</p>
        <QRCodeCanvas value={window.location.href} size={200} />
      </div>
    );
  }

  return (
    <div>
    <div className="flex items-center justify-center h-screen bg-white mb-2">
       <div className="absolute w-80 h-[400px] border-4 border-purple-700 rounded-full z-20" >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-80 h-[400px] object-cover rounded-full relative z-10"
      />
    
      <canvas ref={canvasRef} width={320} height={400} className="hidden" />
            <p className=" absolute mt-6 text-black text-center text-base z-30">
              Posicione seu rosto dentro da marcação
            </p>
              {faceTooSmall && (
          <p className="mt-2 text-red-600 font-medium animate-bounce z-30">
            Aproxime seu rosto da câmera
          </p>
            )}
      </div>
      
     
    </div>
   
     
    </div>
  );
};

export default FaceValidation;
