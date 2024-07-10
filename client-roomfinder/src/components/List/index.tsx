'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import CardItem from '@/components/List/card';
import { Spinner } from '@nextui-org/react';
import { LessorInfo } from '@/utils/interfaces';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

interface LessorResponse {
    data: LessorInfo[];
}

export default function ListItems() {
    const [lessors, setLessors] = useState<LessorResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                setErrorSystem(null);
                const response = await axios.get<LessorResponse>('/api/users/lessor');
                setIsLoading(false);
                if (response.status === 200) {
                    setLessors(response.data);
                } else {
                    setErrorSystem('Error al cargar los arrendadores');
                }
            } catch (error) {
                setErrorSystem('Error al cargar los arrendadores');
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <>
            <PerfectScrollbar className='custom-scrollbar'>
                <div className='container mx-auto px-4 h-[100vh]'>
                    <h1 className="dark:text-white text-3xl font-bold py-10 text-center">
                        Arrendadores
                    </h1>
                    {isLoading ?
                        <div className='flex flex-col items-center justify-center h-[calc(100vh-40px)]'>
                            <Spinner />
                        </div>
                        :
                        (
                            lessors ? (
                                <div className='h-[950px] lg:w-4/6'>
                                    <PerfectScrollbar>
                                        <div className="grid grid-cols-1 gap-y-5 pr-1">
                                            {
                                                lessors.data.map((lessor, index) => (
                                                    <CardItem
                                                        key={index}
                                                        data={lessor}
                                                    />
                                                ))
                                            }
                                        </div>
                                    </PerfectScrollbar>
                                </div>
                            ) : (
                                <div className='flex flex-col items-center justify-center h-[calc(100vh-189px)]'>
                                    <p className="dark:text-white">
                                        No hay arrendadores
                                    </p>
                                    {errorSystem && (
                                        <p className="dark:text-white text-red-400">
                                            {errorSystem}
                                        </p>
                                    )}
                                </div>
                            )
                        )
                    }

                    <section className='mt-10'>
                        <p className='dark:text-gray-200'>
                            Más contenido próximamente
                        </p>
                    </section>
                </div>
            </PerfectScrollbar>
        </>
    );
}