'use client';

import { useFormulario } from './FormularioContext';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Images, X } from 'lucide-react';
import { toast, Bounce, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function ImageUploader() {
    const { inmueble, setInmueble } = useFormulario();

    const onDrop = (acceptedFiles: File[]) => {
        const prev = inmueble.fotos;
        // Verifica cuántas imágenes se pueden añadir sin exceder el límite
        if (prev.length + acceptedFiles.length > 8) {
            toast.error("Solo se permiten 8 imagenes como maximo", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                style: { fontSize: '0.9rem' },
                theme: "colored",
                transition: Bounce,
            });
            return;
        }
        setInmueble({ fotos: [...prev, ...acceptedFiles] });
    }

    const quitarImg = (imagen: File) => {
        const fotosActuales = inmueble.fotos;
        let fotosActualizadas = fotosActuales.filter(foto => {
            return foto !== imagen;
        });

        setInmueble({ fotos: fotosActualizadas });
    }

    // integrando react-dropzone
    const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        maxFiles: 8,
        maxSize: 5242880 // 5MB
    });

    //generar preview de las imágenes seleccionadas
    const renderPreviews = () => {
        return inmueble.fotos.map((imagen, index) => {
            const imagenURL = URL.createObjectURL(imagen);
            return (
                <div key={index} className="relative group w-full h-0 pb-[100%]"> {/* Proporción 1:1 */}
                    <Image
                        src={imagenURL}
                        alt={`preview de imagen ${index}`}
                        fill
                        objectFit="cover" // Asegura que la imagen cubra el contenedor
                    />
                    <button
                        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full border border-solid border-white bg-transparent text-white hover:bg-gray-600"
                        onClick={() => quitarImg(imagen)}
                    >
                        <X size={20} />
                    </button>
                </div>
            );
        });
    }

    return (
        <div>
            <div className="max-w-4xl mx-auto">
                <div {...getRootProps()} className={`p-4 border-2 border-dashed ${isDragActive ? 'border-blue-400' : 'border-gray-400'} rounded-lg hover:cursor-pointer`}>
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center mx-auto gap-2 text-gray-600 dark:text-gray-400">
                        <Images size={34} />
                        {isDragActive && isDragAccept ? (
                            <p className="text-sm text-center">Suelta tus imágenes aquí...</p>
                        ) : (
                            <p className="text-sm text-center">
                                Arrastra y suelta imágenes aquí o haz click para seleccionar
                            </p>
                        )}
                    </div>

                    <p className="text-center text-xs text-gray-500 dark:text-gray-600">Solo se permiten imágenes con extensión .png o .jpeg</p>
                </div>
            </div>
            {/* mostrar los preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-5">
                {renderPreviews()}
            </div>
        </div>
    );
}

export default function Fotos() {
    return (
        <section>
            <div className='mb-12 text-center'>
                <h2 className="font-semibold text-base sm:text-xl md:text-2xl text-neutral-900 dark:text-gray-100">
                    Agrega algunas fotos de tu inmueble a rentar
                </h2>
                <p className="text-sm mb-8 text-neutral-800 dark:text-gray-400">Selecciona un mínimo 5 fotografías. Más adelante podrás agregar más y realizar cambios</p>
            </div>
            <ImageUploader />
        </section>
    );
}