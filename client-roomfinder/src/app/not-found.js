import Link from "next/link";

export default function NotFound() {
    return (
        <section className="bg-white dark:bg-gray-900 h-[100vh]">
            <div className="flex flex-col items-center justify-center px-6 py-8 h-[100vh] lg:py-0 mx-auto max-w-screen-xl">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Alguna cosa fallo.</p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Lo sentimos, no pudimos encontrar esta pagina. Encontrara mucho por explorar en la pagina de inicio. </p>
                    <Link href="/" className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Regresar a pagina de inicio </Link>
                </div>
            </div>
        </section>
    );
}