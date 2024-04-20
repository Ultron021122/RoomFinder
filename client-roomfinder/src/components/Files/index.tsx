'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Button } from '@nextui-org/react';
// Estilos de algunos componentes
import { toast, Bounce, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Utilidades
import { Alert } from '@/utils/alert';

type Imagen = {
  image: string;
};

export default function ImageUploader() {
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<Imagen>({ mode: "onChange" });
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>(''); // Estado para almacenar la URL de la imagen seleccionada
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para almacenar el estado de carga [true: cargando, false: no cargando
  const [errorSystem, setErrorSystem] = useState<string | null>(null); // Estado para almacenar el mensaje de error del sistema

  // Manejador para el evento onChange del input de tipo archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Utiliza FileReader para convertir el archivo a base64
      const reader = new FileReader();
      reader.readAsDataURL(file); // Lee el archivo como un URL de datos

      reader.onload = () => {
        const base64 = reader.result as string; // Almacena el URL de datos en una variable
        setSelectedFileUrl(base64); // Almacena el URL de datos en el estado
        setValue('image', base64, { shouldValidate: true }); // Almacena el URL de datos en el campo del formulario
      };

      reader.onerror = (error) => {
        console.error('Error: ', error);
      };
    }
  };

  // Errores
  useEffect(() => {
    if (errorSystem) {
      toast.error(errorSystem, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  }, [errorSystem]);

  // Función para enviar la imagen al servidor
  const onSubmit = async (data: Imagen) => {
    setIsLoading(true); // Cambia el estado de carga a verdadero
    setErrorSystem(null); // Limpia el mensaje de error del sistema
    if (!data.image) return; // Si no hay archivo seleccionado, no hacer nada
    // Crear un objeto para enviar la imagen al servidor
    const uploadData = data as Imagen;

    try {
      const response = await axios.post("/api/resources", uploadData);
      setIsLoading(false);
      if (response.status === 201) {
        toast.success(response.data.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        });
        setSelectedFileUrl('');
        reset();
      } else {
        setErrorSystem(response.data.message);
      }
    } catch (Error: any) {
      if (Error.response?.status == 400) {
        setErrorSystem(Error.response?.data.message);
      } else {
        setErrorSystem(Error.response?.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="h-[calc(100vh-73px)]">
        {/* Campo para seleccionar la imagen */}
        <div className='flex flex-col items-center justify-center w-full'>
          <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor='drop-file' className='flex flex-col items-center justify-center my-2 w-40 h-40 sm:w-48 sm:h-48 ring-4 ring-offset-gray-50 dark:ring-offset-gray-900 ring-offset-4 hover:ring-blue-500 rounded-full cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'>
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
                <input
                  id='drop-file'
                  name="drop-file"
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleFileChange}
                />
              </label>
              <input
                type='text'
                className='hidden'
                value={selectedFileUrl}
                {...register('image', {
                  required: {
                    value: true,
                    message: 'Es necesario seleccionar una imagen',
                  },
                })}
              />
            </div>
            {/* Mensaje de error */}
            {errors.image && (
              <Alert message={errors.image.message} />
            )}
            {/* Botón para enviar el formulario */}
            <Button type='submit' color='primary' variant='flat' className='font-normal w-full'>
              Subir imagen
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}