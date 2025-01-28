import * as React from 'react';
import { Global } from '@emotion/react';
import { Box, Button, Typography, SwipeableDrawer, SelectChangeEvent, Rating } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import { FormControl, Select, InputLabel, MenuItem, FormHelperText } from '@mui/material';
import { universities } from "@/utils/constants";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { StarIcon } from 'lucide-react';

const drawerBleeding = 56;

interface FloatingBoxProps {
    onClose: () => void;
    onUniversityChange: (university: string) => void;
    onTypePropertyChange: (type_property: string) => void;
    onRatingChange: (rating: number) => void;
    open: boolean;
    toggleDrawer: (newOpen: boolean) => () => void;
}

const FloatingBox: React.FC<FloatingBoxProps> = ({ onClose, onUniversityChange, onTypePropertyChange, onRatingChange, open, toggleDrawer }) => {
    const [type_property, setTypeProperty] = React.useState<string>(() => {
        return localStorage.getItem('type_property') || "0";
    });
    const [university, setUniversity] = React.useState<string>(() => {
        return localStorage.getItem('university') || "";
    });
    const [rating, setRating] = React.useState<number | null>(() => {
        const storedRating = localStorage.getItem('rating');
        return storedRating ? parseFloat(storedRating) : 0;
    });

    const [darkMode, setDarkMode] = React.useState<boolean>(false);
    const [isLoaded, setIsLoaded] = React.useState<boolean>(false);

    const handleChangeUniversity = (event: SelectChangeEvent) => {
        const newValue = event.target.value;
        setUniversity(newValue);
        onUniversityChange(newValue);
        localStorage.setItem('university', newValue); // Guarda en localStorage
    };

    const handleChange = (event: SelectChangeEvent) => {
        const newValue = event.target.value;
        setTypeProperty(newValue);
        onTypePropertyChange(newValue);
        localStorage.setItem('type_property', newValue); // Guarda en localStorage
    };

    const handleRatingChange = (event: React.ChangeEvent<{}>, newValue: number | null) => {
        if (newValue !== null) {
            setRating(newValue);
            onRatingChange(newValue);
            localStorage.setItem('rating', newValue.toString()); // Guarda en localStorage
        }
    };

    React.useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const setDarkModeFromMediaQuery = () => setDarkMode(darkModeMediaQuery.matches);

        setDarkModeFromMediaQuery();
        darkModeMediaQuery.addEventListener('change', setDarkModeFromMediaQuery);

        setIsLoaded(true);

        return () => {
            darkModeMediaQuery.removeEventListener('change', setDarkModeFromMediaQuery);
        };
    }, [darkMode]);

    if (!isLoaded) {
        return null;
    }

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            swipeAreaWidth={0}
            ModalProps={{
                keepMounted: true,
            }}
            sx={{
                '& .MuiDrawer-paper': {
                    backgroundColor: 'rgba(0, 0, 0, 0.0)',
                    boxShadow: '0px -4px 4px rgba(0, 0, 0, 0.0)',
                },
            }}
        >
            <Box
                sx={{
                    backgroundColor: '#1f2937',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    boxShadow: 4,
                    px: 2,
                    pb: 2,
                    pt: 8,
                    width: { xs: '100%', md: '80%', lg: '60%' },
                    mx: 'auto',
                }}
            >
                <Box
                    sx={{
                        backgroundColor: blue,
                        borderRadius: 3,
                        position: 'absolute',
                        top: 8,
                        left: 'calc(50% - 15px)',
                    }}
                />
                <button onClick={onClose} className='absolute top-2 left-[calc(50vw-28px)] rounded-lg bg-gray-400 dark:bg-gray-600 h-2 w-14'>
                </button>
                <Typography className='text-base sm:text-lg font-medium text-white ml-2 mb-2'>Búsqueda de inmueble</Typography>
                <PerfectScrollbar>
                    <div className='w-full h-[25vh] p-2'>
                        <div className="flex flex-col">
                            <FormControl
                                variant="standard"
                                className="w-full"
                                sx={{
                                    '.MuiInput-underline:after': {
                                        borderBottomColor: '#3b82f6',
                                    },
                                    '.MuiInput-underline:before': {
                                        borderBottomColor: '#4b5563',
                                        borderBottomWidth: '2px',
                                    },
                                    '.MuiInput-underline:hover:not(.Mui-disabled):before': {
                                        borderBottomColor: '#4b5563',
                                    },
                                }}>
                                <InputLabel
                                    id="university"
                                    className="peer-focus:font-medium text-sm peer-focus:text-sm"
                                    sx={{
                                        color: '#d1d5db',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.25rem',
                                    }}>
                                    Universidad
                                </InputLabel>
                                <Select
                                    labelId="university"
                                    value={university}
                                    onChange={handleChangeUniversity}
                                    label="Universidad"
                                    className="text-sm"
                                    sx={{
                                        fontSize: '0.875rem',
                                        lineHeight: '1.25rem',
                                        fontStyle: 'normal',
                                        color: "white",
                                        '.MuiSvgIcon-root ': {
                                            fill: "white !important",
                                        }
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: "#374151",
                                                color: "#fff",
                                                height: 245,
                                                scrollbarWidth: 'thin',
                                            },
                                        },
                                    }}
                                >
                                    {universities.map((universidad, index) => (
                                        <MenuItem
                                            value={universidad.name}
                                            key={index}
                                            sx={{
                                                fontSize: '0.875rem',
                                                lineHeight: '1.25rem',
                                                '&.Mui-selected': { backgroundColor: '#1f2937' },
                                                '&.Mui-selected:hover': {
                                                    backgroundColor: '#111827',
                                                    color: '#3b82f6',
                                                },
                                                '&:hover': { backgroundColor: '#374151' },
                                            }}>
                                            {universidad.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText
                                    sx={{
                                        color: '#d1d5db',
                                    }}>
                                    Selecciona una universidad
                                </FormHelperText>
                            </FormControl>
                            <FormControl
                                variant="standard"
                                className="w-full mt-2"
                                sx={{
                                    '.MuiInput-underline:after': {
                                        borderBottomColor: '#3b82f6',
                                    },
                                    '.MuiInput-underline:before': {
                                        borderBottomColor: '#4b5563',
                                        borderBottomWidth: '2px',
                                    },
                                    '.MuiInput-underline:hover:not(.Mui-disabled):before': {
                                        borderBottomColor: '#4b5563',
                                    },
                                }}>
                                <InputLabel
                                    id="type_property"
                                    className="peer-focus:font-medium text-sm peer-focus:text-sm"
                                    sx={{
                                        color: '#d1d5db',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.25rem',
                                    }}>
                                    Tipo de inmueble
                                </InputLabel>
                                <Select
                                    labelId="type_property"
                                    value={type_property}
                                    onChange={handleChange}
                                    className="text-sm"
                                    sx={{
                                        fontSize: '0.875rem',
                                        lineHeight: '1.25rem',
                                        fontStyle: 'normal',
                                        color: "white",
                                        '.MuiSvgIcon-root ': {
                                            fill: "white !important",
                                        }
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: "#374151",
                                                color: "#fff",
                                                scrollbarWidth: 'thin',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem
                                        value="0"
                                        sx={{
                                            fontSize: '0.875rem',
                                            lineHeight: '1.25rem',
                                            '&.Mui-selected': { backgroundColor: '#1f2937' },
                                            '&.Mui-selected:hover': {
                                                backgroundColor: '#111827',
                                                color: '#3b82f6',
                                            },
                                            '&:hover': { backgroundColor: '#374151' },
                                        }}>
                                        Todos
                                    </MenuItem>
                                    <MenuItem
                                        value="3"
                                        sx={{
                                            fontSize: '0.875rem',
                                            lineHeight: '1.25rem',
                                            '&.Mui-selected': { backgroundColor: '#1f2937' },
                                            '&.Mui-selected:hover': {
                                                backgroundColor: '#111827',
                                                color: '#3b82f6',
                                            },
                                            '&:hover': { backgroundColor: '#374151' },
                                        }}>
                                        Departamento
                                    </MenuItem>
                                    <MenuItem
                                        value="1"
                                        sx={{
                                            fontSize: '0.875rem',
                                            lineHeight: '1.25rem',
                                            '&.Mui-selected': { backgroundColor: '#1f2937'},
                                            '&.Mui-selected:hover': {
                                                backgroundColor: '#111827',
                                                color: '#3b82f6',
                                            },
                                            '&:hover': { backgroundColor: '#374151' },
                                        }}>
                                        Casa
                                    </MenuItem>
                                    <MenuItem
                                        value="2"
                                        sx={{
                                            fontSize: '0.875rem',
                                            lineHeight: '1.25rem',
                                            '&.Mui-selected': { backgroundColor: '#1f2937' },
                                            '&.Mui-selected:hover': {
                                                backgroundColor: '#111827',
                                                color: '#3b82f6',
                                            },
                                            '&:hover': { backgroundColor: '#374151' },
                                        }}>
                                        Habitación
                                    </MenuItem>
                                </Select>
                                <FormHelperText
                                    sx={{
                                        color: '#d1d5db',
                                    }}>
                                    Selecciona un tipo de inmueble
                                </FormHelperText>
                            </FormControl>
                            <Typography
                                component="legend"
                                className="peer-focus:font-medium text-sm peer-focus:text-sm mt-2"
                                sx={{
                                    color: '#d1d5db',
                                    fontSize: '0.875rem',
                                    lineHeight: '1.25rem',
                                }}>Calificación</Typography>
                            <Rating
                                name="simple-controlled"
                                value={rating}
                                onChange={handleRatingChange}
                                precision={0.5}
                                sx={{
                                    color: '#3b82f6',
                                    '& .MuiRating-iconFilled': {
                                        color: '#fbbf24',
                                    },
                                    '& .MuiRating-iconHover': {
                                        color: '#fcd34d',
                                    },
                                    '& .MuiRating-iconEmpty': {
                                        color: grey[600],
                                    },
                                }}
                                emptyIcon={<StarIcon style={{ opacity: 1 }} fontSize="inherit" />}
                            />
                        </div>
                    </div>
                </PerfectScrollbar>
            </Box>
        </SwipeableDrawer>
    );
};

export default FloatingBox;