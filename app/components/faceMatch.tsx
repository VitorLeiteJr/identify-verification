"use client"
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const FaceMatcher = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [labeledDescriptor, setLabeledDescriptor] = useState<faceapi.LabeledFaceDescriptors | null>(null);

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  // Start webcam
  useEffect(() => {
    if (!modelsLoaded) return;
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
  }, [modelsLoaded]);

  // Handle uploaded image
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const image = await faceapi.bufferToImage(file);
    const detection = await faceapi
      .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      console.log("No face detected in uploaded image.");
      return;
    }

    const descriptor = new faceapi.LabeledFaceDescriptors("User", [detection.descriptor]);
    setLabeledDescriptor(descriptor);
    console.log("✅ Face reference saved.");
  };

  // Compare live face
  const handlePlay = async () => {
    if (!labeledDescriptor) return;

    const canvas = faceapi.createCanvasFromMedia(videoRef.current!);
    canvas.style.position = "absolute";
    canvasRef.current?.replaceWith(canvas);
    canvasRef.current = canvas;

    const displaySize = {
      width: videoRef.current!.width,
      height: videoRef.current!.height,
    };

    faceapi.matchDimensions(canvas, displaySize);

    const matcher = new faceapi.FaceMatcher([labeledDescriptor], 0.6);

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current!, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resized = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);

      resized.forEach((det) => {
        const match = matcher.findBestMatch(det.descriptor);
        const drawBox = new faceapi.draw.DrawBox(det.detection.box, {
          label: match.toString(),
        });
        drawBox.draw(canvas);
      });
    }, 200);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>🔍 Live Face Matching</h2>
      <input type="file" accept="image/*" onChange={handleUpload} />
      <br />
      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        muted
        onPlay={handlePlay}
        style={{ border: "2px solid black", marginTop: "20px" }}
      />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default FaceMatcher;
