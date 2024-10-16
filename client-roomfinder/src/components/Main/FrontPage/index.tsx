"use client";
import TypingAnimation from '@/components/ui/typing-animation';
import { images } from '@/utils/constants';
import { cn } from "@/lib/utils";
import GridPattern from '@/components/ui/grid-pattern';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

export default function FrontPage() {
    return (
        <>
            <div className="relative flex size-full items-center justify-center overflow-hidden rounded-lg bg-background dark:bg-gray-900 p-20">
                <div className="z-10 px-4 mx-auto max-w-screen-xl text-center lg:px-12">
                    <Link href={'/'} className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm rounded-full bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700" role="alert">
                        <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">Nuevo</span> <span className="text-xs md:text-sm font-medium">¡Nuevas habitaciones disponibles! Descúbrelo</span>
                        <ChevronRightIcon className="ml-2 w-5 h-5" />
                    </Link>
                    <TypingAnimation
                        className="mb-4 text-3xl font-semibold whitespace-pre-wrap tracking-tighter leading-none md:text-4xl lg:text-5xl text-black dark:text-white"
                        text="Encuentra tu habitación ideal"
                        duration={150}
                    />
                    <p className="mb-8 whitespace-pre-wrap text-lg font-light lg:text-xl sm:px-16 xl:px-40 text-gray-900 dark:text-gray-300">
                        RoomFinder está aquí para ayudarte a encontrar la habitación perfecta cerca de tu universidad. Explora nuestras opciones y haz tu elección hoy mismo.
                    </p>
                </div>
                <GridPattern
                    squares={[
                        [4, 4],
                        [5, 1],
                        [8, 2],
                        [5, 3],
                        [5, 5],
                        [10, 10],
                        [12, 15],
                        [15, 10],
                        [10, 15],
                        [15, 10],
                        [10, 15],
                        [15, 10],
                    ]}
                    className={cn(
                        "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
                        "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
                    )}
                />
            </div>
        </>
    );
}