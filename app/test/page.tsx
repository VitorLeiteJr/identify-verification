"use client"
import React, { useRef, useState } from "react";
import { BsCardText } from "react-icons/bs";
import { CiCamera as Camera } from "react-icons/ci";
import { FaIdCard } from "react-icons/fa";

const UploadIDStep: React.FC = () => {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        if (side === "front") {
          setFrontImage(reader.result);
        } else {
          setBackImage(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!frontImage || !backImage) return;

    fetch("/api/verify-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        front: frontImage,
        back: backImage,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Verification result:", data);
      })
      .catch((err) => {
        console.error("Upload error:", err);
      });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 border-green-800 border-4">
        <h1 className="text-xl font-semibold text-center mb-2 text-black">Foto da CNH</h1>
        <p className="text-sm text-black text-center mb-4">
          Insira uma foto clara de carteira nacional de habilitação (CNH)
          <br />
          Caso tenha alguma dúvida, acesse{" "}
          <a href="#" className="text-green-600 underline">Help Center</a>.
        </p>

        <div className="space-y-4">
          {/* Frente */}
          <div>
            <p className="font-bold text-gray-700 mb-1">Frente</p>
            <div className="border rounded-xl relative bg-gray-50 h-32 flex items-center justify-center">
              {frontImage ? (
                <img src={frontImage} alt="Frente da CNH" className="w-full h-full object-contain" />
              ) : (
                <FaIdCard className="text-gray-300 w-20 h-20" />
              )}
              <button
                onClick={() => frontInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-green-800 text-white p-2 rounded-full shadow-md"
              >
                <Camera size={20} />
              </button>
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*"
                // capture="environment"
                className="hidden"
                onChange={(e) => handleImageChange(e, "front")}
              />
            </div>
          </div>

          {/* Verso */}
          <div>
            <p className="font-bold text-gray-700 mb-1">Verso</p>
            <div className="border rounded-xl relative bg-gray-50 h-32 flex items-center justify-center">
              {backImage ? (
                <img src={backImage} alt="Verso da CNH" className="w-full h-full object-contain" />
              ) : (
                <BsCardText className="text-gray-300 w-20 h-20" />
              )}
              <button
                onClick={() => backInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-green-800 text-white p-2 rounded-full shadow-md"
              >
                <Camera size={20} />
              </button>
              <input
                ref={backInputRef}
                type="file"
                accept="image/*"
                // capture="environment"
                className="hidden"
                onChange={(e) => handleImageChange(e, "back")}
              />
            </div>
          </div>
        </div>

        <button
          className={`w-full mt-6 py-3 rounded-xl text-lg font-semibold ${
            frontImage && backImage
              ? "bg-green-800 text-white cursor-pointer"
              : "bg-gray-300 text-white cursor-not-allowed"
          }`}
          disabled={!frontImage || !backImage}
          onClick={handleSubmit}
        >
          Verificar
        </button>
      </div>
    </div>
  );
};

export default UploadIDStep;
