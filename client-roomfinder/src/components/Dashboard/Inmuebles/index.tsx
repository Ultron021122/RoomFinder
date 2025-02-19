'use client'

import TarjetaPropiedad from "@/components/GeneralComponents/Card";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import { Properties } from "@/utils/interfaces";

// Estilos de toastify
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FilterOption = {
    id: number
    name: string
}

const filterOptions : FilterOption[] = [
    { id: 1, name: 'Seleccione una opción' },
    { id: 2, name: 'Casa' },
    { id: 3, name: 'Cuarto' },
    { id: 4, name: 'Departamento' },
]

export default function Inmuebles() {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [properties, setproperties] = useState<Properties[] | null>(null);

    function areThereProperties(){
        return (properties != null && properties.length > 0) ? true : false;
    }

    function handleViewProperty(id: number){
        router.push(`/property/${id}`);
    }

    /* traer las propiedades de la base de datos */
    useEffect(() => {
        async function fetchProperties(){
            const response = await axios.get('/api/properties/');
            if(response.status === 200){
                console.log(response.data); // eliminar esto
                setproperties(response.data.data);
                setIsLoading(false);
            }else{
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide,
                });
            }
        }

        fetchProperties();
    }, []); // solo consultar una vez

    return (
        <>
            <Header />
            <section className="w-[95%] mx-auto my-12">
                <p className="text-lg opacity-50 mb-2">Basado en tu centro universitario</p>
                <p className="">Filtrar por:</p>
                <select className="p-2 mb-4 rounded-md" name="filtro" id="filtro">
                    {filterOptions.map(filterOption => <option key={filterOption.id} value={filterOption.id}>{filterOption.name}</option>)}
                </select>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[40vh] lg:py-0 shadow-lg">
                        <Spinner/>
                    </div>
                ) : !areThereProperties() ? (
                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[40vh] lg:py-0 shadow-lg">
                        <p className="text-lg font-semibold">Por el momento no hay propiedades registradas. Inténtalo más tarde</p>
                    </div>
                ) : 
                (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* contenedor de propiedades */}
                    {properties?.map(property => <TarjetaPropiedad key={property.propertyid} data={property} handleViewProperty={handleViewProperty}/>)}
                </div>
                )}
            </section>
        </>
    );
}