import { MapContainer, TileLayer, Marker, Tooltip, Popup } from "react-leaflet";
import { useMap } from 'react-leaflet/hooks';
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { Icon, divIcon, point, Map as Mapa } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { universities } from "@/utils/constants";

interface MapData {
    name: string;
    position: [number, number];
    zoom: number;
}

interface MapCoordenada {
    geocode: [number, number];
    popUp: string;
}

interface DynamicMapProps {
    position: [number, number];
    zoom: number;
    university: string;
}

const customIcon = new Icon({
    iconUrl: "/images/property.png",
    iconSize: [52, 52]
});

const universityIcon = new Icon({
    iconUrl: "/images/universidad1.png",
    iconSize: [52, 52]
});

const createClusterCustomIcon = function (cluster: any) {
    return divIcon({
        html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
        className: "custom-marker-cluster",
        iconSize: point(33, 33, true)
    });
};

// Pruebas Properties
const properties: MapCoordenada[] = [
    {
        geocode: [20.656114, -103.331217],
        popUp: "Propiedad Número 1"
    },
    {
        geocode: [20.651617, -103.324075],
        popUp: "Propiedad Número 2"
    },
    {
        geocode: [20.657007, -103.316989],
        popUp: "Propiedad Número 3"
    },
    {
        geocode: [20.659820, -103.328892],
        popUp: "Propiedad Número 4"
    },
    {
        geocode: [20.650588, -103.329476],
        popUp: "Propiedad Número 5"
    },
    {
        geocode: [20.653525, -103.319747],
        popUp: "Propiedad Número 6"
    }
];

export default function Map({ position, zoom, name }: MapData) {
    const mapRef = useRef<Mapa | null>(null);
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
                    {universities.map((universidad, index) => (
                        <Marker position={universidad.geocode} icon={universityIcon} key={index}>
                            <Popup>{universidad.popUp}</Popup>
                        </Marker>
                    ))
                    }
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