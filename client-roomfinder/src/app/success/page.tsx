import Layout from '@/components/layout';
import { RouteButtonT } from '@/components/Propiedades/backButton';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

const Success: React.FC = () => {
    return (
        <Layout>
            <div className='h-[100vh] container mx-auto'>
                <RouteButtonT route='/' className="mt-10 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Regresar
                </RouteButtonT>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Pago Exitoso!</h1>
                    <p className="mt-4">Gracias por tu compra. Tu pago ha sido procesado exitosamente.</p>
                </div>
            </div>
        </Layout>
    );
};

export default Success;