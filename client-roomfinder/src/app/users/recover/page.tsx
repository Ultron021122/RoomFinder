import React from "react";
import { Metadata } from 'next';
import Recover from "@/components/Users/recover";

export const metadata: Metadata = {
    title: 'Recuperar contraseña',
};

export default function RecoverPage() {
    return (
        <>
            <Recover />
        </>
    );
}