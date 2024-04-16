import { Card, CardBody } from "@nextui-org/react";
import { LessorInfo } from '@/utils/interfaces';

interface Lessor extends LessorInfo {
    id: number;
}

const CardItem = ({ data }: { data: Lessor; }) => {
    const { id, name, last_name, image, email } = data;

    return (
        <Card
            className="max-w-full bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-background h-auto flex flex-col sm:flex-row gap-y-2 sm:gap-x-2"
            key={id}
            radius="none"
        >
            <div className="h-[250px] min-h-[250px] min-w-[300px] sm:h-[300px] bg-cover bg-no-repeat bg-center" style={{backgroundImage: `url(${image})`}}>
            </div>
            <CardBody className="flex-col items-start">
                <h4 className="dark:text-gray-200 font-bold text-large">{name + ' ' + last_name}</h4>
                <p className="dark:text-gray-300 text-small uppercase font-bold">Contacto</p>
                <small className="dark:text-gray-300 text-default-500">{email}</small>
            </CardBody>
        </Card>
    );
}

export default CardItem;