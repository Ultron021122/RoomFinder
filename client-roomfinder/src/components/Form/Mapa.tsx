'use client';

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl, {Map} from "mapbox-gl";
import { useFormulario, InterfaceUbicacion } from './FormularioContext';
import { useRef, useEffect } from 'react';

export default function Mapa(){
    const {setInmueble} = useFormulario();
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);

    /*useEffect(() => {
        if(!mapContainerRef.current) return;

        mapboxgl.accessToken = `${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-103.3274, 20.662],
            zoom: 10
        });

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            placeholder: 'Ingresa tu dirección',
            marker: false,
        })

        geocoder.on('result', function(e){
            const result = e.result;

            const address = result.place_name; // Dirección completa
            const country = result.context?.find((c: any) => c.id.includes('country'))?.text; // País
            const state = result.context?.find((c: any) => c.id.includes('region'))?.text; // Estado
            const city = result.context?.find((c: any) => c.id.includes('place') || c.id.includes('locality'))?.text; // Ciudad o Municipio
            const postalCode = result.context?.find((c: any) => c.id.includes('postcode'))?.text; // Código postal

            // obj ubicacion
            const ubicacion : InterfaceUbicacion = {
                pais: country,
                direccion: address,
                estado: state,
                codigoPostal: postalCode,
                ciudad_municipio: city
            }

            // almacenar datos en el contexto
            setInmueble({ubicacion: ubicacion})
        });

        mapRef.current.addControl(geocoder);
        
        return () => mapRef.current?.remove();

    }, []);*/

    return(
        <div ref={mapContainerRef} className="h-[500px] w-[650px] rounded-lg mx-auto"/>
    );
}