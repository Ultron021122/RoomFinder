import Image from "next/image";
import CardElement from "@/components/GeneralComponents/CardElement";
import Header from "@/components/Dashboard/Inmuebles/Header";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default function AppInmuebles (){

    /* Obtener inmuebles del arrendador */

    /* por el momento */
    const inmuebles = [
        {
            imagenes: [
                {url: '/inmueble.jpg', id:1},
                {url : '/background/interior1.jpg', id:2},
                {url : '/background/interior2.jpg', id:3},
                {url : '/background/interior3.jpg', id:4},
                {url : '/background/interior4.jpg', id:5},
            ],
            id: 1,
            tipo:'Casa',
            dormitorios: 2,
            baths: 5,
            ocupantes: 6,
            costo: 1200,
            descripcion: 'Casa acogedora ubicada en un vecindario tranquilo, cerca de la universidad y con buenos servicios. ¡Ideal para estudiantes!'
        },

        {
            imagenes: [
                {url: '/inmueble2.jpg', id:1},
                {url : '/background/interior1.jpg', id:2},
                {url : '/background/interior2.jpg', id:3},
                {url : '/background/interior3.jpg', id:4},
                {url : '/background/interior4.jpg', id:5},
            ],
            id: 2,
            tipo:'Departamento',
            dormitorios: 1,
            baths: 1,
            ocupantes: 2,
            costo: 3500,
            descripcion: 'Casa acogedora ubicada en un vecindario tranquilo, cerca de la universidad y con buenos servicios. ¡Ideal para estudiantes!'
        },

        {
            imagenes: [
                {url: '/inmueble3.jpg', id:1},
                {url : '/background/interior1.jpg', id:2},
                {url : '/background/interior2.jpg', id:3},
                {url : '/background/interior3.jpg', id:4},
                {url : '/background/interior4.jpg', id:5},
            ],
            id: 3,
            tipo:'Cuarto',
            dormitorios: 1,
            baths: 1,
            ocupantes: 6,
            costo: 2200,
            descripcion: 'Casa acogedora ubicada en un vecindario tranquilo, cerca de la universidad y con buenos servicios. ¡Ideal para estudiantes!'}
    ]

    return(
        <div>
            <Breadcrumb pageName="Inmuebles" />
            <Header />
            {/* momentaneo */}
            <section className="my-12">
                <div className="w-[95%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> {/* contenedor de propiedades */}
                    <CardElement inmueble={inmuebles[0]}/>
                    <CardElement inmueble={inmuebles[1]}/>
                    <CardElement inmueble={inmuebles[2]}/>
                    <CardElement inmueble={inmuebles[0]}/>
                    <CardElement inmueble={inmuebles[1]}/>
                    <CardElement inmueble={inmuebles[2]}/>
                </div>
            </section>
        </div>
    );
}