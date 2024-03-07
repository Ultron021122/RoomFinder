import { MapContainer, TileLayer, Marker, Tooltip, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

interface MapData {
    position: [number, number];
    zoom: number;
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

export default function Map({ position, zoom }: MapData) {
    return (
        <div>
            <MapContainer center={position} zoom={zoom} className="map-width">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createClusterCustomIcon}
                >
                    <Marker position={position} icon={customIcon}>
                        <Popup>
                            A pretty CSS3.
                        </Popup>
                    </Marker>
                    <Marker position={[20.656114, -103.331217]} icon={customIcon}>
                        <Popup>
                            A 2.
                        </Popup>
                    </Marker>
                    <Marker position={[20.651617, -103.324075]} icon={universityIcon}>
                        <Popup>
                            A 1
                        </Popup>
                    </Marker>
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
}