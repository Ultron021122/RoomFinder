'use client';

import { useFormulario } from './FormularioContext';
import { NUM_MIN_RESTRICCIONES } from './Wizar';
import { Button, Fab, IconButton } from '@mui/material';
import { Delete, DeleteIcon, Plus, Trash } from 'lucide-react';

export const Restriccion = ({ placeholder, value, index, handleDelete, handleInput }:
    {
        placeholder: string,
        value: string,
        index: number,
        handleDelete: (index: number) => void,
        handleInput: (index: number, value: string) => void
    }) => {

    function handleClick() {
        handleDelete(index);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        handleInput(index, e.target.value);
    }

    return (
        <div className="flex gap-4 my-2">
            <input
                className="text-gray-800 dark:text-gray-300 px-2 py-3 bg-transparent text-xs rounded-md w-full shadow-sm border border-gray-200 dark:border-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
            <IconButton
                onClick={handleClick}
                color="error"
                aria-label="delete"
            >
                <Delete />
            </IconButton>
        </div>
    );
}

export default function Restricciones() {
    const { inmueble, setInmueble } = useFormulario();

    function handleAdd() {
        const arregloActual = inmueble.reglas;
        const nvoArreglo = [...arregloActual, ''];
        setInmueble({ reglas: nvoArreglo })
    }

    function handleDelete(index: number) {
        const arregloActual = inmueble.reglas;
        const nvoArreglo = arregloActual.filter((element, i) => {
            return i !== index;
        });

        setInmueble({ reglas: nvoArreglo })
    }

    function handleInput(index: number, value: string) {
        const nvasReglas = [...inmueble.reglas];
        nvasReglas[index] = value;
        setInmueble({ reglas: nvasReglas });
    }

    return (
        <section>
            <div className='mb-12 text-center'>
                <h2 className="font-semibold text-base sm:text-xl md:text-2xl text-neutral-900 dark:text-gray-100">
                    Restricciones del inmueble
                </h2>
                <p className="text-sm mb-8 text-neutral-800 dark:text-gray-400">
                    Establecer restricciones permite que los alumnos conozcan qué es lo que no está permitido hacer en el inmueble
                </p>
            </div>
            <div className="w-full px-5"> { /* contenedor de restricciones */}
                {
                    inmueble.reglas.map((regla, index) => {
                        return (
                            <Restriccion
                                key={index}
                                placeholder="Ingrese descripción de la restricción"
                                value={regla}
                                handleDelete={handleDelete}
                                handleInput={handleInput}
                                index={index}
                            />
                        )
                    }
                    )
                }
                {
                    // mostrar mensaje en caso de que no haya reglas registradas
                    inmueble.reglas.length < NUM_MIN_RESTRICCIONES && (
                        <p className="text-red-500 text-sm text-center my-3">
                            Es indispensable que agregues como mínimo {NUM_MIN_RESTRICCIONES} restricciones
                        </p>
                    )
                }

            </div>
            <div className="w-full mx-auto grid place-items-center mb-4">
                <Fab
                    onClick={handleAdd}
                    color="primary"
                    aria-label="add"
                >
                    <Plus />
                </Fab>
            </div>
        </section>
    );
}