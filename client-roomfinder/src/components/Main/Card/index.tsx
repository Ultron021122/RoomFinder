'use client';
// Element: CardOwner
import CardContent from '@mui/material/CardContent';
import { CardActionArea, CardActions, Rating, Card } from '@mui/material';
import Image from 'next/image';
import { Galeria } from '@/components/GeneralComponents/Galeria';
import { useRouter } from 'next/navigation';
import { MapPin, Star } from 'lucide-react';
import { Photos, Properties } from '@/utils/interfaces';

export const CardOwner = (cardProps: Properties) => {
    const route = useRouter();
    // Si objphotos es null o está vacío, usar 'No_image.png' como fallback
    const listaImagenes = (cardProps.objphotos && cardProps.objphotos.length > 0)
        ? cardProps.objphotos.map((imagen, index) => (
            <div key={index} className="relative min-w-full h-full">
                <Image
                    width={800}
                    height={600}
                    src={imagen?.url || "/No_image.png"} // <- Validación aquí
                    alt={`Imagen de inmueble ${imagen?.photoid || "No disponible"}`}
                    className="absolute inset-0 object-cover w-full h-full"
                />
            </div>
        ))
        : [
            <div key="fallback" className="relative min-w-full h-full">
                <Image
                    width={800}
                    height={600}
                    src="/No_image.png"
                    alt="Imagen no disponible"
                    className="absolute inset-0 object-cover w-full h-full"
                />
            </div>
        ];

    return (
        <Card
            component={'article'}
            className="max-w-full rounded-md shadow-md dark:shadow-lg bg-white dark:bg-gray-800 rounded-t-[0.5rem]"
        >
            <Galeria imagenes={listaImagenes} />
            <CardActionArea
                color='primary'
                onClick={() => route.push(`/property/${cardProps.propertyid}`)}
            >
                <CardContent>
                    <h5 className="mt-1 text-lg font-semibold dark:text-white text-slate-900 md:text-2xl dark:sm:text-white">
                        {cardProps.vchtitle}
                    </h5>
                    <dl className="mt-4 text-xs font-medium flex items-center row-start-2 sm:mt-1 sm:row-start-3 md:mt-2.5 lg:row-start-2">
                        <dt className="sr-only">Reviews</dt>
                        <dd className="text-blue-600 flex items-center dark:text-blue-400">
                            <Star size={18} className="mr-1" />
                            <p>{cardProps.decpropertyrating}</p>
                        </dd>
                        <dt className="sr-only">Location</dt>
                        <dd className="flex items-center text-gray-700 dark:text-gray-200">
                            <svg width="2" height="2" aria-hidden="true" fill="currentColor" className="mx-3 text-slate-300">
                                <circle cx="1" cy="1" r="1" />
                            </svg>
                            <MapPin size={18} className="mr-1" />
                            {cardProps.vchaddresscomplement}
                        </dd>
                    </dl>
                    <p
                        className="mt-4 text-sm leading-6 col-start-1 sm:col-span-2 lg:row-start-4 lg:col-span-1 dark:text-slate-400 line-clamp-none max-h-24 overflow-hidden relative"
                        style={{
                            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                        }}
                    >
                        {cardProps.vchdescription}
                    </p>
                </CardContent>
                <CardActions
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingX: '1rem',
                        marginBottom: '.5rem'
                    }}
                >
                    <span
                        className="text-base leading-6 col-start-1 sm:col-span-2 lg:row-start-4 lg:col-span-1 dark:text-slate-200"
                    >
                        ${cardProps.decrentalcost}
                    </span>
                </CardActions>
            </CardActionArea>
        </Card>
    );
}


export default CardOwner;
