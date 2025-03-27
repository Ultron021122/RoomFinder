import Image from "next/image";

export default function Header() {
    return (
        <div className="relative isolate overflow-hidden bg-white dark:bg-gray-900 px-6 pt-8 sm:pt-10 lg:overflow-visible lg:px-0">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <svg
                    aria-hidden="true"
                    className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 dark:stroke-gray-900 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
                >
                    <defs>
                        <pattern
                            x="50%"
                            y={-1}
                            id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                            width={200}
                            height={200}
                            patternUnits="userSpaceOnUse"
                        >
                            <path d="M100 200V.5M.5 .5H200" fill="none" />
                        </pattern>
                    </defs>
                    <svg x="50%" y={-1} className="overflow-visible fill-gray-50 dark:fill-gray-900">
                        <path
                            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                            strokeWidth={0}
                        />
                    </svg>
                    <rect fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" width="100%" height="100%" strokeWidth={0} />
                </svg>
            </div>
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
                <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                    <div className="lg:pr-4">
                        <div className="lg:max-w-lg">
                            <p className="text-base font-semibold leading-7 text-blue-600">¡Disponibilidad rápida!</p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Encuentra tu nuevo hogar</h1>
                            <p className="mt-6 text-xl leading-8 text-gray-700 dark:text-gray-300">
                                Ofrecemos opciones accesibles y cómodas, adaptadas a tus necesidades como estudiante. ¡Tu nuevo espacio te espera!
                            </p>
                        </div>
                    </div>
                    <div className="lg:col-span-2 mt-14 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:pr-4">
                            <div className="max-w-xl text-base leading-7 text-gray-700 dark:text-gray-300 lg:max-w-lg">
                                <p>
                                    Nuestro compromiso es hacer que tu búsqueda de vivienda sea sencilla y eficiente. Disfruta de espacios diseñados para maximizar tu comodidad y productividad, con todo lo que necesitas cerca.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                    <Image
                        alt="Imagen de propiedad"
                        width={768}
                        height={432}
                        src="/images/search.svg"
                        className="w-[16rem] max-w-none rounded-xl md:w-[30rem]"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
