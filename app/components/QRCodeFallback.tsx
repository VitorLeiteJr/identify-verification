"use client";
import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center bg-black px-4">
    <p className="text-lg font-medium mb-2">Não conseguimos acessar sua câmera.</p>
    <p className="mb-4 text-white">Escaneie o QR Code com seu celular para validar seu rosto:</p>
    <QRCodeCanvas value={typeof window !== "undefined" ? window.location.href : ""} size={200} />
  </div>
);

export default QRCodeFallback;
