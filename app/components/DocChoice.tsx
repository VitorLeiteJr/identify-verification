import React from 'react'

const DocChoice = () => {
  return (
    <div className=' bg-white'>
        <div className="flex items-center justify-center h-screen bg-gray-100">

<div className="flex flex-col items-center justify-center space-y-6 md:flex-row md:space-y-0 md:space-x-6 p-4 bg-white rounded-lg shadow-xl max-w-lg mx-auto">

  <label htmlFor="imageInput" className="flex flex-col items-center justify-center w-full md:w-1/2 lg:w-1/3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300 ease-in-out">
    <div className="text-blue-500 mb-3">
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
    </div>
    {/* <p className="text-sm text-gray-600 font-semibold">Carregar</p> */}
    <p className="text-xs text-gray-500 mt-1">Click aqui para carregar uma foto de sua galeria</p>
  </label>

  <label htmlFor="imageInput" className="flex flex-col items-center justify-center w-full md:w-1/2 lg:w-1/3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-50 hover:bg-gray-100 transition-colors duration-300 ease-in-out">
    <div className="text-green-500 mb-3">
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22a2 2 0 001.664.89H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
    </div>
    {/* <p className="text-sm text-gray-600 font-semibold">Tirar</p> */}
    <p className="text-xs text-gray-500 mt-1">Clique aqui para tirar uma foto com sua câmera</p>
  </label>

  <input
    type="file"
    id="imageInput"
    accept="image/*"
    capture="user"
    className="hidden"
 />
</div>

</div>
    </div>
  )
}

export default DocChoice
