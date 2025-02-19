import { Image } from "@nextui-org/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Banner = () => {
    return (
        <>
            <section className="bg-transparent dark:bg-gray-900">
                <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                    <div className="mr-auto place-self-center lg:col-span-7">
                        <h1
                            className="max-w-2xl mb-4 text-2xl font-bold tracking-tighter leading-none md:text-3xl xl:text-4xl dark:text-white"
                        >Encuentra tu próxima propiedad para rentar
                        </h1>
                        <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                            Explora una amplia selección de propiedades en alquiler y encuentra el hogar ideal para ti. Nuestro servicio simplifica la búsqueda y gestión de propiedades en renta.
                        </p>
                        <Link href='/properties' className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 dark:bg-blue-600 dark:hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-blue-900">
                            Explorar propiedades
                            <ArrowRight size={20} className="ml-2 -mr-1" />
                        </Link>
                        <a href="#" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                            Habla con ventas
                        </a>
                    </div>
                    <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                        <Image src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470&auto=format" alt="mockup" width={500} height={500} />
                    </div>
                </div>
            </section>
        </>
    );
}

export default Banner;
