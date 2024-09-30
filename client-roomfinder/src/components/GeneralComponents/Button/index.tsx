export default function Button({contenido, onClick, className, disabled}:
    {
        contenido:string,
        onClick:any,
        className:string,
        disabled?:boolean
    }){
    return(
        <button
            onClick={onClick}
            className={className}
            disabled={disabled}
        >
            {contenido}
        </button>
    );
}