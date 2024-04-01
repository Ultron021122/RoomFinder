import { Card, CardBody, CardHeader, Divider, Image, Button, CardFooter } from "@nextui-org/react";

export const CardItem = ({
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
}): JSX.Element => {
    return (
            <Card className="max-w-full bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-background min-h-80" key={id}>
                <Image
                    alt="Imagen de perfil del arrendador"
                    className="object-cover"
                    src={`${url}`}
                />
                <CardBody className="mb-4 py-2 px-4 flex-col items-start">
                    <h4 className="dark:text-gray-200 font-bold text-large">{name + ' ' + last_name}</h4>
                    <p className="dark:text-gray-300 text-small uppercase font-bold">Contacto</p>
                    <small className="dark:text-gray-300 text-default-500">{email}</small>
                </CardBody>
            </Card>
    );
}

export const CardHeadOver = () => {
    return (
        <Card className="bg-gray-800 min-h-80">
            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">What to watch</p>
                <h4 className="text-white font-medium text-large">Stream the Acme event</h4>
            </CardHeader>
            <Image
                removeWrapper
                alt="Card background"
                className="z-0 w-full h-full object-cover"
                src="/prueba2.png"
            />
        </Card>
    );
}

export const CardBlurred = () => {
    return (
        <Card
            isFooterBlurred
            radius="lg"
            className="border-none bg-gray-800 min-h-80"
        >
            <Image
                alt="Woman listing to music"
                className="object-cover"
                src="/prueba2.png"
            />
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="text-tiny text-white/80">Available soon.</p>
                <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                    Notify me
                </Button>
            </CardFooter>
        </Card>
    );
}

export const ListItems = () => {
    return (
        <>
            <div className="grid grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <CardItem id={1} name="Sebastián" last_name="Martínez López" email="example@gmail.com" url="perfiles/perfil.png" />
                <CardItem id={2} name="Sebastián" last_name="Martínez López" email="example@gmail.com" url="perfiles/perfil2.png" />
                <CardItem id={3} name="Sebastián" last_name="Martínez López" email="example@gmail.com" url="perfiles/perfil3.png" />
                <CardItem id={4} name="Sebastián" last_name="Martínez López" email="example@gmail.com" url="perfiles/perfil.png" />
                <CardItem id={5} name="Sebastián" last_name="Martínez López" email="example@gmail.com" url="perfiles/perfil3.png" />
            </div>
        </>
    );
}