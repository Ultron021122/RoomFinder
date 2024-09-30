'use client';

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl, { Map } from "mapbox-gl";
import { useFormulario, InterfaceUbicacion } from './FormularioContext';
import { useRef, useEffect } from 'react';

export default function Mapa() {
    const { setInmueble } = useFormulario();
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

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
        });

        geocoder.on('result', function (e) {
            const result = e.result;
            console.log(result);
            const coordenadas = result.geometry.coordinates; // Latitud y longitud
            const lat = coordenadas[1];
            const lng = coordenadas[0];

            const address = result.place_name; // Dirección completa
            const country = result.context?.find((c: any) => c.id.includes('country'))?.text; // País
            const state = result.context?.find((c: any) => c.id.includes('region'))?.text; // Estado
            const city = result.context?.find((c: any) => c.id.includes('place') || c.id.includes('locality'))?.text; // Ciudad o Municipio
            const postalCode = result.context?.find((c: any) => c.id.includes('postcode'))?.text; // Código postal

            // Objeto ubicación
            const ubicacion: InterfaceUbicacion = {
                pais: country,
                direccion: address,
                estado: state,
                codigoPostal: postalCode,
                ciudad_municipio: city,
                latitud: lat,
                longitud: lng
            };

            // Almacenar datos en el contexto
            setInmueble({ ubicacion: ubicacion });

            // Crear y agregar el marcador
            if (markerRef.current) {
                markerRef.current.remove(); // Eliminar el marcador anterior si existe
            }

            // Verifica que mapRef.current no sea null antes de usarlo
            if (mapRef.current) {
                markerRef.current = new mapboxgl.Marker()
                    .setLngLat([lng, lat])
                    .addTo(mapRef.current);

                // Centrar el mapa en la nueva ubicación
                mapRef.current.setCenter([lng, lat]);
                mapRef.current.setZoom(15); // Ajusta el nivel de zoom si es necesario
            }
        });

        mapRef.current.addControl(geocoder);

        return () => {
            mapRef.current?.remove();
            markerRef.current?.remove(); // Eliminar el marcador al desmontar
        };
    }, []);

    return (
        <div ref={mapContainerRef} className="h-96 w-96 sm:w-[400px] md:w-[700px] rounded-sm mx-auto" />
    );
}
