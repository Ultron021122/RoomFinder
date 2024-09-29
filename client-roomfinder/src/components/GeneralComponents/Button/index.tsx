export default function Button({contenido, onClick, className}:
    {
        contenido:string,
        onClick:any,
        className:string
    }){
    return(
        <button
            onClick={onClick}
            className={className}
        >
            {contenido}
        </button>
    );
}