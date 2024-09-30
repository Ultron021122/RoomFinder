'use client';

import { MapDataComponent } from "@/utils/interfaces";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const customIcon = new Icon({
    iconUrl: "/images/property.png",
    iconSize: [52, 52]
});

export default function Map({ position, zoom }: MapDataComponent) {
    return (
        <div>
            <MapContainer
                center={position}
                zoom={zoom}
                scrollWheelZoom={false}
                className="rounded-lg shadow-lg h-96 w-96 sm:w-[400px] md:w-[700px] mx-auto"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    position={position}
                    icon={customIcon}
                >
                    <Popup>
                        This Marker icon is displayed correctly with{" "}
                        <i>leaflet-defaulticon-compatibility</i>.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}