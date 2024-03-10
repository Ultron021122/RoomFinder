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

interface MapCoordenada {
    geocode: [number, number];
    popUp: string;
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

// Pruebas University
const university: MapCoordenada[] = [
    {
        geocode: [20.655080, -103.325448],
        popUp: "Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI)"
    },
    {
        geocode: [20.738857, -103.311808],
        popUp: "Centro Universitario de Arte, Arquitectura y Diseño (CUAAD)"
    },
    {
        geocode: [20.746758, -103.513747],
        popUp: "Centro Universitario de Ciencias Biológicas y Agropecuarias (CUCBA)"
    },
    {
        geocode: [20.739602, -103.381788],
        popUp: "Centro Universitario de Ciencias Económico Administrativas (CUCEA)"
    },
    {
        geocode: [20.686401, -103.331540],
        popUp: "Centro Universitario de Ciencias de la Salud (CUCS)"
    },
    {
        geocode: [20.693131, -103.349932],
        popUp: "Centro Universitario de Ciencias Sociales y Humanidades (CUCSH)"
    },
    {
        geocode: [20.370837, -102.768468],
        popUp: "Centro Universitario de la Ciénega (CUCIÉNEGA)"
    },
    {
        geocode: [20.706166, -105.220636],
        popUp: "Centro Universitario de la Costa (CUCOSTA)"
    },
    {
        geocode: [19.774326, -104.357906],
        popUp: "Centro Universitario del Sur (CUCSUR)"
    },
    {
        geocode: [21.356874, -101.951558],
        popUp: "Centro Universitario de los Lagos (CULAGOS)"
    },
    {
        geocode: [22.136822, -103.243725],
        popUp: "Centro Universitario del Norte (CUNORTE)"
    },
    {
        geocode: [19.723689, -103.462188],
        popUp: "Centro Universitario del Sur (CUSUR)"
    },
    {
        geocode: [20.566657, -103.225693],
        popUp: "Centro Universitario de Tonalá (CUTONALÁ)"
    },
    {
        geocode: [20.534568, -103.967400],
        popUp: "Centro Universitario de los Valles (CUVALLES)"
    }
];

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
                    {university.map((univer, index) => (
                        <Marker position={univer.geocode} icon={universityIcon} key={index}>
                            <Popup>{univer.popUp}</Popup>
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