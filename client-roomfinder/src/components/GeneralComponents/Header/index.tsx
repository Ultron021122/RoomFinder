import Image from "next/image";

const Header = ({imageURL, content} : {imageURL : string, content:string}) => {
    return(
        <header className="relative h-72">
            <Image
                src={imageURL}
                alt="imagen de fondo"
                layout="fill"
                objectFit="cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 grid grid-cols-1 place-items-center">
                <h1 className="text-4xl text-white font-bold">{content}</h1>
            </div>
        </header>
    );
}

export default Header;