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
    open: boolean;
    toggleDrawer: (newOpen: boolean) => () => void;
}

const FloatingBox: React.FC<FloatingBoxProps> = ({ onClose, onUniversityChange, onTypePropertyChange, open, toggleDrawer }) => {
    const [type_property, setTypeProperty] = React.useState<string>(() => {
        return localStorage.getItem('type_property') || "";
    });
    const [university, setUniversity] = React.useState<string>(() => {
        return localStorage.getItem('university') || "";
    });
    const [darkMode, setDarkMode] = React.useState<boolean>(false);
    const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
    const [rating, setRating] = React.useState<number | null>(2.5);

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

    React.useEffect(() => {
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
                    backgroundColor: 'rgba(0, 0, 0, 0.04)', // o 'transparent'
                },
            }}
        >
            <Box
                //bgcolor='#1f2937'
                sx={{
                    backgroundColor: darkMode === true ? '#1f2937' : '#e5e7eb',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    boxShadow: 4,
                    px: 2,
                    pb: 2,
                    pt: 8,
                    width: { xs: '100%', md: '80%', lg: '60%' }, // Ancho adaptativo
                    mx: 'auto', // Centrar el componente
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
                <Typography className='text-base sm:text-lg font-medium text-gray-900 dark:text-white ml-2 mb-2'>Búsqueda de inmueble</Typography>
                <PerfectScrollbar>
                    <div className='w-full h-[25vh] p-2'>
                        <div className="flex flex-col">
                            <FormControl
                                variant="standard"
                                className="w-full"
                                sx={{
                                    '.MuiInput-underline:after': {
                                        borderBottomColor: darkMode === true ? '#3b82f6' : '#2563eb',
                                    },
                                    '.MuiInput-underline:before': {
                                        borderBottomColor: darkMode === true ? '#4b5563' : '#d1d5db',
                                        borderBottomWidth: '2px',
                                    },
                                    '.MuiInput-underline:hover:not(.Mui-disabled):before': {
                                        borderBottomColor: darkMode === true ? '#4b5563' : '#d1d5db',
                                    },
                                }}>
                                <InputLabel
                                    id="university"
                                    className="peer-focus:font-medium text-sm peer-focus:text-sm"
                                    sx={{
                                        color: darkMode ? '#d1d5db' : '#6b7280',
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
                                        color: darkMode ? "white" : "#111827",
                                        '.MuiSvgIcon-root ': {
                                            fill: darkMode ? "white !important" : "#111827 !important",
                                        }
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                                                color: darkMode ? "#fff" : "#111827",
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
                                                '&.Mui-selected': { backgroundColor: darkMode ? '#1f2937' : "#9ca3af" }, // Style when selected
                                                '&.Mui-selected:hover': {
                                                    backgroundColor: darkMode ? '#111827' : "#6b7280",
                                                    color: darkMode ? '#3b82f6' : '#fff',
                                                }, // Style when selected and hovered
                                                '&:hover': { backgroundColor: darkMode ? '#374151' : "#d1d5db" }, // Style when hovered
                                            }}>
                                            {universidad.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText
                                    sx={{
                                        color: darkMode ? '#d1d5db' : '#4b5563',
                                    }}>
                                    Selecciona una universidad
                                </FormHelperText>
                            </FormControl>
                            <FormControl
                                variant="standard"
                                className="w-full mt-2"
                                sx={{
                                    '.MuiInput-underline:after': {
                                        borderBottomColor: darkMode === true ? '#3b82f6' : '#2563eb',
                                    },
                                    '.MuiInput-underline:before': {
                                        borderBottomColor: darkMode === true ? '#4b5563' : '#d1d5db',
                                        borderBottomWidth: '2px',
                                    },
                                    '.MuiInput-underline:hover:not(.Mui-disabled):before': {
                                        borderBottomColor: darkMode === true ? '#4b5563' : '#d1d5db',
                                    },
                                }}>
                                <InputLabel
                                    id="type_property"
                                    className="peer-focus:font-medium text-sm peer-focus:text-sm"
                                    sx={{
                                        color: darkMode ? '#d1d5db' : '#6b7280',
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
                                        color: darkMode ? "white" : "#111827",
                                        '.MuiSvgIcon-root ': {
                                            fill: darkMode ? "white !important" : "#111827 !important",
                                        }
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                                                color: darkMode ? "#fff" : "#111827",
                                                scrollbarWidth: 'thin',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem
                                        value="Apartamento"
                                        sx={{
                                            fontSize: '0.875rem',
                                            lineHeight: '1.25rem',
                                            '&.Mui-selected': { backgroundColor: darkMode ? '#1f2937' : "#9ca3af" }, // Style when selected
                                            '&.Mui-selected:hover': {
                                                backgroundColor: darkMode ? '#111827' : "#6b7280",
                                                color: darkMode ? '#3b82f6' : '#fff',
                                            }, // Style when selected and hovered
                                            '&:hover': { backgroundColor: darkMode ? '#374151' : "#d1d5db" }, // Style when hovered
                                        }}>
                                        Apartamento
                                    </MenuItem>
                                    <MenuItem
                                        value="Casa"
                                        sx={{
                                            fontSize: '0.875rem',
                                            lineHeight: '1.25rem',
                                            '&.Mui-selected': { backgroundColor: darkMode ? '#1f2937' : "#9ca3af" }, // Style when selected
                                            '&.Mui-selected:hover': {
                                                backgroundColor: darkMode ? '#111827' : "#6b7280",
                                                color: darkMode ? '#3b82f6' : '#fff',
                                            }, // Style when selected and hovered
                                            '&:hover': { backgroundColor: darkMode ? '#374151' : "#d1d5db" }, // Style when hovered
                                        }}>
                                        Casa
                                    </MenuItem>
                                    <MenuItem
                                        value="Habitación"
                                        sx={{
                                            fontSize: '0.875rem',
                                            lineHeight: '1.25rem',
                                            '&.Mui-selected': { backgroundColor: darkMode ? '#1f2937' : "#9ca3af" }, // Style when selected
                                            '&.Mui-selected:hover': {
                                                backgroundColor: darkMode ? '#111827' : "#6b7280",
                                                color: darkMode ? '#3b82f6' : '#fff',
                                            }, // Style when selected and hovered
                                            '&:hover': { backgroundColor: darkMode ? '#374151' : "#d1d5db" }, // Style when hovered
                                        }}>
                                        Habitación
                                    </MenuItem>
                                    <MenuItem
                                        value="Todas"
                                        sx={{
                                            fontSize: '0.875rem',
                                            lineHeight: '1.25rem',
                                            '&.Mui-selected': { backgroundColor: darkMode ? '#1f2937' : "#9ca3af" }, // Style when selected
                                            '&.Mui-selected:hover': {
                                                backgroundColor: darkMode ? '#111827' : "#6b7280",
                                                color: darkMode ? '#3b82f6' : '#fff',
                                            }, // Style when selected and hovered
                                            '&:hover': { backgroundColor: darkMode ? '#374151' : "#d1d5db" }, // Style when hovered
                                        }}>
                                        Todas
                                    </MenuItem>
                                </Select>
                                <FormHelperText
                                    sx={{
                                        color: darkMode ? '#d1d5db' : '#4b5563',
                                    }}>
                                    Selecciona un tipo de inmueble
                                </FormHelperText>
                            </FormControl>
                            <Typography
                                component="legend"
                                className="peer-focus:font-medium text-sm peer-focus:text-sm"
                                sx={{
                                    color: darkMode ? '#d1d5db' : '#6b7280',
                                    fontSize: '0.875rem',
                                    lineHeight: '1.25rem',
                                }}>Calificación</Typography>
                            <Rating
                                name="simple-controlled"
                                value={rating}
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                }}
                                precision={0.5}
                                sx={{
                                    color: darkMode ? '#3b82f6' : '#2563eb',
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
