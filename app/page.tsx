"use client"
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { QRCodeCanvas } from 'qrcode.react';

const FaceValidation: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const faceCapturedRef = useRef(false);
  const [cameraError, setCameraError] = useState(false);

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

    fetch('https://sua-api.com/validar-rosto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Resposta da API:', data);
        alert('Rosto enviado com sucesso!');
      })
      .catch((err) => {
        console.error('Erro ao enviar imagem:', err);
        alert('Erro ao enviar imagem.');
      });
  };

  if (cameraError) {
    return (
      <div style={styles.container}>
        <p style={styles.instruction}>Não conseguimos acessar sua câmera.</p>
        <p style={{ marginBottom: 12 }}>Escaneie o QR Code com seu celular para validar seu rosto:</p>
        <QRCodeCanvas value={window.location.href} size={200} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <video ref={videoRef} autoPlay muted playsInline style={styles.video} />
      <div style={styles.ovalBorder} />
      <canvas ref={canvasRef} width={320} height={400} style={{ display: 'none' }} />
      <p style={styles.instruction}>Posicione seu rosto dentro da marcação</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  video: {
    width: 320,
    height: 400,
    objectFit: 'cover',
    borderRadius: '9999px',
    position: 'relative',
    zIndex: 1,
  },
  ovalBorder: {
    position: 'absolute',
    width: 320,
    height: 400,
    borderRadius: '9999px',
    border: '4px solid #8000C8',
    zIndex: 2,
  },
  instruction: {
    marginTop: 20,
    color: '#333',
    fontSize: 16,
  },
};

export default FaceValidation;
