'use client';
import Layout from "@/components/layout";
import Footer from '@/components/Footer';
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useNavbarStore from '@/global/useNavbarStore';

export default function Inicio() {
    const image = 'https://images.unsplash.com/photo-1713184359231-832519897def?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    const { status } = useSession();
    const navbarHeight = useNavbarStore((state) => state.navbarHeight);
    const setNavbarHeight = useNavbarStore((state) => state.setNavbarHeight);
    
    useEffect(() => {
        if (status === 'loading' || status === 'authenticated') {
            setNavbarHeight(73);
        } else {
            setNavbarHeight(65);
        }
    }, [status, setNavbarHeight]);

    return (
        <Layout key={1}>
            <div className={`h-[calc(100vh-${navbarHeight}px)] w-full`}>
                <main className="container mx-auto">
                    <div className="mb-5">
                        <h1 className="dark:text-white text-2xl font-bold">Proyecto Modular</h1>
                        <p className="dark:text-white">
                            Este proyecto fue creado con el objetivo de mostrar la modularización de una aplicación
                        </p>
                        <div className="h-[500px] min-h-[500px] min-w-[300px] max-w-[500px] sm:h-[100px] bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${image})` }}></div>
                    </div>
                </main>
                <Footer />
            </div >
        </Layout >
    );
};