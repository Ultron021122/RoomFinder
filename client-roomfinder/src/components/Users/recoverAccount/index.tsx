'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { patterns } from '@/utils/constants';
import Form from './form';

export const RecoverComponent = ({ token }: { token: string }) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/users/recover/${token}`);
                const data = await response.json();
                console.log('respuesta: ', data);
                setMessage(data.message);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                router.push('/404');
            }
        };

        if (patterns.uuidv4.test(token)) fetchData();
        else router.push('/404');

    }, [token, router]);

    if (isLoading) return <p>Cargando...</p>;

    return (
        <>
            <Form token={token} />
        </>
    );
};

export default RecoverComponent;