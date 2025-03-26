import { Button, Card, CardBody, Link as LinkUI } from "@nextui-org/react";
import { LessorInfo } from '@/utils/interfaces';
import Image from "next/image";
import { Mail, MailIcon, MessageCircleMore, Smartphone } from "lucide-react";

const CardItem = ({ data }: { data: LessorInfo; }) => {
    const { usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchimage, vchemail, vchphone, vchbiography } = data;

    return (
        <Card
            className="max-w-full bg-gray-100 dark:bg-gray-800 transition-background h-auto flex flex-col sm:flex-row gap-y-2 sm:gap-x-2"
            key={usuarioid}
            radius="none"
        >
            {/*
            <div className="h-[250px] min-h-[250px] min-w-[300px] sm:h-[300px] bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${vchimage})` }}>
            </div>
            */}
            <Image
                src={vchimage}
                alt="Picture of the author"
                width={600}
                height={600}
                className="object-cover h-[250px] min-h-[250px] min-w-[300px] sm:h-[300px]"
            />
            <CardBody>
                <h4 className="dark:text-gray-100 font-bold text-xl mt-10">{vchname + ' ' + vchpaternalsurname + ' ' + vchmaternalsurname}</h4>
                <hr className="w-full border-gray-300 dark:border-gray-700 my-2" />
                <p className="dark:text-gray-200 text-sm text-default-500">
                    {vchbiography}
                </p>
                <div className="my-2">
                    <div className="flex items-center pt-2 rounded-lg group">
                        <MailIcon className="dark:text-gray-200 text-default-500" />
                        <span className="dark:text-gray-200 text-sm text-default-500 ms-2">{vchemail}</span>
                    </div>
                    <div className="flex items-center pt-2 rounded-lg group">
                        <Smartphone className="dark:text-gray-200 text-default-500" />
                        <span className="dark:text-gray-200 text-sm text-default-500 ms-2">{vchphone}</span>
                    </div>
                </div>
                <div className="flex items-center justify-end space-x-2">
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
}

export default CardItem;