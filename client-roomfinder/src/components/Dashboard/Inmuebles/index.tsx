import Image from "next/image";
import Inmueble from "./Inmueble";

export default function Inmuebles (){

    /* Obtener inmuebles del arrendador */

    const inmueble = {
        imagen:'/inmueble.jpg',
        dormitorios: 2,
        banos: 5,
        ocupantes: 6,
        costo: 1200,
        descripcion: 'Casa acogedora ubicada en un vecindario tranquilo, cerca de la universidad y con buenos servicios. ¡Ideal para estudiantes!'
    }

    return(
        <>
            <section className="relative h-72">
                <Image
                    src={'/background/fondo-6.jpg'}
                    alt='RoomFinder background image'
                    layout="fill"
                    objectFit="cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <h1 className="font-semibold text-white text-3xl">Mis Inmuebles en Renta</h1>
                </div>
            </section>
            {/* momentaneo */}
            <section className="my-12">
                <div className="w-[95%] mx-auto grid grid-cols-3 gap-6"> {/* contenedor de propiedades */}
                    <Inmueble inmueble={inmueble}/>
                    <Inmueble inmueble={inmueble}/>
                    <Inmueble inmueble={inmueble}/>
                    <Inmueble inmueble={inmueble}/>
                    <Inmueble inmueble={inmueble}/>
                    <Inmueble inmueble={inmueble}/>
                </div>
            </section>
        </>
    );
}