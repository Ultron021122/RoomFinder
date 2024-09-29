'use client';

import { useFormulario } from "./FormularioContext";
import ImageElement from "../GeneralComponents/ImageElement";
import { ImageElementStyles } from "./ServiciosAmenidades";
import Image from 'next/image';
import Input from "../GeneralComponents/Input";
import { inputVacio } from "./Wizar";


function getIcon(inmueble:string){
    const iconos : Record<string, string> = {
        'Casa' : '/icon/house.svg',
        'Cuarto' : '/icon/room.svg',
        'Departamento' : '/icon/building.svg',
        'Limpieza' : '/icon/cleaning.png',
        'Gas' : '/icon/gas.png',
        'Luz' : '/icon/power.png',
        'TV cable' : '/icon/television.png',
        'Agua' : '/icon/water-tap.png',
        'Wifi' : '/icon/wifi.png',
        'Boiler' : '/icon/boiler.png',
        'Lavadora' : '/icon/washing-machine.png',
        'Estacionamiento' : '/icon/parking.png',
        'Cocina' : '/icon/kitchen.png',
        'Refrigerador' : '/icon/fridge.png',
        'Comedor' : '/icon/chair.png',
        'Patio' : '/icon/fence.png',
        'Sala de estar' : '/icon/sofa.png',
        'Área de lavado' : '/icon/area-lavado.png',
        'Aire acondicionado' : '/icon/ac.png'
    }

    return iconos[inmueble];
}

export default function Confirmar() {
    const {inmueble} = useFormulario();

    const {
        tipoInmueble,
        servicios,
        amenidades,
        numRecamaras,
        numCamas,
        numBanos,
        numHuespedes,
        capEstacionamiento,
        fotos,
        ubicacion,
        titulo,
        descripcion,
        reglas,
        costo
    } = inmueble;

    const {
        pais,
        direccion,
        estado,
        codigoPostal,
        ciudad_municipio,
        numExt,
        numInt
    } = ubicacion;

    return(
        <div className="w-[95%] mx-auto">
            <h2 className="text-center font-semibold text-3xl mb-10"> Confirma los datos de tu inmueble</h2>
            <section>
                <h3 className="font-semibold text-xl mb-4">Tipo de inmueble</h3>
                <ImageElement
                    icon={getIcon(inmueble.tipoInmueble)}
                    content={tipoInmueble}
                    width={ImageElementStyles.width}
                    height={ImageElementStyles.height}
                    style={ImageElementStyles.style}
                />

                <h3 className="font-semibold text-xl mt-4">Servicios y Amenidades</h3>
                <h4 className="text-lg my-2">Servicios</h4>
                <div className="flex flex-wrap gap-4"> {/* contenedor de servicios */}
                    {
                        servicios.map((servicio, index) => {
                            const icono = getIcon(servicio);
                            return(
                                <ImageElement
                                    key={index}
                                    icon={icono}
                                    content={servicio}
                                    width={ImageElementStyles.width}
                                    height={ImageElementStyles.height}
                                    style={ImageElementStyles.style}
                                />
                            );
                        })
                    }
                </div>
                
                <h4 className="text-lg my-2">Amenidades</h4>
                <div className="flex flex-wrap gap-4">
                    {
                        amenidades.map((amenidad, index) => {
                            const icono = getIcon(amenidad);
                            return(
                                <ImageElement
                                    key={index}
                                    icon={icono}
                                    content={amenidad}
                                    width={ImageElementStyles.width}
                                    height={ImageElementStyles.height}
                                    style={ImageElementStyles.style}
                                />
                            );
                        })
                    }
                </div>
            </section>
            
            <section className="my-4">
                <h3 className="font-semibold text-xl my-4">Información general del inmueble</h3>
                <div className="flex flex-wrap gap-4">
                    <ImageElement
                        icon="/icon/beds.png"
                        content={`Camas (${numCamas})`}
                        width={ImageElementStyles.width}
                        height={ImageElementStyles.height}
                        style={ImageElementStyles.style}
                    />
                    <ImageElement
                        icon="/icon/people.png"
                        content={`Huéspedes (${numHuespedes})`}
                        width={ImageElementStyles.width}
                        height={ImageElementStyles.height}
                        style={ImageElementStyles.style}
                    />
                    {
                        numRecamaras > 0 &&
                        <ImageElement
                            icon="/icon/bedroom-furniture.png"
                            content={`Recámaras (${numRecamaras})`}
                            width={ImageElementStyles.width}
                            height={ImageElementStyles.height}
                            style={ImageElementStyles.style}
                        />
                    }
                    {
                        numBanos > 0 &&
                        <ImageElement
                            icon="/icon/bathroom-cabinet.png"
                            content={`Baños (${numBanos})`}
                            width={ImageElementStyles.width}
                            height={ImageElementStyles.height}
                            style={ImageElementStyles.style}
                        />
                    }
                    {
                        amenidades.includes('Estacionamiento') &&
                        <ImageElement
                            icon="/icon/parking.png"
                            content={`Estacionamiento (${capEstacionamiento})`}
                            width={ImageElementStyles.width}
                            height={ImageElementStyles.height}
                            style={ImageElementStyles.style}
                        />
                    }
                </div>
            </section>

            <section>
                <h3 className="font-semibold text-xl my-4">Fotografías del inmueble</h3>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    {
                        fotos.map((imagen, index)=> {
                            const url = URL.createObjectURL(imagen);
                            return(
                                <div key={index} className="relative w-[100%] h-[250px]">
                                    <Image
                                        src={url}
                                        alt={`Imagen de inmueble ${index}`}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-lg"
                                    />
                                </div>
                            );
                        })
                    }
                </div>
            </section>

            <section className="my-4">
                <h3 className="font-semibold text-xl">Ubicación</h3>
                <div className="grid grid-cols-3 gap-4 mt-2">
                    <Input type="text" nombre="País" value={pais} disabled={true}/>
                    <Input type="text" nombre="Dirección" value={direccion} disabled={true}/>
                    <Input type="text" nombre="Estado" value={estado} disabled={true}/>
                    <Input type="number" nombre="Código postal" value={codigoPostal} disabled={true}/>
                    <Input type="text" nombre="Ciudad / municipio" value={ciudad_municipio} disabled={true}/>
                    <Input type="text" nombre="Número exterior" value={numExt} disabled={true}/>
                    {
                        !inputVacio(numInt) && 
                        <Input type="text" nombre="Número interior" value={numInt} disabled={true}/>
                    }
                </div>
            </section>

            <section className="mb-8">
                <h3 className="font-semibold text-xl my-4">Título</h3>
                <p className="text-lg">{titulo}</p>
                <h3 className="font-semibold text-xl my-4">Descripción</h3>
                <p className="text-lg">{descripcion}</p>
                <h3 className="font-semibold text-xl my-4">Restricciones</h3>
                <div className="grid grid-cols-2 gap-4">
                    {
                        reglas.map((regla, index) => 
                            <Input key={index} type="text" nombre={`Restricción ${index + 1}`} value={regla} disabled={true}/>
                        )
                    }
                </div>
                <h3 className="font-semibold text-xl my-4">Costo por mes</h3>
                <p className="text-lg">${costo} MXN</p>
            </section>
        </div>
    );
}