'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { patterns } from '@/utils/constants';

export const RecoverComponent = ({ token }: { token: string }) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/users/verifyToken?token=${token}`);
                const data = await response.json();
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
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className='h-[calc(100vh-73px)] text-white'>
                <h1>Verifying...</h1>
                <p>Token: {token}</p>
            </div>
        </section>
    );
};

export default RecoverComponent;