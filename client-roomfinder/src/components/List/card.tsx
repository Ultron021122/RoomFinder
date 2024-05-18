import { Button, Card, CardBody, Link as LinkUI } from "@nextui-org/react";
import { LessorInfo } from '@/utils/interfaces';

const CardItem = ({ data }: { data: LessorInfo; }) => {
    const { usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchimage, vchemail, vchphone } = data;

    return (
        <Card
            className="max-w-full bg-gray-100 dark:bg-gray-800 transition-background h-auto flex flex-col sm:flex-row gap-y-2 sm:gap-x-2"
            key={usuarioid}
            radius="none"
        >
            <div className="h-[250px] min-h-[250px] min-w-[300px] sm:h-[300px] bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${vchimage})` }}>
            </div>
            <CardBody>
                <h4 className="dark:text-gray-100 font-bold text-xl mt-10">{vchname + ' ' + vchpaternalsurname + ' ' + vchmaternalsurname}</h4>
                <hr className="w-full border-gray-300 dark:border-gray-700 my-2" />
                <p className="dark:text-gray-200 text-sm text-default-500">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Blanditiis, voluptatem officiis delectus eum et odit, commodi
                    praesentium ex hic officia quod, accusantium assumenda modi ratione!
                </p>
                <div className="my-2">
                    <div className="flex items-center pt-2 rounded-lg group">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                        <span className="dark:text-gray-200 text-sm text-default-500 ms-2">{vchemail}</span>
                    </div>
                    <div className="flex items-center pt-2 rounded-lg group">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                        <span className="dark:text-gray-200 text-sm text-default-500 ms-2">{vchphone}</span>
                    </div>
                </div>
                <div className="flex items-center justify-end space-x-2">
                    <Button isIconOnly color="success" variant="flat" aria-label="Message">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                        </svg>
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