'use client';

import { useFormulario } from './FormularioContext';
import { useDropzone} from 'react-dropzone';
import Image from 'next/image';
import Button from '../GeneralComponents/Button';

function ImageUploader(){
    const { inmueble, setInmueble } = useFormulario();

    const onDrop = (acceptedFiles: File[]) => {
        const prev = inmueble.fotos;
        console.log(prev);
        setInmueble({fotos : [...prev, ...acceptedFiles] });
    }

    const quitarImg = (imagen : File) => {
        const fotosActuales = inmueble.fotos;
        let fotosActualizadas = fotosActuales.filter(foto => {
            return foto !== imagen;
        });

        setInmueble({fotos : fotosActualizadas});
    }

    // integrando react-dropzone
    const {getRootProps, getInputProps, isDragActive, isDragAccept} = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        maxFiles: 8,
    });

    //generar preview de las imágenes seleccionadas
    const renderPreviews = () => {
        return inmueble.fotos.map((imagen, index) => {
            const imagenURL = URL.createObjectURL(imagen);
            return(
                <div key={index} className="relative group w-[470px] h-[300px] m-2">
                    <Image
                        src={imagenURL}
                        alt={`preview de imagen ${index}`}
                        layout="fill"
                        objectFit="cover"
                    />
                    <div className="absolute left-0 right-0 bottom-4 opacity-0 group-hover:opacity-100 transition-all">
                        <div className="grid place-items-center">
                            <Button
                                contenido="X"
                                className="w-[35px] h-[35px] rounded-full border border-solid border-white text-white hover:bg-gray-600"
                                onClick={() => {quitarImg(imagen)}}
                            />
                        </div>
                    </div>
                </div>
            );
        })
    }

    return(
        <div className="w-[85%] mx-auto">
            <div {...getRootProps()} className={`p-4 border-2 border-dashed ${isDragActive ? 'border-blue-400' : 'border-gray-400'} rounded-lg hover:cursor-pointer`}>                
                <input {...getInputProps()} />
                {isDragActive && isDragAccept ?
                    <p className="text-center">Suelta tus imágenes aquí...</p> : <p className="text-center">Arrastra y suelta imágenes aquí o haz click para seleccionar</p>
                }
                <p className="text-center text-zinc-300">Solo se permiten imágenes con extensión .png o .jpeg</p>
            </div>

            {/* mostrar los preview */}
            <div className="flex flex-wrap mt-4">
                {renderPreviews()}
            </div>
        </div>
    );
}

export default function Fotos(){
    return(
        <div>
            <h2 className="text-center font-semibold text-3xl mb-10">Agrega algunas fotos de tu inmueble a rentar</h2>
            <p className="text-xl mb-8">Para iniciar se necesitan como mínimo 5 fotografías. Más adelante podrás agregar más y realizar cambios</p>
            <ImageUploader/>
        </div>
    );
}