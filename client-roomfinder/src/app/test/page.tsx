import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Test',
};

export default function Arrendadores() {
    return (
        <div>
            <p>Test</p>
        </div>
    );
}


// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { useLoadScript } from '@react-google-maps/api'
// import { MapContainer, TileLayer, Marker } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
// import L from 'leaflet'
// import { Spinner } from '@nextui-org/react'
// import { InterfaceUbicacion } from '@/components/Form/FormularioContext'

// // Corrige el problema de los iconos de Leaflet en Next.js
// const icon = L.icon({
//   iconUrl: '/marker-icon.png',
//   iconRetinaUrl: '/marker-icon-2x.png',
//   shadowUrl: '/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   tooltipAnchor: [16, -28],
//   shadowSize: [41, 41]
// })

// const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places']

// interface Coordinates {
//   lat: number;
//   lng: number;
// }

// export default function MapaDireccion() {
//   const [address, setAddress] = useState<string>('')
//   const [coordinates, setCoordinates] = useState<Coordinates>({ lat: 19.4326, lng: -99.1332 }) // Ciudad de México por defecto
//   const [addressComponents, setAddressComponents] = useState<any>(null) // Para almacenar los componentes de la dirección
//   const autocompleteRef = useRef<HTMLInputElement | null>(null)
//   const mapRef = useRef<L.Map | null>(null)

//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
//     libraries: libraries,
//   })

//   useEffect(() => {
//     if (isLoaded && !loadError && autocompleteRef.current && typeof google !== 'undefined') {
//       const autocomplete = new google.maps.places.Autocomplete(autocompleteRef.current, {
//         types: ['address'],
//       })

//       autocomplete.addListener('place_changed', () => {
//         const place = autocomplete.getPlace()
//         if (place.geometry && place.geometry.location) {
//           setAddress(place.formatted_address || '')
//           setCoordinates({
//             lat: place.geometry.location.lat(),
//             lng: place.geometry.location.lng(),
//           })

//           // Extraer los componentes de la dirección
//           const components = place.address_components?.reduce((acc: any, component: google.maps.GeocoderAddressComponent) => {
//             const types = component.types
//             if (types.includes('street_number')) {
//               acc.streetNumber = component.long_name
//             } else if (types.includes('route')) {
//               acc.route = component.long_name
//             } else if (types.includes('locality')) {
//               acc.city = component.long_name
//             } else if (types.includes('administrative_area_level_1')) {
//               acc.state = component.long_name
//             } else if (types.includes('country')) {
//               acc.country = component.long_name
//             } else if (types.includes('postal_code')) {
//               acc.zipCode = component.long_name
//             }
//             return acc
//           }, {})

//           const ubicacion: InterfaceUbicacion = {
//             calle: components.route,
//             numInt: components.streetNumber,
//             pais: components.country,
//             direccion: place.formatted_address || '',
//             estado: components.state,
//             codigoPostal: components.zipCode,
//             ciudad_municipio: components.city,
//             latitud: place.geometry.location.lat(),
//             longitud: place.geometry.location.lng()
//           };

//           console.log(ubicacion)

//           setAddressComponents(ubicacion)
//         }
//       })
//     }
//   }, [isLoaded, loadError])

//   useEffect(() => {
//     if (mapRef.current) {
//       mapRef.current.setView([coordinates.lat, coordinates.lng], 13)
//     }
//   }, [coordinates])

//   if (loadError) return <div>Error al cargar los mapas</div>
//   if (!isLoaded) return <Spinner />

//   return (
//     <div className="space-y-4">
//       <div className="relative z-0 w-full mb-5 group">
//         <input
//           type="text"
//           name="address"
//           id="address"
//           ref={autocompleteRef}
//           className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//           placeholder=""
//         />
//         <label htmlFor="address" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
//           Dirección de la propiedad
//         </label>
//       </div>

//       {/* Mostrar los componentes de la dirección */}
//       {addressComponents && (
//         <div className="space-y-2">
//           <p><strong>Calle:</strong> {addressComponents.calle} {addressComponents.numInt}</p>
//           <p><strong>Ciudad:</strong> {addressComponents.ciudad_municipio}</p>
//           <p><strong>Estado:</strong> {addressComponents.estado}</p>
//           <p><strong>País:</strong> {addressComponents.pais}</p>
//           <p><strong>Código Postal:</strong> {addressComponents.codigoPostal}</p>
//         </div>
//       )}

//       <div className="h-[400px]">
//         <MapContainer
//           center={[coordinates.lat, coordinates.lng]}
//           zoom={13}
//           style={{ height: '100%', width: '100%' }}
//           ref={mapRef}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//           <Marker position={[coordinates.lat, coordinates.lng]} icon={icon} />
//         </MapContainer>
//       </div>
//     </div>
//   )
// }
