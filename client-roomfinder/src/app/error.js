"use client";
import Link from "next/link";

export default function NotFound() {
    return (
        <section className="bg-white dark:bg-gray-900 h-[100vh]">
            <div className="py-8 mt-10 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">500</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Internal Server Error.</p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Estamos trabajando en una solución a este problema. </p>
                </div>
            </div>
        </section>
    );
}