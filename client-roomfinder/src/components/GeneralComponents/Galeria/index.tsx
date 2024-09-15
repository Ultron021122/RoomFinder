'use client';

import { useState } from "react";
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Galeria({ imagenes }: { imagenes: JSX.Element[] }) {
    const [actual, setActual] = useState(0);

    const prev = () => setActual((actual) => (actual === 0 ? imagenes.length - 1 : actual - 1))
    const next = () => setActual((actual) => (actual === imagenes.length - 1 ? 0 : actual + 1))

    const indicadores = imagenes.map((imagen, index) =>
        <div key={index} className={clsx(
            "bg-white w-[8px] h-[8px] rounded-full transition-all",
            {
                "w-[12px] h-[12px] bg-opacity-80": actual === index,
            },
        )}>
        </div>
    );

    return (
        <div className="relative group overflow-hidden h-[260px] rounded-t-lg">
            <div className="flex h-full w-full transition-transform ease-out duration-500 transform bg-slate-400" style={{ transform: `translateX(-${actual * 100}%)` }}>
                {imagenes}
            </div>

            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={prev} className="p-1 rounded-full bg-white text-neutral-800 opacity-80 hover:opacity-100 transition-opacity duration-400">
                    <ChevronLeft size={25} />
                </button>
                <button onClick={next} className="p-1 rounded-full bg-white text-neutral-800 opacity-80 hover:opacity-100 transition-opacity duration-400">
                    <ChevronRight size={25} />
                </button>
            </div>

            {/* indicadores */}
            <div className="absolute right-0 left-0 bottom-3 opacity-0 group-hover:opacity-100 transition-all">
                <div className="flex items-center justify-center gap-2">
                    {indicadores}
                </div>
            </div>
        </div>
    );
}