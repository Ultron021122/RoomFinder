import { Image } from "@nextui-org/react";

interface UserProps {
    userData: {
        vchname: string;
        vchpaternalsurname: string;
        vchmaternalsurname: string;
        vchemail: string;
        vchphone: string;
        vchstreet: string;
        vchimage: string;
    };
}


export const ShowData = ({ userData }: UserProps) => {
    return (
        <div className="container mx-auto p-2">
            <div className="flex flex-col lg:flex-row items-center justify-center w-full my-5">
                <Image src={userData.vchimage} alt="Imagen de prueba" className="w-auto h-auto max-h-96 rounded-full" />
                <div className="grid grid-cols-1 gap-2 p-4 leading-normal items-center mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-3 dark:text-white">{userData.vchname + ' ' + userData.vchpaternalsurname}</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <ul className="max-w-md space-y-0.5 list-none list-inside">
                            <li className="font-semibold dark:text-gray-100">Tipo de usuario: <span className='font-normal dark:text-gray-400'>{userData.vchemail}</span></li>
                            <li className="font-semibold dark:text-gray-100">Fecha de nacimiento: <span className='font-normal dark:text-gray-400'>Apellido</span></li>
                            <li className="font-semibold dark:text-gray-100">Universidad: <span className='font-normal dark:text-gray-400'>Region</span></li>
                            <li className="font-semibold dark:text-gray-100">Correo Electronico: <span className='font-normal dark:text-gray-400'>Universidad</span></li>
                            <li className="font-semibold dark:text-gray-100">Fecha en que se unio: <span className='font-normal dark:text-gray-400'>Value not found</span></li>
                        </ul>
                        <ul className="max-w-md space-y-0.5 list-none list-inside">
                            <li className="font-semibold dark:text-gray-100">Top Level Domain: <span className='font-normal dark:text-gray-400'>Nivel de dominio</span></li>
                            <li className="font-semibold dark:text-gray-100">Currencies: <span className='font-normal dark:text-gray-400'>Monedas</span></li>
                            <li className="font-semibold dark:text-gray-100">Languages: <span className='font-normal dark:text-gray-400'>Caracteristicas</span></li>
                        </ul>
                    </div>
                    {/*
                    <div>
                        <p className="font-semibold dark:text-gray-100">Border Countries:</p>
                        {borderCountries.length > 0 ? (
                            <div className="flex flex-wrap gap-2 items-center">
                                {borderCountries.map((country, index) => (
                                    <p
                                        key={index}
                                        className="text-sm dark:text-gray-400 border dark:shadow-md dark:shadow-gray-900 border-gray-200 dark:border-gray-700 rounded-sm px-3 py-1.5 text-center inline-flex items-center"
                                    >
                                        {country}
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <p className="dark:text-gray-400">No bordering countries found.</p>
                        )}
                    </div>
                    */}
                </div>
            </div>
        </div>
    );
}

export default ShowData;