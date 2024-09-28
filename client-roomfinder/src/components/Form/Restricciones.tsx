'use client';

import { useFormulario } from './FormularioContext';
import Button from '../GeneralComponents/Button';
import { NUM_MIN_RESTRICCIONES } from './Wizar';

export const Restriccion = ({placeholder, value, index, handleDelete, handleInput} : 
    {
        placeholder:string,
        value:string,
        index:number,
        handleDelete:(index : number) => void,
        handleInput:(index : number, value : string) => void
    }) => {

        function handleClick(){
            handleDelete(index);
        }

        function handleChange(e : React.ChangeEvent<HTMLInputElement>){
            handleInput(index, e.target.value);
        }

    return(
        <div className="flex gap-4 mb-8">
            <input
                className="block w-full p-2 rounded-md border border-gray-300"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
            <Button
                contenido="Eliminar"
                onClick={handleClick}
                className="bg-[#007aff] p-2 rounded-md text-white font-semibold hover:bg-opacity-90"
            />
        </div>
    );
}

export default function Restricciones() {
    const {inmueble, setInmueble} = useFormulario();

    function handleAdd(){
        const arregloActual = inmueble.reglas;
        const nvoArreglo = [...arregloActual, ''];
        setInmueble({reglas : nvoArreglo})
    }

    function handleDelete(index : number){
        const arregloActual = inmueble.reglas;
        const nvoArreglo = arregloActual.filter((element, i) => {
            return i !== index;
        });

        setInmueble({reglas : nvoArreglo})
    }

    function handleInput(index:number, value : string){
        const nvasReglas = [...inmueble.reglas];
        nvasReglas[index] = value;
        setInmueble({reglas : nvasReglas});
    }

    return(
        <div>
            <h2 className="text-center font-semibold text-3xl mb-10">Restricciones del inmueble</h2>
            <p className="text-gray-600 mb-4 text-center text-xl">Establecer restricciones permite que los alumnos conozcan qué es lo que no está permitido hacer en el inmueble</p>
            <div className="w-[85%] mx-auto"> { /* contenedor de restricciones */ }
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
                        <p className="text-lg text-center mb-4">Es indispensable que agregues como mínimo {NUM_MIN_RESTRICCIONES} restricciones</p>
                    )
                }
                
            </div>
            <div className="w-[85%] mx-auto grid place-items-center mb-4">
                <Button
                    contenido="+"
                    onClick={handleAdd}
                    className="w-11 h-11 rounded-full bg-[#007aff] text-white font-bold"
                />
            </div>
        </div>
    );
}