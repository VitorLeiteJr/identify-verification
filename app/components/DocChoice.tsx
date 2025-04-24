"use client";
import React, { useState } from "react";
import { DocsProvider } from "../context/DocsContext";
import DocCamera from "./DocCamera";

const DocChoice = () => {
  const [showCamera, setShowCamera] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("A imagem não pode exceder 3MB.");
      return;
    }

    const imageData = await toBase64(file);

    try {
      const response = await fetch("/api/validar-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const result = await response.json();
      console.log("Resposta da API:", result);
    } catch (err) {
      console.error("Erro ao enviar imagem:", err);
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  // Se clicou pra abrir a câmera, renderiza o contexto + câmera
  if (showCamera) {
    return (
      <DocsProvider>
        <DocCamera />
      </DocsProvider>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center space-y-6 md:flex-row md:space-y-0 md:space-x-6 p-4 bg-white rounded-lg shadow-xl max-w-lg mx-auto">

        {/* Upload da galeria */}
        <label
          htmlFor="imageInput"
          className="flex flex-col items-center justify-center w-full md:w-1/2 px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="text-blue-500 mb-3">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <p className="text-xs text-gray-500 text-center">Clique aqui para carregar uma foto</p>
        </label>

        {/* Abrir câmera */}
        <button
          onClick={() => setShowCamera(true)}
          className="flex flex-col items-center justify-center w-full md:w-1/2 px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="text-green-500 mb-3">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22a2 2 0 001.664.89H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-xs text-gray-500 text-center">Tirar uma foto com a câmera</p>
        </button>

        {/* Input de imagem (invisível, mas acionado pelo label) */}
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};

export default DocChoice;
