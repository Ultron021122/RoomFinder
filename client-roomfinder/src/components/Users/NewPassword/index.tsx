'use client';

import axios from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { patterns } from '@/utils/constants';
import { toast, Bounce, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from "@nextui-org/react";

const NewPassword = () => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);

    // Errores
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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[100vh] lg:py-0">
                <Spinner />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col min-h-[100vh] justify-center items-center mx-auto">
            </div>
        </>
    );
};

export default NewPassword;