import Layout from "@/components/layout";
import Footer from '@/components/Footer';
import { images, propertiesHome } from "@/utils/constants";
import MasonryImageList from "@/components/Imagelist";
import { CardOwner } from "./Card";
import Banner from "./Banner";
import FrontPage from "./FrontPage";

export default function Inicio() {
    return (
        <Layout key={1}>
            <div className='h-[100vh] w-full'>
                <FrontPage />
                <section className="container mx-auto my-10 p-2 sm:p-0">
                    <div className="mb-5">
                        <div className="text-center mb-20">
                            <h3 className="dark:text-gray-100 text-3xl md:text-4xl xl:text-5xl tracking-tight font-bold leading-none mt-10">
                                Propiedades destacadas
                            </h3>
                            <p className="mt-2 mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                                Algunas de las propiedades más destacadas de Roomfinder.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {
                                propertiesHome.map((property, index) => (
                                    <CardOwner key={index} id={property.id} title={property.title} description={property.description} image={property.imageUrl} />
                                ))
                            }
                        </div>
                    </div>
                    <Banner />
                    <h3 className="dark:text-gray-300 text-3xl md:text-4xl xl:text-5xl font-bold mt-10 mb-5">
                        Galeria de Imagenes
                    </h3>
                    <MasonryImageList />
                </section>
                <Footer />
            </div >
        </Layout >
    );
};
