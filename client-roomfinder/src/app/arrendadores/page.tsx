'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import CardItem from "@/components/card";

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

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get<LessorResponse>('/api/users/lessor');
                console.log(data)
                setLessors(data);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    return (
        <div className="container mx-auto px-4 min-h-screen">
            <h1 className="dark:text-white text-2xl font-bold mt-10">
                Arrendadores
            </h1>
            <div className="grid grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {lessors?.data && lessors.data.map(lessor => (
                    <CardItem
                        key={lessor.id}
                        id={lessor.id}
                        name={lessor.name}
                        last_name={lessor.last_name}
                        email={lessor.email}
                        url={lessor.image}
                    />
                ))}
            </div>
        </div>
    );
}