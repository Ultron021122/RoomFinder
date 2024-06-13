import React from "react";
import { Metadata } from 'next';
import Registrar from "@/components/Users/signup";

export const metadata: Metadata = {
    title: 'Registro de usuario',
};

export default function Signup() {
    return (
        <>
            <Registrar />
        </>
    );
};