import { useState, useEffect, useRef } from 'react'
import { Icon } from "leaflet";
import { useLoadScript } from '@react-google-maps/api'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import L from 'leaflet'
import { Spinner } from '@nextui-org/react'
import { InterfaceUbicacion, useFormulario } from '@/components/Form/FormularioContext'
import { MapPin } from 'lucide-react';

//Corrige el problema de los iconos de Leaflet en Next.js
const icon = new Icon({
  iconUrl: '/images/property.png',
  // iconRetinaUrl: '/marker-icon-2x.png',
  // shadowUrl: '/marker-shadow.png',
  iconSize: [52, 52],
  // iconAnchor: [12, 41],
  // popupAnchor: [1, -34],
  // tooltipAnchor: [16, -28],
  // shadowSize: [41, 41]
})

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places']

interface Coordinates {
  lat: number;
  lng: number;
}

export default function MapaDireccion() {
  const [address, setAddress] = useState<string>('')
  const { setInmueble } = useFormulario();
  const [coordinates, setCoordinates] = useState<Coordinates>({ lat: 20.6668200, lng: -103.3918200 }) // Ciudad de México por defecto
  const [addressComponents, setAddressComponents] = useState<any>(null) // Para almacenar los componentes de la dirección
  const autocompleteRef = useRef<HTMLInputElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: libraries,
  })

  useEffect(() => {
    if (isLoaded && !loadError && autocompleteRef.current && typeof google !== 'undefined') {
      const autocomplete = new google.maps.places.Autocomplete(autocompleteRef.current, {
        types: ['address'],
      })

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place.geometry && place.geometry.location) {
          setAddress(place.formatted_address || '')
          setCoordinates({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          })

          // Extraer los componentes de la dirección
          const components = place.address_components?.reduce((acc: any, component: google.maps.GeocoderAddressComponent) => {
            const types = component.types
            if (types.includes('street_number')) {
              acc.streetNumber = component.long_name
            } else if (types.includes('route')) {
              acc.route = component.long_name
            } else if (types.includes('locality')) {
              acc.city = component.long_name
            } else if (types.includes('administrative_area_level_1')) {
              acc.state = component.long_name
            } else if (types.includes('country')) {
              acc.country = component.long_name
            } else if (types.includes('postal_code')) {
              acc.zipCode = component.long_name
            } else if (types.includes('sublocality')) {
              acc.sublocality = component.long_name
            }
            return acc
          }, {})

          const ubicacion: InterfaceUbicacion = {
            calle: components.route,
            numExt: components.streetNumber,
            pais: components.country,
            direccion: place.formatted_address || '',
            estado: components.state,
            colonia: components.sublocality,
            codigoPostal: components.zipCode,
            ciudad_municipio: components.city,
            latitud: place.geometry.location.lat(),
            longitud: place.geometry.location.lng()
          };
          
          // Almacenar datos en el contexto
          setInmueble({ ubicacion: ubicacion });
          setAddressComponents(ubicacion)
        }
      })
    }
  }, [isLoaded, loadError])

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([coordinates.lat, coordinates.lng], 13)
    }
  }, [coordinates])

  if (loadError) return <div>Error al cargar los mapas</div>
  if (!isLoaded) return <Spinner />

  return (
    <div className="space-y-4">
      <div className="w-full mb-5">
        <label htmlFor="location-property" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Ubicación de la propiedad
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-700 dark:text-gray-400 dark:border-gray-700">
            <MapPin className="w-6 h-6 ml-1 text-gray-700 dark:text-gray-200" />
          </span>
          <input
            type="text"
            name="address"
            id="address"
            ref={autocompleteRef}
            className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Escribe la dirección de la propiedad"
          />
        </div>
      </div>
      <div className="h-[400px]">
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={13}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            position={[coordinates.lat, coordinates.lng]}
            icon={icon}
          />
        </MapContainer>
      </div>
    </div>
  )
}
