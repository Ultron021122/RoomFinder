'use client';

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Search, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { HomeIcon } from '@radix-ui/react-icons';
import Svg404 from '@/components/svg/404';

const NotFound = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-lg w-full space-y-8 text-center">
            <div className="space-y-4">
              <div className="relative w-64 h-64 mx-auto">
                <Svg404 className="h-auto w-auto text-gray-900 dark:text-gray-300" />
              </div>
              {/* <h1 className="text-6xl font-extrabold text-gray-900 dark:text-gray-100">404</h1> */}
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Página no encontrada</h2>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Lo sentimos, la página que estás buscando no existe o ha sido movida.
              </p>
            </div>
            
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
              <Button asChild className="flex items-center justify-center">
                <Link href="/">
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Volver al inicio
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex items-center justify-center dark:bg-gray-950">
                <Link href="/properties">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar propiedades
                </Link>
              </Button>
            </div>
    
            <div className="pt-8">
              <Button
                variant="link"
                className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-100"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a la página anterior
              </Button>
            </div>
    
            <div className="pt-8 text-sm text-gray-500">
              <p>
                Si crees que esto es un error, por favor{' '}
                <Link href="/contacto" className="text-blue-600 hover:underline">
                  contáctanos
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      )
}

export default NotFound;
