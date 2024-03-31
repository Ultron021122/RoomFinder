'use client';

import { CardItem, ListItems } from "@/components/card";

export default function Arrendadores() {
    return (
        <>
            <div className="container mx-auto px-4 min-h-screen">
                <h1 className="dark:text-white text-2xl font-bold mt-10">
                    Arrendadores
                </h1>
                <ListItems />
            </div>
        </>
    );
}