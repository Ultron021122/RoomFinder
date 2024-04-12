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

export default function Map({ position, zoom, name }: MapData) {
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

    return (
        <div>
            <MapContainer center={position} zoom={zoom} className="map-width">
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
                                <Popup>{universidad.popUp}</Popup>
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
                            <Popup>{propertie.popUp}</Popup>
                        </Marker>
                    ))
                    }
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
}