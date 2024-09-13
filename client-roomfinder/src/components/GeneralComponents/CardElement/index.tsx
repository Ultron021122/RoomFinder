'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, InfoIcon } from "lucide-react";
import clsx from 'clsx';
import { Button, Card, CardActionArea, CardActions, CardContent, Rating, Typography } from "@mui/material";

interface Imagen {
    url: string,
    id: number
}

interface Inmueble {
    imagenes: Imagen[],
    tipo: string,
    dormitorios: number,
    banos: number,
    ocupantes: number,
    costo: number,
    descripcion: string
}

function Galeria({ imagenes }: { imagenes: JSX.Element[] }) {
    const [actual, setActual] = useState(0);

    const prev = () => setActual((actual) => (actual === 0 ? imagenes.length - 1 : actual - 1))
    const next = () => setActual((actual) => (actual === imagenes.length - 1 ? 0 : actual + 1))

    const indicadores = imagenes.map((imagen, index) =>
        <div key={index} className={clsx(
            "bg-white w-[8px] h-[8px] rounded-full transition-all",
            {
                "w-[12px] h-[12px] bg-opacity-80": actual === index,
            },
        )}>
        </div>
    );

    return (
        <div className="relative group overflow-hidden h-[260px] rounded-t-xl">
            <div className="flex h-full w-full transition-transform ease-out duration-500 transform bg-slate-400" style={{ transform: `translateX(-${actual * 100}%)` }}>
                {imagenes}
            </div>

            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={prev} className="p-1 rounded-full bg-white text-neutral-800 opacity-80 hover:opacity-100 transition-opacity duration-400">
                    <ChevronLeft size={25} />
                </button>
                <button onClick={next} className="p-1 rounded-full bg-white text-neutral-800 opacity-80 hover:opacity-100 transition-opacity duration-400">
                    <ChevronRight size={25} />
                </button>
            </div>

            {/* indicadores */}
            <div className="absolute right-0 left-0 bottom-3 opacity-0 group-hover:opacity-100 transition-all">
                <div className="flex items-center justify-center gap-2">
                    {indicadores}
                </div>
            </div>
        </div>
    );
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
                objectFit="cover"
            />
        </div>
    );

    return (
        <Card
            sx={{
                maxWidth: '100%', // Hacer que la tarjeta sea responsiva
                backgroundColor: darkMode ? '#1f2937' : '#fff',
                color: darkMode ? '#fff' : '#111827',
                height: 'auto',
            }
            }
        >
            <CardActionArea>
                <Galeria imagenes={listaImagenes} />
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
                    <Button
                        color="primary"
                        variant="contained"
                        href={`/property/${inmueble.ocupantes}`}
                        //startIcon={< InfoIcon />}
                        sx={{ textTransform: 'none', fontSize: '1rem', margin: '0 .5rem', fontWeight: 'semibold' }}
                    >
                        Más información
                    </Button>
                </CardActions>
            </CardActionArea>
        </Card>
    );
}
