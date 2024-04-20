'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ImageUploader() {
  // Estado para almacenar la URL de la imagen seleccionada
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);

  // Manejador para el evento onChange del input de tipo archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Crear una URL para la imagen seleccionada
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      setSelectedFileUrl(fileUrl);
    }
  };

  return (
    <>
      <div className="h-[calc(100vh-73px)]">
        {/* Campo para seleccionar la imagen */}
        <div className='flex flex-col items-center justify-center w-full'>
          <label htmlFor='dropzone-file' className='flex flex-col items-center justify-center my-2 w-40 h-40 sm:w-48 sm:h-48 ring-4 ring-offset-gray-50 dark:ring-offset-gray-900 ring-offset-4 hover:ring-blue-500 rounded-full cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'>
            {selectedFileUrl ? (
              <Image
                width={160}
                height={160}
                src={selectedFileUrl}
                alt='Profile Picture'
                className='rounded-full object-cover w-40 h-40 sm:w-48 sm:h-48'
              />
            ) : (
              <Image
                width={160}
                height={160}
                priority
                src='/perfiles/astronauta.jpg'
                alt='Profile Picture'
                className='rounded-full object-cover w-40 h-40 sm:w-48 sm:h-48'
              />
            )}
            <input id='dropzone-file' type='file' accept='image/*' className='hidden' onChange={handleFileChange} />
          </label>
        </div>
      </div>
    </>
  );
}