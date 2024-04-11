'use client';
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";
import { useState } from "react";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false })

export default function Propiedades() {
    const [selectedUniversity, setSelectedUniversity] = useState<string>("");

    return (
        <>
            <Sidebar onUniversityChange={setSelectedUniversity} />
            <div className="sm:ml-56 md:ml-60 lg:ml-64">
                <DynamicMap position={[20.655080, -103.325448]} zoom={16} name={selectedUniversity} />
            </div>
        </>
    );
}