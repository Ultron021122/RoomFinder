'use client';

import { ArrowLeft, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function BackButton({ className }: { className: string }) {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <div className={className}>
            <Button
                variant="link"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                onClick={handleBack}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Regresar
            </Button>
        </div>
    );
}

export function RouteButton({ className, children, route }: { className?: string, children: string, route?: string }) {
    const clases = className ? className : 'bg-blue-600 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg';

    const router = useRouter();

    const handleRoute = () => {
        router.push(`/${route}`);
    }

    return (
        <button
            type="button"
            onClick={() => { route ? handleRoute() : null }}
            className={clases}>
            {children}
        </button>
    );
}