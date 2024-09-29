export default function Input({type, nombre, value, placeholder, disabled, handleInput} : 
    {
        type:string,
        nombre:string,
        value?:string | number,
        placeholder?:string,
        disabled:boolean,
        handleInput?: (name:string, value: number | string) => void
    }){

    function handleChange(e : React.ChangeEvent<HTMLInputElement>){
        if(handleInput){ // comprobar si la función está definida
            handleInput(nombre, e.target.value)
        }
    }

    return(
        <div>
            <h3>{nombre}</h3>
            <input
                className="border border-gray-300 rounded-md p-2 block w-full"
                type={type}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={handleChange}
            />
        </div>
    );
}