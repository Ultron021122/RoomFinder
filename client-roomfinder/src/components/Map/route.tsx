'use client'

import { useState, ChangeEvent, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import polyline from '@mapbox/polyline';
import styles from '@/app/map-route/Map.module.css';

interface MapControllerProps {
  center: [number, number]
  zoom: number
}

function MapController({ center, zoom }: MapControllerProps) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

export default function RouteMap({ center, zoom }: MapControllerProps) {
  const [route, setRoute] = useState<L.LatLng[]>([]);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      // Usando coordenadas como origen y destino
      const origin = 'Calle Montealbán 95 Ciudad Aztlán, Tonalá, Jalisco';
      const destination = 'Camichines San Pedro Tlaquepaque, Jalisco';
      const mode = 'walking'; // Specify the mode of transportation

      const response = await fetch(
        `/api/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}`
      );

      if (!response.ok) {
        console.error('Failed to fetch directions:', response.statusText);
        return;
      }

      const data = await response.json();

      if (data.routes.length > 0) {
        const routeData = data.routes[0];
        const points = routeData.overview_polyline.points;
        const decodedPoints = polyline.decode(points).map(([lat, lng]) => L.latLng(lat, lng));
        setRoute(decodedPoints);
        setDistance(routeData.legs[0].distance.text);
        setDuration(routeData.legs[0].duration.text);
      } else {
        console.error('No routes found');
      }
    };

    fetchRoute();
  }, []);

  return (


<div className={styles.mapContainer}>
<div className={styles.routeDetails + ` bg-gray-100 shadow-sm dark:bg-gray-900 min-w-44`}>
  <h3 className='text-black dark:text-white text-sm'>Detalles de la Ruta</h3>
  {distance && duration ? (
    <div>
      <p><strong>Distancia:</strong> {distance}</p>
      <p><strong>Duración:</strong> {duration}</p>
    </div>
  ) : (
    <p>Cargando datos de ruta...</p>
  )}
</div>
<div className="h-screen w-full relative z-20">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {route.length > 0 && <Polyline positions={route} color="#2563eb" />}
      </MapContainer>
    </div>
</div>
  )
}
