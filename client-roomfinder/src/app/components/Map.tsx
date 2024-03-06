import React from "react";
import { Icon, divIcon, marker, point } from "leaflet";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

interface MarkerData {
    geocode: [number, number];
    popUp: string;
}

const customIcon = new Icon({
    iconUrl: "path/to/your/icon.png", // Replace with your icon path
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [1, -34],
});

export default function Map(){
    const markers: MarkerData[] = [
        {
            geocode: [20.656114, -103.331217],
            popUp: "Propiedad Número 1",
        },
        // ... other marker data
    ];

    return (
        <>
            <div className="sm:ml-64">
                <MapContainer center={[20.655080, -103.325448]} zoom={16}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {markers.map((marker, index) => (
                        <Marker key={index} position={marker.geocode} icon={customIcon}>
                            <Popup>{marker.popUp}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </>
    );
}
