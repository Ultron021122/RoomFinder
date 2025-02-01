'use client'

import { useState, ChangeEvent, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import polyline from '@mapbox/polyline';
import axios from 'axios';

interface MapControllerProps {
    center: [number, number]
    zoom: number
}

function MapController({ center, zoom }: MapControllerProps) {
    const map = useMap()
    map.setView(center, zoom)
    return null
}

export default function MapaConDrawer() {
    const [mapCenter, setMapCenter] = useState<[number, number]>([40.416775, -3.703790]) // Madrid
    const [mapZoom, setMapZoom] = useState<number>(13);

    const [route, setRoute] = useState<L.LatLng[]>([]);

    useEffect(() => {
        const fetchRoute = async () => {
          const origin = 'New York, NY';
          const destination = 'Los Angeles, CA';
    
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.data;
    
          if (data.routes.length > 0) {
            const points = data.routes[0].overview_polyline.points;
            const decodedPoints = polyline.decode(points).map(([lat, lng]) => L.latLng(lat, lng));
            setRoute(decodedPoints);
          }
        };
    
        fetchRoute();
      }, []);

    const handleCenterChange = (e: ChangeEvent<HTMLInputElement>) => {
        const [lat, lng] = e.target.value.split(',').map(Number)
        if (!isNaN(lat) && !isNaN(lng)) {
            setMapCenter([lat, lng])
        }
    }

    const handleZoomChange = (value: number[]) => {
        setMapZoom(value[0])
    }

    return (
        <div className="h-screen w-full relative z-20">
            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* <Marker position={mapCenter} />
                <MapController center={mapCenter} zoom={mapZoom} /> */}
                {route.length > 0 && <Polyline positions={route} color="blue" />}
            </MapContainer>
        </div>
    )
}
