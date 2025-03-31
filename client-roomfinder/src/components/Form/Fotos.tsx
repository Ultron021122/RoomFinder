'use client';

import { useFormulario } from './FormularioContext';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Images, X } from 'lucide-react';
import { toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function ImageUploader() {
    const { inmueble, setInmueble } = useFormulario();

    // Función para convertir una imagen a Base64
    const convertirABase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);  // Lee la imagen como Data URL (Base64)
        });
    };

    const onDrop = async (acceptedFiles: File[]) => {
        const prev = inmueble.fotos;

        // Verifica cuántas imágenes se pueden añadir sin exceder el límite
        if (prev.length + acceptedFiles.length > 8) {
            toast.error("Solo se permiten 8 imagenes como maximo", {
                position: "bottom-right",
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

        // Convertir cada imagen a Base64 y almacenarlas en el estado
        const fotosBase64 = await Promise.all(acceptedFiles.map(file => convertirABase64(file)));
        
        setInmueble({ fotos: [...prev, ...fotosBase64] });
    };

    const quitarImg = (imagen: string) => {
        const fotosActuales = inmueble.fotos;
        let fotosActualizadas = fotosActuales.filter(foto => foto !== imagen);

        setInmueble({ fotos: fotosActualizadas });
    };

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

    // Generar el preview de las imágenes seleccionadas
    const renderPreviews = () => {
        return inmueble.fotos.map((imagenBase64, index) => {
            return (
                <div key={index} className="relative group aspect-video">
                    <Image
                        src={imagenBase64}
                        alt={`preview de imagen ${index}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className='absolute inset-0 object-cover w-full h-full'
                    />
                    <button
                        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full border border-solid border-white bg-transparent text-white hover:bg-gray-600"
                        onClick={() => quitarImg(imagenBase64)}
                    >
                        <X size={20} />
                    </button>
                </div>
            );
        });
    };

    return (
        <div>
            <div className="w-full mx-auto">
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
            {/* Mostrar los previews */}
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
