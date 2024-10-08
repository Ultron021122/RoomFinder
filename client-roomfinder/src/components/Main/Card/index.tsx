'use client';
// Element: CardOwner
import { useState, useEffect } from 'react';
import CardContent from '@mui/material/CardContent';
import { CardActionArea, CardActions, Rating, Card } from '@mui/material';
import Image from 'next/image';
import { Galeria } from '@/components/GeneralComponents/Galeria';
import { useRouter } from 'next/navigation';
import { MapPin, Star } from 'lucide-react';

interface Imagen {
    id: number,
    url: string
}

interface CardOwnerProps {
    id: number;
    title: string;
    description: string;
    value: number;
    imagenes: Imagen[];
}

export const CardOwner = ({ id, title, description, value, imagenes }: CardOwnerProps) => {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const route = useRouter();

    // Dark Mode 
    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const setDarkModeFromMediaQuery = () => setDarkMode(darkModeMediaQuery.matches);

        setDarkModeFromMediaQuery();
        darkModeMediaQuery.addEventListener('change', setDarkModeFromMediaQuery);

        setIsLoaded(true);

        return () => {
            darkModeMediaQuery.removeEventListener('change', setDarkModeFromMediaQuery);
        };
    }, []);

    if (!isLoaded) {
        return null;
    }

    const listaImagenes = imagenes.map((imagen, index) =>
        <div key={index} className="relative min-w-full h-full" >
            <Image
                width={800}
                height={600}
                src={imagen.url}
                alt={`Imagen de inmueble ${imagen.id}`}
                className='absolute inset-0 object-cover w-full h-full'
            />
        </div>
    );

    return (
        <Card
            sx={{
                maxWidth: '100%', // Hacer que la tarjeta sea responsiva
                backgroundColor: darkMode ? '#1f2937' : '#fff',
                color: darkMode ? '#fff' : '#111827',
                borderTopLeftRadius: '0.5rem',
                borderTopRightRadius: '0.5rem',
            }}
        >
            <Galeria imagenes={listaImagenes} />
            <CardActionArea onClick={() => route.push(`/property/${id}`)}>
                <CardContent>
                    <h5 className="mt-1 text-lg font-semibold text-white sm:text-slate-900 md:text-2xl dark:sm:text-white">
                        {title}
                    </h5>
                    <dl className="mt-4 text-xs font-medium flex items-center row-start-2 sm:mt-1 sm:row-start-3 md:mt-2.5 lg:row-start-2">
                        <dt className="sr-only">Reviews</dt>
                        <dd className="text-blue-600 flex items-center dark:text-blue-400">
                            <Star size={18} className="mr-1" />
                            <span>{value} <span className="text-slate-400 font-normal">(128)</span></span>
                        </dd>
                        <dt className="sr-only">Location</dt>
                        <dd className="flex items-center text-neutral-700 dark:text-neutral-200">
                            <svg width="2" height="2" aria-hidden="true" fill="currentColor" className="mx-3 text-slate-300">
                                <circle cx="1" cy="1" r="1" />
                            </svg>
                            <MapPin size={18} className="mr-1" />
                            Collingwood, Ontario
                        </dd>
                    </dl>
                    <p className={`mt-4 text-sm leading-6 col-start-1 sm:col-span-2 lg:row-start-4 lg:col-span-1 dark:text-slate-400`}>
                        {description}
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
                        $599.00 MXN
                    </span>
                </CardActions>
            </CardActionArea>
        </Card>
    );
}

export default CardOwner;