'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Controller, useForm } from "react-hook-form";
import { Button, Divider } from '@nextui-org/react';
// Estilos de algunos componentes
import { toast, Bounce, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Utilidades
import { Alert } from '@/utils/alert';
import { FolderIcon } from '@/utils/icons';
import { messages, folders } from '@/utils/constants';

type Imagen = {
  image: string;
  folder: string;
  width: number;
  height?: number;
};

export default function ImageUploader() {
  const { control, register, handleSubmit, formState: { errors }, setValue, reset } = useForm<Imagen>({ mode: "onChange" });
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>(''); // Estado para almacenar la URL de la imagen seleccionada
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para almacenar el estado de carga [true: cargando, false: no cargando
  const [errorSystem, setErrorSystem] = useState<string | null>(null); // Estado para almacenar el mensaje de error del sistema
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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

  const handleClick = () => {
    const fileInput = document.getElementById('drop-file');
    if (fileInput) { // Verifica si fileInput no es null
      (fileInput as HTMLInputElement).click(); // Asegura que fileInput se trate como HTMLInputElement y llama a click()
    } else {
      setErrorSystem('No se encontró el input de archivo.'); // Opcional: maneja el caso de error
    }
  };

  // Dark Mode 
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const setDarkModeFromMediaQuery = () => setDarkMode(darkModeMediaQuery.matches);

    setDarkModeFromMediaQuery();
    darkModeMediaQuery.addEventListener('change', setDarkModeFromMediaQuery);

    setIsLoaded(true);

    return () => {
      darkModeMediaQuery.removeEventListener('change', setDarkModeFromMediaQuery);
    };
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <div className="h-[calc(100vh-73px)] max-w-screen-2xl mx-auto">
        <div className="container mx-auto p-2">
          <h1 className='text-neutral-950 dark:text-gray-200 text-2xl font-bold'>Subida de imagenes</h1>
          <p className='text-neutral-800 dark:text-gray-300 text-sm'>Sube una imagen para almacenarla en la base de datos</p>
          <Divider className='bg-neutral-400 dark:bg-gray-500' />
          <div className=''>
            <div className='grid grid-cols-2 items-center'>
              <label htmlFor='upload-file' className='text-neutral-800 dark:text-gray-300 text-sm'>
                Archivo
              </label>
              <Button color='primary' variant='flat' radius='none' className='font-normal w-full' onClick={handleClick} startContent={<FolderIcon />}>
                Seleccionar imagen
                <input
                  id='upload-file'
                  name="upload-file"
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleFileChange}
                />
              </Button>
              <div className='col-span-2'>
                {errors?.image && (
                  <Alert message={errors?.image.message} />
                )}
              </div>
            </div>
            <div className='grid grid-cols-2 items-center'>
              <label htmlFor='folder' className='text-neutral-800 dark:text-gray-300 text-sm'>
                Carpeta
              </label>
              <FormControl
                className="w-full mb-2"
                variant="standard"
                id="folder"
                sx={{
                  '.MuiInput-underline:after': {
                    borderBottomColor: darkMode === true ? '#3b82f6' : '#2563eb',
                  },
                  '.MuiInput-underline:before': {
                    borderBottomColor: darkMode === true ? '#4b5563' : '#d1d5db',
                    borderBottomWidth: '2px',
                  },
                  '.MuiInput-underline:hover:not(.Mui-disabled):before': {
                    borderBottomColor: darkMode === true ? '#4b5563' : '#d1d5db',
                  },
                }}
              >
                <InputLabel
                  id="folder-label"
                  className="peer-focus:font-medium text-sm peer-focus:text-sm"
                  sx={{
                    color: darkMode === true ? '#9ca3af' : '#6b7280',
                    fontSize: '0.875rem',
                    lineHeight: '1.25rem',
                  }}
                >
                  Selecciona una carpeta
                </InputLabel>
                <Controller
                  name="folder"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: {
                      value: true,
                      message: messages.folder.required
                    }
                  }}
                  render={({ field }) => (
                    <Select
                      labelId="folder-label"
                      id="folder"
                      label="Tipo de usuario"
                      className="text-sm"
                      sx={{
                        fontFamily: '__Inter_aaf875',
                        fontSize: '0.875rem',
                        lineHeight: '1.25rem',
                        fontStyle: 'normal',
                        color: darkMode ? "white" : "#111827",
                        '.MuiSvgIcon-root ': {
                          fill: darkMode ? "white !important" : "#111827 !important",
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                            color: darkMode ? "#fff" : "#111827",
                            maxHeight: '200px',
                          },
                        },
                      }}
                      {...field}
                    >
                      {
                        folders.map((carpeta, index) => (
                          <MenuItem
                            value={carpeta.path}
                            key={index}
                            sx={{
                              fontSize: '0.875rem',
                              lineHeight: '1.25rem',
                              '&.Mui-selected': { backgroundColor: darkMode ? '#1f2937' : "#9ca3af" }, // Style when selected
                              '&.Mui-selected:hover': {
                                backgroundColor: darkMode ? '#111827' : "#6b7280",
                                color: darkMode ? '#3b82f6' : '#fff',
                              }, // Style when selected and hovered
                              '&:hover': { backgroundColor: darkMode ? '#374151' : "#d1d5db" }, // Style when hovered
                            }}
                          >
                            {carpeta.name}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  )}
                />
              </FormControl>
              <div className='col-span-2'>
                {errors?.folder && (
                  <Alert message={errors?.folder.message} />
                )}
              </div>
            </div>
            <div className='grid grid-cols-2 items-center'>
              <label htmlFor='width' className='text-neutral-800 dark:text-gray-300 text-sm'>
                Ancho
              </label>
              <div className="relative z-0 w-full my-1">
                <div className="grid">
                  <input
                    {...register("width", {
                      required: {
                        value: true,
                        message: messages.width.required
                      },
                      min: {
                        value: 1,
                        message: messages.width.min
                      },
                      max: {
                        value: 1800,
                        message: messages.width.max
                      },
                      valueAsNumber: true,
                    })}
                    type="number"
                    name="width"
                    id="width"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=""
                    autoComplete="off"
                  />
                  <label htmlFor="width" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Selecciona el ancho de la imagen
                  </label>
                </div>
              </div>
              <div className='col-span-2'>
                {errors?.width && (
                  <Alert message={errors?.width.message} />
                )}
              </div>
            </div>
            <div className='grid grid-cols-2 items-center'>
              <label htmlFor='height' className='text-neutral-800 dark:text-gray-300 text-sm'>
                Altura
              </label>
              <div className="relative z-0 w-full my-1">
                <input
                  {...register("height", {
                    min: {
                      value: 1,
                      message: messages.height.min
                    },
                    max: {
                      value: 1800,
                      message: messages.height.max
                    },
                    valueAsNumber: true,
                  })}
                  type="number"
                  name="height"
                  id="height"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=""
                  autoComplete="off"
                />
                <label htmlFor="height" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Selecciona la altura de la imagen
                </label>
              </div>
              <div className='col-span-2'>
                {errors?.height && (
                  <Alert message={errors?.height.message} />
                )}
              </div>
            </div>
          </div>

          {/* Campo para seleccionar la imagen */}
          <div className=''>
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
                      message: messages.image.required,
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
      </div>
    </>
  );
}