'use client';
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";

export default function Propiedades() {
    const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false })

    return (
        <>
            <Sidebar />
            <div className="sm:ml-64">
                <DynamicMap position={[20.655080, -103.325448]} zoom={16} />
            </div>
        </>
    );
}