'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import CardItem from "@/components/card";
import { Spinner } from '@nextui-org/react';

interface Lessor {
    id: number;
    name: string;
    last_name: string;
    email: string;
    image: string;
}

interface LessorResponse {
    data: Lessor[];
}

export default function Arrendadores() {
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
        <div className="container mx-auto px-4 min-h-screen">
            <h1 className="dark:text-white text-2xl font-bold mt-10">
                Arrendadores
            </h1>
            {isLoading ?
                <div className="flex justify-center items-center h-64">
                    <Spinner />
                </div>
                :
                (
                    lessors ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                            {
                                lessors.data.map((lessor) => (
                                    <CardItem
                                        key={lessor.id}
                                        id={lessor.id}
                                        name={lessor.name}
                                        last_name={lessor.last_name}
                                        email={lessor.email}
                                        url={lessor.image}
                                    />
                                ))
                            }
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-64">
                            <p className="dark:text-white">
                                No hay arrendadores
                            </p>
                        </div>
                    )
                )
            }
            {errorSystem && (
                <div className="flex justify-center items-center h-64">
                    <p className="dark:text-white text-red-400">
                        {errorSystem}
                    </p>
                </div>
            )}
        </div>
    );
}