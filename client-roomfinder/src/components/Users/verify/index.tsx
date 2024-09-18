'use client';

import axios from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { patterns } from '@/utils/constants';
import { toast, Bounce, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from "@nextui-org/react";

export const VerifyComponent = ({ usuarioid, token }: { usuarioid: number, token: string }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);
    const hasFetched = useRef(false); // Cambiado a useRef
    

    useEffect(() => {
        if (!patterns.uuidv4.test(token) || usuarioid <= 0) {
            setIsLoading(false);
            setErrorSystem('Verificación no válida');
            router.push('/');
            return; // Salir si la verificación no es válida
        }

        if (hasFetched.current) return; // Verifica si ya se ha hecho el fetch

        const fetchData = async () => {
            setIsLoading(true);

            try {
                const response = await axios.get(`/api/users/verify/${usuarioid}/${token}`);
                setIsLoading(false);
                console.log('Verificacion front:', response.data)
                if (response.status === 200) {
                    toast.success(response.data.message.message, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "colored",
                        transition: Slide,
                    });
                    router.push('/users/login');
                } else {
                    setErrorSystem(response.data.message.message);
                }
            } catch (Error: any) {
                setErrorSystem(Error.response?.data?.message?.message || 'Error inesperado');
                router.push('/users/login');
            } finally {
                setIsLoading(false);
            }
        };

        hasFetched.current = true; // Marca como ya realizado el fetch
        fetchData();
    }, [token, usuarioid, router]);

    useEffect(() => {
        if (errorSystem) {
            toast.error(errorSystem, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
    }, [errorSystem]);

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[100vh] lg:py-0">
            {isLoading ?
                <Spinner />
                :
                <h3>Cuenta Verificada</h3>
            }
        </div>
    );
};

export default VerifyComponent;
