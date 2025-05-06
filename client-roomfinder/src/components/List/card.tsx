import { Button, Card, CardBody, Link as LinkUI } from "@nextui-org/react";
import { LessorInfo } from "@/utils/interfaces";
import Image from "next/image";
import { Mail, MailIcon, MessageCircleMore, Smartphone } from "lucide-react";

const CardItem = ({ data }: { data: LessorInfo }) => {
    const { usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchimage, vchemail, vchphone, vchbiography } = data;

    return (
        <Card
            className="bg-gray-100 dark:bg-gray-800 transition-background flex flex-col items-center gap-y-4 p-6 shadow-md hover:shadow-lg hover:scale-105 transition-transform"
            key={usuarioid}
            radius="lg"
        >
            {/* Imagen circular con efecto hover */}
            <div className="relative">
                <Image
                    src={vchimage}
                    alt={`${vchname} ${vchpaternalsurname}`}
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-gray-200 dark:border-gray-700 shadow-md hover:scale-110 transition-transform"
                />
            </div>

            {/* Información del usuario */}
            <CardBody className="text-center">
                <h4 className="dark:text-gray-100 font-bold text-lg">
                    {`${vchname} ${vchpaternalsurname} ${vchmaternalsurname}`}
                </h4>
                <p className="dark:text-gray-200 text-sm text-default-500 mt-2">{vchbiography}</p>

                <hr className="w-full border-gray-300 dark:border-gray-700 my-4" />

                {/* Detalles de contacto */}
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                        <MailIcon className="h-5 w-5 dark:text-gray-200 text-default-500" />
                        <span className="dark:text-gray-200 text-sm text-default-500 ml-2">{vchemail}</span>
                    </div>
                    <div className="flex items-center">
                        <Smartphone className="h-5 w-5 dark:text-gray-200 text-default-500" />
                        <span className="dark:text-gray-200 text-sm text-default-500 ml-2">{vchphone}</span>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex items-center justify-center space-x-2 mt-4">
                    <Button as={LinkUI} href="/dashboard/messages" isIconOnly color="success" variant="flat" aria-label="Message">
                        <MessageCircleMore />
                    </Button>
                    <Button as={LinkUI} href="/" color="primary" variant="flat" size="md" className="font-normal">
                        Ver más
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

export default CardItem;