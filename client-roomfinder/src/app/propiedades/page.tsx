'use client';

import dynamic from "next/dynamic";

export default function Propiedades() {
    const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false })

    return (
        <>
            <DynamicMap position={[20.655080, -103.325448]} zoom={16} />
        </>
    );
}