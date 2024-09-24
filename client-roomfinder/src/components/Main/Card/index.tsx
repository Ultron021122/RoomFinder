'use client';
// Element: CardOwner
import { useState, useEffect } from 'react';
import CardContent from '@mui/material/CardContent';
import { CardActionArea, CardActions, Rating, Card } from '@mui/material';
import Image from 'next/image';
import { Galeria } from '@/components/GeneralComponents/Galeria';
import { useRouter } from 'next/navigation';

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
                    <h5 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">
                        {title}
                    </h5>
                    <div className='flex items-center gap-2'>
                        <Rating name="read-only" value={value} precision={0.5} readOnly />
                        <p className="text-base font-semibold text-neutral-900 dark:text-neutral-300">{value}</p>
                    </div>
                    <p className="text-sm text-neutral-900 dark:text-neutral-300">
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
                        className="text-xl font-semibold text-gray-900 dark:text-white"
                    >
                        $599.00 MXN
                    </span>
                </CardActions>
            </CardActionArea>
        </Card>
    );
}

export default CardOwner;