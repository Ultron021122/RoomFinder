"use client";
import Image from "next/image";
import CardElement from "@/components/GeneralComponents/CardElement";
import AppFloatingBox from "@/components/App/AppMap/AppSquare";
import dynamic from "next/dynamic";
import { useState } from "react";

const DynamicMap = dynamic(() => import("@/components/App/AppMap"), { ssr: false });

export default function AppInmuebles() {

    const [selectedUniversity, setSelectedUniversity] = useState<string>("");
    const [isBoxVisible, setIsBoxVisible] = useState(true);


    const handleClose = () => {
        setIsBoxVisible(false);
    };
    return (
        <>
            <section className="relative h-72">

                {isBoxVisible && (
                    <AppFloatingBox onClose={handleClose} onUniversityChange={setSelectedUniversity} />
                )}
                <div>
                    <DynamicMap
                        position={[20.65508, -103.325448]}
                        zoom={16}
                        name={selectedUniversity}
                    />
                </div>
            </section>
        </>
    );
}
