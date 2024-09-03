import Image from "next/image";

export default function Icon({src, cantidad}: {src:string, cantidad:number}){
    return(
        <div className="flex gap-2 items-center">
            <Image
                src={src}
                alt="imagen icono"
                width={50}
                height={50}
                layout="responsive"
            />
            <p>{cantidad}</p>
        </div>
    );
}