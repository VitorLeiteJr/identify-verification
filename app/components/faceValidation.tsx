"use client"
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import QRCode from './QRCode';

const FaceValidation: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const faceCapturedRef = useRef(false);
  const [cameraError, setCameraError] = useState(false);
  const [faceTooSmall, setFaceTooSmall] = useState(false);

  const [textStatus, setTextStatus] = useState<string>('Posicione seu rosto dentro da marcação');
 
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setTextStatus("Aproxime seu rosto da camera")
        return; // Não captura ainda
      }
      if (width > 320 || height > 320) {
        setFaceTooSmall(true);
        setTextStatus("Afaste seu rosto da camera")
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
    setTextStatus('fetch para o datavalid');

    return;

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
      <QRCode/>
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
            {!faceTooSmall &&(<p className=" absolute mt-6 text-black text-center text-base z-30">
               {textStatus}
            </p>)}
              {faceTooSmall && (
          <p className="mt-2 text-red-600 font-medium animate-bounce z-30">
                  {textStatus}
          </p>
            )}
      </div>
      
     
    </div>
   
     
    </div>
  );
};

export default FaceValidation;
