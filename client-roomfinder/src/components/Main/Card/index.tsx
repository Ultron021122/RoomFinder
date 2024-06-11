'use client';
// Element: CardOwner
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

interface CardOwnerProps {
    id: number;
    title: string;
    description: string;
    image: string;
}

export const CardOwner = ({ id, title, description, image }: CardOwnerProps) => {
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
                backgroundColor: darkMode ? '#111827' : '#fff',
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
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#d1d5db' : '#111827' }}>
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions
                sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Button
                    color="primary"
                    variant='outlined'
                    href={`/owner/${id}`}
                    sx={{ width: '100%' }}
                >
                    Ver más
                </Button>
            </CardActions>
        </Card>
    );
}
