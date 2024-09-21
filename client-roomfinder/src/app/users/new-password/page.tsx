import React from "react";
import { Metadata } from 'next';
import NewPassword from "@/components/Users/NewPassword";

export const metadata: Metadata = {
    title: 'Recuperar contraseña',
};

export default function NewPasswordPage() {
    return (
        <>
            <NewPassword />
        </>
    );
}