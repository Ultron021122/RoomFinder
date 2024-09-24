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
import { Rating } from '@mui/material';
import Image from 'next/image';
import { Link } from 'lucide-react';

// Icons personalizados
const customIcon = new Icon({
    iconUrl: "/images/property.png",
    iconSize: [52, 52]
});

const universityIcon = new Icon({
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
            <MapContainer center={position} zoom={zoom} className="map-width" zoomControl={false}>
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
                                    <h3 className="text-sm font-semibold">{propertie.vchtitle}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs">Calificación:</span>
                                        <Rating size='small' name="read-only" value={propertie.decpropertyrating} precision={0.5} readOnly />
                                    </div>
                                    <p className="text-xs">
                                        {propertie.vchdescription}
                                    </p>
                                    <div className="image-gallery">
                                        {propertie.imagenesUrl.map((image, imgIndex) => (
                                            <Image
                                                width={imgIndex === 0 ? 400 : 200}
                                                height={imgIndex === 0 ? 300 : 150}
                                                key={image.id}
                                                src={image.url}
                                                alt={`Imagen ${image.id}`}
                                                className={imgIndex === 0 ? "popup-image large" : "popup-image small"}
                                            />
                                        ))}
                                    </div>
                                    <a
                                        href={`/property/${propertie.propertyid}`}
                                        style={{ color: 'white', textDecoration: 'none' }}
                                        className="block mt-2 text-center text-white no-underline text-current bg-blue-500 hover:bg-blue-700 transition-colors duration-300 py-1 rounded-lg"
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