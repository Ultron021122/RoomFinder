'use client';

import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton({ className }: { className: string }) {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <div className={className}>
            <button
                type="button"
                onClick={handleBack}
                className="text-sm leading-6 font-medium rounded-lg text-black bg-white border dark:shadow-md dark:shadow-gray-900 border-gray-200 dark:border-gray-700 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-700 me-2 mb-2"
            >
                <Undo2 size={20} className="mr-1" />
                Regresar
            </button>
        </div>
    );
}

export function CheckDisponibilityButton({ className, children, route }: { className?: string, children: string, route?: string }) {
    const clases = className ? className : 'bg-blue-600 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg';

    const router = useRouter();

    const handleRoute = () => {
        router.push(`/${route}`);
    }

    return (
        <button
            type="button"
            onClick={() => {route ? handleRoute() : null}}
            className={clases}>
            {children}
        </button>
    );
}