'use client'

import { useState, ChangeEvent } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Slider } from "@/components/ui/slider"
import 'leaflet/dist/leaflet.css'

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
    const [mapZoom, setMapZoom] = useState<number>(13)

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
                <Marker position={mapCenter} />
                <MapController center={mapCenter} zoom={mapZoom} />
            </MapContainer>

            <div className="absolute top-4 left-4 z-[1000]">
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button variant="outline">Configurar Mapa</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                                <DrawerTitle>Configuración del Mapa</DrawerTitle>
                                <DrawerDescription>Ajusta la posición y el zoom del mapa.</DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 pb-0">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="center">Centro del Mapa (lat, lng)</Label>
                                        <Input
                                            id="center"
                                            value={`${mapCenter[0]}, ${mapCenter[1]}`}
                                            onChange={handleCenterChange}
                                            placeholder="Ej: 40.416775, -3.703790"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zoom">Nivel de Zoom (3-18)</Label>
                                        <Slider
                                            id="zoom"
                                            min={3}
                                            max={18}
                                            step={1}
                                            value={[mapZoom]}
                                            onValueChange={handleZoomChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button variant="outline">Cerrar</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    )
}
