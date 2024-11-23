import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bed, Bath, MapPin, Maximize } from 'lucide-react'

interface PropiedadProps {
    id: string
    titulo: string
    descripcion: string
    precio: number | null
    imagen: string
    ubicacion: string
    habitaciones: number
    banos: number
    superficie: number
    tipo: 'Apartamento' | 'Casa' | 'Estudio'
}

export default function TarjetaPropiedad({
    id,
    titulo,
    descripcion,
    precio,
    imagen,
    ubicacion,
    habitaciones,
    banos,
    superficie,
    tipo
}: PropiedadProps) {
    const formatPrecio = (precio: number | null) => {
        if (precio === null || precio === undefined) {
            return 'Precio no disponible'
        }
        return precio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
    }

    return (
        <Card className="w-full mx-auto max-w-sm overflow-hidden bg-gray-950">
            <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                    <Image
                        src="/background/interior1.jpg"
                        alt={titulo}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className='absolute inset-0 object-cover w-full h-full'
                    />
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                        {tipo}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <CardTitle className="text-xl font-bold mb-2">{titulo}</CardTitle>
                <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{ubicacion}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{descripcion}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{habitaciones} hab.</span>
                    </div>
                    <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{banos} baños</span>
                    </div>
                    <div className="flex items-center">
                        <Maximize className="h-4 w-4 mr-1" />
                        <span>{superficie} m²</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 bg-muted bg-gray-800">
                <div className="text-2xl font-bold">
                    {formatPrecio(precio)}
                    {precio !== null && precio !== undefined && <span className="text-sm font-normal">/mes</span>}
                </div>
                <Button variant="default">Ver detalles</Button>
            </CardFooter>
        </Card>
    )
}