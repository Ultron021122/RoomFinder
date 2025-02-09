import Layout from "@/components/layout";
import { itemDataImage, propertiesHome } from "@/utils/constants";
import Banner from "./Banner";
import MainBanner from "./MainBanner";
import BlurFade from "@/components/ui/blur-fade";
import SectionProperty from "./properties";

export default function HomeComponent() {
    return (
        <Layout key={1}>
            <div className='h-[100vh] w-full'>
                <MainBanner />
                <section className="max-w-screen-2xl w-full mx-auto my-14 p-2 sm:p-0">
                    <div className="mb-10">
                        <div className="mb-16 max-w-7xl mx-auto">
                            <h3
                                className="mb-5 text-2xl font-bold tracking-tighter leading-none md:text-3xl xl:text-4xl dark:text-white"
                            >
                                Propiedades Destacadas
                            </h3>
                            <p className="mb-6 font-light text-gray-500 lg:mb-8 text-sm md:text-base lg:text-lg dark:text-gray-400">
                                Algunas de las propiedades más destacadas de Roomfinder.
                            </p>
                        </div>
                        <SectionProperty />
                    </div>
                    <Banner />
                    <div>
                        <h3 className="max-w-7xl mx-auto dark:text-gray-100 text-2xl md:text-3xl xl:text-4xl tracking-tighter font-bold leading-none my-10">
                            Galeria de Imagenes
                        </h3>
                        <BlurFadeDemo />
                    </div>
                </section>
            </div >
        </Layout >
    );
};

function BlurFadeDemo() {
  return (
    <section id="photos" className="max-w-6xl mx-auto">
      <div className="columns-2 gap-4 sm:columns-3">
        {itemDataImage.map((item, index) => (
          <BlurFade key={index} delay={0.25 + 1 * 0.05} inView>
            <img
              className="mb-4 size-full rounded-lg object-contain"
              src={item.img}
              alt={`Random stock image ${item.title}`}
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
