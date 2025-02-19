import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bed, Bath, MapPin, Maximize } from 'lucide-react'
import { Properties } from '@/utils/interfaces'
import Galeria from '@/components/carrousel'

interface TarjetaPropiedadProps {
    data: Properties
    handleViewProperty: (id:number) => void
}

export default function TarjetaPropiedad({data, handleViewProperty}: TarjetaPropiedadProps) {
    const formatPrecio = (precio: number | null) => {
        if (precio === null || precio === undefined) {
            return 'Precio no disponible'
        }
        return precio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
    }

    const imagenes = data.objphotos.map(photo => <Image
        key={photo.photoid}
        src={photo.url}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        fill
        className='object-cover w-full h-full'
        alt={`imagen de propiedad ${photo.photoid}`}
    />)

    return (
        <Card className="w-full mx-auto max-w-sm overflow-hidden bg-gray-950">
            <CardHeader className="p-0 h-48 w-full">
            <Galeria imagenes={imagenes}/>
                {/*<div className="h-48 w-full">
                    {/*<Image
                        src="/background/interior1.jpg"
                        alt={titulo}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className='absolute inset-0 object-cover w-full h-full'
                    />}
                    {/*<Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                        {data.vchtypename}
                    </Badge>}
                </div>*/}
            </CardHeader>
            <CardContent className="p-4">
                <CardTitle className="text-xl font-bold mb-2">{data.vchtitle}</CardTitle>
                <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{`${data.vchstreet}, ${data.vchmunicipality}`}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{data.vchdescription}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{data.intnumberrooms} hab.</span>
                    </div>
                    <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{data.intnumberbathrooms} baños</span>
                    </div>
                    <div className="flex items-center">
                        <Maximize className="h-4 w-4 mr-1" />
                        <span>{data.intnumberbeds} camas</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 bg-muted bg-gray-800">
                <div className="text-2xl font-bold">
                    {formatPrecio(parseFloat(data.decrentalcost))}
                    {data.decrentalcost !== null && data.decrentalcost !== undefined && <span className="text-sm font-normal">/mes</span>}
                </div>
                <Button onClick={() => handleViewProperty(data.propertyid)} variant="default">Ver propiedad</Button>
            </CardFooter>
        </Card>
    )
}