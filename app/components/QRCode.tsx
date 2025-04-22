import { QRCodeCanvas } from 'qrcode.react'
import React from 'react'

const QRCode = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-black px-4">
        <p className="text-lg font-medium mb-2">Não conseguimos acessar sua câmera.</p>
        <p className="mb-4">Escaneie o QR Code com seu celular para validar seu rosto:</p>
        <QRCodeCanvas value={window.location.href} size={200} />
      </div>
  )
}

export default QRCode;
