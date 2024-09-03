'use client';
// Element: CardOwner
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Rating } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface CardOwnerProps {
    id: number;
    title: string;
    description: string;
    value: number;
    image: string;
}

export const CardOwner = ({ id, title, description, value, image }: CardOwnerProps) => {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

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

    return (
        <Card
            sx={{
                maxWidth: '100%', // Hacer que la tarjeta sea responsiva
                backgroundColor: darkMode ? '#1f2937' : '#fff',
                color: darkMode ? '#fff' : '#111827'
            }}
        >
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="275"
                    image={image}
                    alt={title}
                    sx={{ width: '100%', height: 275, objectFit: 'cover', objectPosition: 'center' }} // Ajustar la imagen al ancho de la tarjeta
                />
                <CardContent>
                    <h5 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">
                        {title}
                    </h5>
                    <Typography component="legend" className='text-xs'>Calificación</Typography>
                    <Rating name="read-only" value={value} readOnly />
                    <p className="text-neutral-900 dark:text-neutral-300">
                        {description}
                    </p>
                </CardContent>
                <CardActions
                    sx={{
                        display: 'flex',
                        justifyContent: 'left',
                        marginBottom: '.5rem'
                    }}
                >
                    <Button
                        color="primary"
                        variant="contained"
                        href={`/property/${id}`}
                        startIcon={<InfoIcon />}
                        sx={{ textTransform: 'none', fontSize: '1rem', margin: '0 .5rem' }}
                    >
                        Más información
                    </Button>
                </CardActions>
            </CardActionArea>
        </Card>
    );
}
