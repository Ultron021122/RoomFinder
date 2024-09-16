import Layout from "@/components/layout";
import Footer from '@/components/Footer';
import { propertiesHome } from "@/utils/constants";
import MasonryImageList from "@/components/Imagelist";
import { CardOwner } from "./Card";
import Banner from "./Banner";
import FrontPage from "./FrontPage";

export default function HomeComponent() {
    return (
        <Layout key={1}>
            <div className='h-[100vh] w-full'>
                <FrontPage />
                <section className="max-w-screen-2xl mx-auto my-14 p-2 sm:p-0">
                    <div className="mb-10">
                        <div className="mb-16 max-w-7xl mx-auto">
                            <h3
                                className="mb-5 text-3xl font-bold tracking-tight leading-none md:text-4xl xl:text-5xl dark:text-white"
                            >Propiedades Destacadas
                            </h3>
                            <p className="mt-2 mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                                Algunas de las propiedades más destacadas de Roomfinder.
                            </p>
                        </div>
                        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {
                                propertiesHome.map((property, index) => (
                                    <CardOwner
                                        key={index}
                                        id={property.id}
                                        title={property.title}
                                        description={property.description}
                                        imagenes={property.imagenesUrl}
                                        value={property.value}
                                    />
                                ))
                            }
                        </div>
                    </div>
                    <Banner />
                    <div>
                        <h3 className="max-w-7xl mx-auto dark:text-gray-100 text-3xl md:text-4xl xl:text-5xl tracking-tight font-bold leading-none  my-10">
                            Galeria de Imagenes
                        </h3>
                        <MasonryImageList className="max-w-6xl mx-auto"/>
                    </div>
                </section>
                <Footer />
            </div >
        </Layout >
    );
};
