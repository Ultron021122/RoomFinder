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

const styleDefault = 'rounded-sm shadow-lg h-96 w-96 sm:w-[400px] md:w-[500px] lg:w-[600px] mx-auto';

export default function Map({ position, zoom, style }: MapDataComponent) {
    return (
        <div className="h-[400px]">
            <MapContainer
                center={position}
                zoom={zoom}
                scrollWheelZoom={false}
                className={style ? style : styleDefault}
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
                        Ubicación de la propiedad. <br />
                        <i>Propiedad Marcada</i>.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}