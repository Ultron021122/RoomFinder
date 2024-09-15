'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardActionArea, CardActions, CardContent, Rating, Typography } from "@mui/material";
import { Galeria } from "../Galeria";

interface Imagen {
    url: string,
    id: number
}

interface Inmueble {
    imagenes: Imagen[],
    tipo: string,
    dormitorios: number,
    baths: number,
    ocupantes: number,
    costo: number,
    descripcion: string
}

export default function CardElement({ inmueble }: { inmueble: Inmueble }) {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

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

    const listaImagenes = inmueble.imagenes.map((imagen, index) =>
        <div key={index} className="relative min-w-full h-full" >
            <Image
                src={imagen.url}
                alt={`Imagen de inmueble ${imagen.id}`}
                layout="fill"
                className="object-cover"
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
            }
            }
        >
            <Galeria imagenes={listaImagenes} />
            <CardActionArea>
                < CardContent>
                    <h5 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50" >
                        Tipo de propiedad {inmueble.tipo}
                    </h5>
                    < Typography component="legend" className='text-xs' > Calificación </Typography>
                    < Rating name="read-only" value={inmueble.costo} readOnly />
                    <p className="text-neutral-900 text-sm dark:text-neutral-300" >
                        {inmueble.descripcion}
                    </p>
                </CardContent>
                < CardActions
                    sx={{
                        display: 'flex',
                        justifyContent: 'left',
                        marginBottom: '.5rem'
                    }}
                >
                    {/*
                    <Button
                        color="primary"
                        variant="contained"
                        href={`/property/${inmueble.ocupantes}`}
                        //startIcon={< InfoIcon />}
                        sx={{ textTransform: 'none', fontSize: '1rem', margin: '0 .5rem', fontWeight: 'semibold' }}
                    >
                        Más información
                    </Button>
                    */}
                </CardActions>
            </CardActionArea>
        </Card>
    );
}
