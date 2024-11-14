import { useMap } from 'react-leaflet/hooks';
import React, { useEffect, useRef } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, divIcon, point, Map as Mapa, Marker as LeafletMarker } from "leaflet";
// Datos de las propiedades y universidades
import { MapData } from '@/utils/interfaces';
import { universities, properties } from "@/utils/constants";
// Estilos de leaflet
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';

// Icons personalizados
export const customIcon = new Icon({
    iconUrl: "/images/property.png",
    iconSize: [52, 52]
});

export const universityIcon = new Icon({
    iconUrl: "/images/universidad1.png",
    iconSize: [52, 52]
});

// Clúster
const createClusterCustomIcon = function (cluster: any) {
    return divIcon({
        html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
        className: "custom-marker-cluster",
        iconSize: point(33, 33, true)
    });
};

export default function Map({ position, zoom, name, typeProperty }: MapData) {
    const mapRef = useRef<Mapa | null>(null);
    const markerRefs = useRef<Record<string, React.RefObject<LeafletMarker>>>({});

    const SetMapRef = () => {
        const map = useMap();
        mapRef.current = map;
        return null;
    };

    const getUniversityLocation = (name: string) => {
        const filteredUniversities = universities.filter((universidad) => universidad.name === name);
        if (filteredUniversities.length > 0) {
            return filteredUniversities[0].geocode;
        }
        return position;
    }

    useEffect(() => {
        if (mapRef.current && name) {
            const universityLocation = getUniversityLocation(name); // Obtén la ubicación de la universidad de alguna manera
            mapRef.current.flyTo(universityLocation, zoom, { animate: true, duration: 3 }); // Mueve el mapa a la ubicación de la universidad

            setTimeout(() => {
                const markerRef = markerRefs.current[name];
                if (markerRef && markerRef.current) {
                    markerRef.current.openPopup();
                }
            }, 4000);
        }
    }, [name]);

    useEffect(() => {
        console.log('Tipo de propiedad:', typeProperty);
    }, [typeProperty]);

    return (
        <div>
            <MapContainer center={position} zoom={zoom} className="h-screen w-screen max-w-screen-2xl z-10 relative float-left" zoomControl={false}>
                <SetMapRef />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createClusterCustomIcon}
                >
                    {universities.map((universidad, index) => {
                        if (!markerRefs.current[universidad.name]) {
                            markerRefs.current[universidad.name] = React.createRef();
                        }

                        return (
                            <Marker
                                position={universidad.geocode}
                                icon={universityIcon}
                                key={index}
                                ref={markerRefs.current[universidad.name]}
                            >
                                <Popup>
                                    <div className='font-sans'>
                                        <h3 className='text-sm font-semibold text-center mb-2'>{universidad.name}</h3>
                                        <Image
                                            width={'400'}
                                            height={'350'}
                                            src={universidad.imageUrl}
                                            alt={'Imagen ' + universidad.name}
                                            className="w-full h-auto mb-2 rounded" />
                                        <p className="text-xs text-center text-gray-700 mb-2">{universidad.description}</p>
                                        <a
                                            href={universidad.website}
                                            target="_blank"
                                            style={{ color: 'white', textDecoration: 'none' }}
                                            className="block text-center text-white no-underline text-current bg-blue-500 hover:bg-blue-700 transition-colors duration-300 py-2 rounded-lg"
                                        >
                                            Visitar Website
                                        </a>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MarkerClusterGroup>

                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createClusterCustomIcon}
                >
                    {properties.map((propertie, index) => (
                        <Marker position={propertie.geocode} icon={customIcon} key={index}>
                            <Popup>
                                <div className="popup-content font-sans">
                                    <h3 className="mt-1 text-base font-semibold text-white sm:text-slate-900 md:text-xl">{propertie.vchtitle}</h3>
                                    <dl className="mt-4 text-xs font-medium flex items-center row-start-2 sm:mt-1 sm:row-start-3 md:mt-2.5 lg:row-start-2">
                                        <dt className="sr-only">Reviews</dt>
                                        <dd className="text-blue-600 flex items-center">
                                            <Star size={18} className="mr-1" />
                                            <span>{propertie.decpropertyrating} <span className="text-slate-600 font-normal">(128)</span></span>
                                        </dd>
                                        <dt className="sr-only">Location</dt>
                                        <dd className="flex items-center text-neutral-700">
                                            <svg width="2" height="2" aria-hidden="true" fill="currentColor" className="mx-3 text-slate-300">
                                                <circle cx="1" cy="1" r="1" />
                                            </svg>
                                            <MapPin size={18} className="mr-1" />
                                            Collingwood, Ontario
                                        </dd>
                                    </dl>
                                    <p className="mt-2 text-xs leading-6 col-start-1 sm:col-span-2 lg:row-start-4 lg:col-span-1">
                                        {propertie.vchdescription}
                                    </p>
                                    {propertie && (
                                        <div className="grid gap-2 col-start-1 col-end-3 row-start-1 sm:mb-6 sm:grid-cols-4 lg:gap-4 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
                                            <Image
                                                width={800}
                                                height={800}
                                                src={propertie.imagenesUrl[0].url}
                                                alt={`Imagen ${propertie.imagenesUrl[0].id}`}
                                                className="w-40 h-auto object-cover rounded-lg sm:w-60 sm:col-span-2 lg:col-span-full" />
                                            <Image
                                                width={800}
                                                height={800}
                                                src={propertie.imagenesUrl[1].url}
                                                alt={`Imagen ${propertie.imagenesUrl[1].id}`}
                                                className="hidden h-auto w-20 object-cover rounded-lg sm:block sm:col-span-2 md:col-span-1 lg:row-start-2 lg:col-span-2 lg:w-28" />
                                            <Image
                                                width={800}
                                                height={800}
                                                src={propertie.imagenesUrl[2].url}
                                                alt={`Imagen ${propertie.imagenesUrl[2].id}`}
                                                className="hidden h-auto w-20 object-cover rounded-lg md:block lg:row-start-2 lg:col-span-2 lg:w-28" />
                                        </div>
                                    )}
                                    <a
                                        href={`/property/${propertie.propertyid}`}
                                        style={{ color: 'white', textDecoration: 'none' }}
                                        className="block mt-2 text-center text-white no-underline text-current bg-blue-500 hover:bg-blue-700 transition-colors duration-300 py-2 rounded-lg"
                                    >
                                        Ver más
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
}