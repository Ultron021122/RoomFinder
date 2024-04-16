'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import CardItem from '@/components/List/card';
import { Spinner } from '@nextui-org/react';
import { LessorInfo } from '@/utils/interfaces';

interface Lessor extends LessorInfo {
    id: number;
}

interface LessorResponse {
    data: Lessor[];
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
            {isLoading ?
                <div className='flex flex-col items-center justify-center h-[calc(100vh-90px)]'>
                    <Spinner />
                </div>
                :
                (
                    lessors ? (
                        <div className="grid grid-cols-1 gap-y-5 mt-4 lg:w-4/6">
                            {
                                lessors.data.map((lessor, index) => (
                                    <CardItem
                                        key={index}
                                        data={lessor}
                                    />
                                ))
                            }
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center h-[calc(100vh-109px)]'>
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
        </>
    );
}