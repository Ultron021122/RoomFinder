import { Button, Image } from "@nextui-org/react";

interface CardOwnerProps {
    id: number;
    title: string;
    description: string;
    image: string;
}

export const CardOwner = ({ id, title, description, image }: CardOwnerProps) => {
    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg shadow-lg">
            <Image src={image} alt={title} className="w-full h-auto" />
            <div className="pt-2 ">
                <h4 className="dark:text-white text-lg font-semibold">{title}</h4>
                <p className="dark:text-gray-300">{description}</p>
                <Button color="primary" className="w-full mt-2">
                    Ver propiedad
                </Button>
            </div>
        </div>
    );
}   