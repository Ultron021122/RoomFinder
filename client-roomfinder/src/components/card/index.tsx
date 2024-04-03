import { Card, CardBody, CardHeader, Divider, Image, Button, CardFooter } from "@nextui-org/react";

const CardItem = ({
    id,
    name,
    last_name,
    email,
    url
}: {
    id: number,
    name: string,
    last_name: string,
    email: string,
    url: string;
}) => {
    return (
        <Card
            className="max-w-[600px] bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-background min-h-80"
            key={id}
        >
            <Image
                alt="Imagen de perfil del arrendador"
                className="object-cover w-full h-full"
                src={`${url}`}
                property="image"
                loading="lazy"
            />
            <CardBody className="mb-4 py-2 px-4 flex-col items-start">
                <h4 className="dark:text-gray-200 font-bold text-large">{name + ' ' + last_name}</h4>
                <p className="dark:text-gray-300 text-small uppercase font-bold">Contacto</p>
                <small className="dark:text-gray-300 text-default-500">{email}</small>
            </CardBody>
        </Card>
    );
}

export default CardItem;