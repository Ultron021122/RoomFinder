import Image from "next/image";
import ImageElement from "@/components/GeneralComponents/ImageElement";

let Content = {
    Title: "¡Bienvenido a RoomFinder, estudiante!"
}


export default function AppHome(){
    return(
        <>
            <header className="relative h-96 bg-gray-500">
                <Image
                    src={'/background/fondo-1.jpg'}
                    alt="RoomFinder background image"
                    layout='fill'
                    objectFit='cover'
                />
                <div className="flex flex-col justify-center items-center place-items-center absolute inset-0 bg-black bg-opacity-50">
                    <h1 className="font-semibold text-4xl mb-4 text-white">{Content.Title}</h1>
                    <p className="font-medium text-white text-center w-[95%]">
                        Estamos encantados de que te unas a nuestra comunidad. 
                        <br/><br/>
                        RoomFinder es una plataforma diseñada específicamente para conectar estudiantes universitarios como tú que buscan un lugar seguro, cómodo y adecuado para vivir mientras continúan sus estudios, con arrendadores seguros y confiables.
                    </p>
                </div>
            </header>

            <section className="mt-12">
                <h2 className="text-center text-3xl mb-9">¿Qué puedes hacer en RoomFinder?</h2>

                <ul className="flex justify-evenly w-[95%] mx-auto">
                    <li>
                        <ImageElement
                            icon={'/icon/home/accomodation.png'}
                            content={'Buscar y filtrar propiedades en renta'}
                        />
                    </li>
                    <li>
                        <ImageElement 
                            icon={'/icon/home/schedule.png'}
                            content={'Agendar visitas a hogares potenciales'}
                        />
                    </li>
                    <li>
                        <ImageElement
                            icon={'/icon/home/apply_sign.png'}
                            content={'Aplicar y rentar en línea'}
                        />
                    </li>
                    <li>
                        <ImageElement 
                            icon={'/icon/service.png'}
                            content={'Vivir seguro'}
                        />
                    </li>
                </ul>                
            </section>

            <section className="relative mt-12 h-72">
                <Image
                    src={'/background/fondo-5.jpg'}
                    alt='RoomFinder background image'
                    layout='fill'
                    objectFit="cover"
                />

                <div className="flex justify-center items-center absolute inset-0 bg-black bg-opacity-50">
                    <h2 className="text-center text-3xl mb-6 text-white font-semibold">¿Cuál es  nuestro propósito?</h2>
                </div>
            </section>

            <section className="my-12">
                <div className="w-[95%] mx-auto grid grid-cols-2 gap-5">
                    <Image
                        src={'/background/fondo-4.jpg'}
                        alt='RoomFinder background image'
                        width={600}
                        height={450}
                        layout="responsive"
                    />
                    <p className="text-lg leading-9">
                    Nuestro objetivo es facilitar el proceso de renta para ambos lados: que los estudiantes encuentren el lugar ideal donde vivir mientras estudian, y que tú como arrendador puedas alquilar tus inmuebles de manera más rápida y efectiva. Creemos en crear una experiencia segura y conveniente, donde los estudiantes puedan concentrarse en sus estudios sabiendo que tienen un hogar adecuado, y tú puedas gestionar tus propiedades con tranquilidad.

                    ¡Gracias por confiar en nosotros! Estamos aquí para ayudarte a optimizar la ocupación de tus inmuebles y a establecer conexiones exitosas con la comunidad estudiantil.
                    </p>
                </div>
            </section>
        </>
    );
}