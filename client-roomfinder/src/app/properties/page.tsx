import Layout from "@/components/layout";
import React from 'react';
import { Button } from "@/components/ui/button";
import SectionProperty from "@/components/properties";

function PropertiesView() {
    return (
        <Layout>
            <Banner />
            <SectionProperty />
        </Layout>
    )
}

const Banner = () => {
    const backgroundImage = `url('/images/city.jpg')`;

    return (
        <section className="relative">
            <div className="bg-no-repeat bg-cover bg-center bg-blend-multiply bg-gray-500 p-4 h-[550px] pt-10"
                style={{ backgroundImage }}
            >
                <div className="lg:grid-cols-3 lg:gap-4 lg:grid">
                    <div className="md:col-span-2 px-4 mx-auto max-w-screen-2xlxl text-center py-36 md:py-40 lg:py-48">
                        <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-white lg:text-4xl">
                            Busca la Propiedad de tus Sueños
                        </h1>
                        <p className="mb-6 text-lg font-medium text-gray-500 lg:text-xl sm:px-6 xl:px-48 dark:text-gray-400">
                            Utiliza nuestro buscador avanzado para encontrar la propiedad perfecta para ti. Filtra por ubicación, precio, tipo de propiedad y más.
                        </p>

                        <div className="flex items-center justify-center gap-x-4">
                            <Button
                                className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Información
                            </Button>
                            <p
                                className="py-2.5 px-3.5 text-sm font-medium text-center rounded-lg border text-white border-gray-700 hover:bg-gray-700 focus:ring-gray-800"
                            >
                                Actividades <span aria-hidden="true">→</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


export default PropertiesView;