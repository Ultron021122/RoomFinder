// components/FloatingBox.tsx
import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import Select from '@mui/material/Select';
import { FormControl, SelectChangeEvent, InputLabel, FormHelperText, MenuItem } from '@mui/material';
import { universities } from "@/utils/constants";

interface FloatingBoxProps {
    onClose: () => void;
    onUniversityChange: (university: string) => void;
}

const FloatingBox: React.FC<FloatingBoxProps> = ({ onClose, onUniversityChange }) => {
    const [type_property, setTypeProperty] = useState<string>("");
    const [university, setUniversity] = useState<string>("");
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

    const handleChangeUniversity = (event: SelectChangeEvent) => {
        setUniversity(event.target.value);
        onUniversityChange(event.target.value);
    };

    const handleChange = (event: SelectChangeEvent) => {
        setTypeProperty(event.target.value);
    }

    if (!isLoaded) {
        return null;
    }

    return (
        <div className="absolute top-8 left-4 bg-white dark:bg-gray-950 w-60 md:w-72 lg:w-96 rounded-lg shadow-lg shadow-gray-400 dark:shadow-gray-500 p-4 z-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Búsqueda de inmueble</h3>
                <button
                    type="button"
                    className="bg-white dark:bg-gray-950 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={onClose}
                >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            <div className="flex flex-col">
                <ul className='space-y-2 font-medium'>
                    <li>
                        <div className=''>
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
                                }}
                            >
                                <InputLabel
                                    id="university"
                                    className="peer-focus:font-medium text-sm peer-focus:text-sm"
                                    sx={{
                                        color: darkMode ? '#d1d5db' : '#6b7280',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.25rem',
                                    }}
                                >
                                    Universidad
                                </InputLabel>
                                <Select
                                    labelId="Universidad"
                                    id="university"
                                    value={university}
                                    onChange={handleChangeUniversity}
                                    label="Universidad"
                                    className="text-sm"
                                    sx={{
                                        fontFamily: '__Inter_aaf875',
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
                                                height: '200px',
                                            },
                                        },
                                    }}
                                >
                                    {
                                        universities.map((universidad, index) => (
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
                                                }}
                                            >
                                                {universidad.name}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                                <FormHelperText
                                    sx={{
                                        color: darkMode ? '#d1d5db' : '#4b5563',
                                    }}
                                >
                                    Selecciona una universidad
                                </FormHelperText>
                            </FormControl>
                        </div>
                    </li>
                    <li> {/* Type of property */}
                        <div className="">
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
                                }}
                            >
                                <InputLabel
                                    id="type_property"
                                    className="peer-focus:font-medium text-sm peer-focus:text-sm"
                                    sx={{
                                        color: darkMode ? '#d1d5db' : '#6b7280',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.25rem',
                                    }}
                                >
                                    Tipo de inmueble
                                </InputLabel>
                                <Select
                                    labelId="Tipo de inmueble"
                                    id="type_property"
                                    value={type_property}
                                    onChange={handleChange}
                                    label="Tipo de inmueble"
                                    className="text-sm"
                                    sx={{
                                        fontFamily: '__Inter_aaf875',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.25rem',
                                        fontStyle: 'normal',
                                        color: darkMode ? "white" : "#111827",
                                        '.MuiSvgIcon-root ': {
                                            fill: darkMode ? "white !important" : "#111827 !important",
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                                                color: darkMode ? "#fff" : "#111827",
                                                maxHeight: '200px',
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
                                        }}
                                    >
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
                                        }}
                                    >
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
                                        }}
                                    >
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
                                        }}
                                    >
                                        Todas
                                    </MenuItem>
                                </Select>
                                <FormHelperText
                                    sx={{
                                        color: darkMode ? '#d1d5db' : '#4b5563',
                                    }}
                                >
                                    Selecciona un tipo de inmueble
                                </FormHelperText>
                            </FormControl>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default FloatingBox;
