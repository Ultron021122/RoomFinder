'use client';

import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CardItem from '@/components/List/card';
import { Spinner } from '@nextui-org/react';
import { LessorInfo } from '@/utils/interfaces';
import 'react-perfect-scrollbar/dist/css/styles.css';

interface LessorResponse {
    data: LessorInfo[];
}

export default function ListItems() {
    const [lessors, setLessors] = useState<LessorInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);

    const fetchLessors = useCallback(async () => {
        try {
            setIsLoading(true);
            setErrorSystem(null);
            const response = await axios.get<LessorResponse>('/api/users/lessor', {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });
            if (response.status === 200) {
                setLessors(response.data.data);
            } else {
                setErrorSystem('Error al cargar los arrendadores');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorSystem(error.response?.data?.message || 'Error al cargar los arrendadores');
            } else {
                setErrorSystem('Error desconocido al cargar los arrendadores');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLessors();
    }, [fetchLessors]);

    const content = useMemo(() => {
        if (isLoading) {
            return <div className='flex justify-center'><Spinner /></div>
        }

        if (lessors.length > 0) {
            return (
                <div className='lg:w-5/6 mx-auto overflow-y-auto pb-5'>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pr-1">
                        {lessors.map((lessor, index) => (
                            <CardItem key={index} data={lessor} />
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className='flex flex-col items-center justify-center h-[calc(100vh-189px)]'>
                <p className="dark:text-white">No hay arrendadores</p>
                {errorSystem && (
                    <p className="dark:text-white text-red-500">{errorSystem}</p>
                )}
            </div>
        );
    }, [isLoading, lessors, errorSystem]);

    return (
        <div className='container mx-auto px-4 h-[100vh]'>
            <h1 className="dark:text-white text-3xl font-bold pt-28 text-center">
                Propietarios
            </h1>
            <div className='flex flex-col items-center justify-center mb-10'>
                <p className='dark:text-gray-200 text-center text-lg'>
                    Aquí puedes ver todos los propietarios registrados en la plataforma. Puedes ver sus propiedades y detalles de contacto.
                </p>
            </div>
            {content}
        </div>
    );
}