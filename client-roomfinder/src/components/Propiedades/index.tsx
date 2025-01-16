'use client';
import { Properties } from '@/utils/interfaces';
import Image from "next/image";
import { RouteButton } from "./backButton";
import { MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PropertyComponent({ id }: { id: string }) {
    const [property, setProperty] = useState<Properties>();

    useEffect(() => {
        // Fetch data from API
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`/api/properties/${id}`);
                setProperty(response.data.data);
                console.log(response.data.data);
            } catch (Error: any) {
                console.error(Error);
            } finally {
                // Do something
            }
        };
        fetchProperty();
    }, []);

    return (
        <main className="py-6 px-4 sm:p-6 md:py-10 md:px-8">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:max-w-5xl lg:gap-x-20 lg:grid-cols-2">
                <div className="relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black/75 via-black/0 sm:bg-none sm:row-start-2 sm:p-0 lg:row-start-1">
                    <h1 className="mt-1 text-lg font-semibold text-white sm:text-slate-900 md:text-2xl dark:sm:text-white">{property?.vchtitle}</h1>
                    <p className="text-sm leading-4 font-medium text-white sm:text-slate-500 dark:sm:text-slate-400">Propiedad</p>
                </div>
                <div className="grid gap-4 col-start-1 col-end-3 row-start-1 sm:mb-6 sm:grid-cols-4 lg:gap-6 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
                    <Image
                        width={800}
                        height={800}
                        src={property?.objphotos[0].url || 'https://tailwindcss.com/_next/static/media/beach-house-interior-2.3672af98.jpg'}
                        alt={`Imagen ${property?.objphotos[0].photoid}`}
                        className="w-full h-60 object-cover rounded-lg sm:h-52 sm:col-span-2 lg:col-span-full"
                    />
                    <Image
                        width={800}
                        height={800}
                        src={property?.objphotos[1].url || 'https://tailwindcss.com/_next/static/media/beach-house-interior-1.f151eb56.jpg'}
                        alt={`Imagen ${property?.objphotos[1].photoid}`}
                        className="hidden w-full h-52 object-cover rounded-lg sm:block sm:col-span-2 md:col-span-1 lg:row-start-2 lg:col-span-2 lg:h-32"
                    />
                    <Image
                        width={800}
                        height={800}
                        src={property?.objphotos[2].url || 'https://tailwindcss.com/_next/static/media/beach-house-interior-3.7b3b3b3b.jpg'}
                        alt={`Imagen ${property?.objphotos[2].photoid}`}
                        className="hidden w-full h-52 object-cover rounded-lg md:block lg:row-start-2 lg:col-span-2 lg:h-32"
                    />
                </div>
                <dl className="mt-4 text-xs font-medium flex items-center row-start-2 sm:mt-1 sm:row-start-3 md:mt-2.5 lg:row-start-2">
                    <dt className="sr-only">Reviews</dt>
                    <dd className="text-indigo-600 flex items-center dark:text-indigo-400">
                        <Star size={18} className="mr-1" />
                        <span>
                            {property?.decpropertyrating}
                            {/* <span className="text-slate-400 font-normal">(128)</span> */}
                        </span>
                    </dd>
                    <dt className="sr-only">Location</dt>
                    <dd className="flex items-center text-neutral-700 dark:text-neutral-200">
                        <svg width="2" height="2" aria-hidden="true" fill="currentColor" className="mx-3 text-slate-300">
                            <circle cx="1" cy="1" r="1" />
                        </svg>
                        <MapPin size={18} className="mr-1" />
                        <span>{property?.vchaddresscomplement}</span>
                    </dd>
                </dl>
                <div className="mt-4 col-start-1 row-start-3 self-center sm:mt-0 sm:col-start-2 sm:row-start-2 sm:row-span-2 lg:mt-6 lg:col-start-1 lg:row-start-3 lg:row-end-4">
                    <RouteButton route={'disponibilidad'}>
                        Revisar disponibilidad
                    </RouteButton>
                </div>
                <p className="mt-4 text-sm leading-6 col-start-1 sm:col-span-2 lg:mt-6 lg:row-start-4 lg:col-span-1 dark:text-slate-400">
                    {property?.vchdescription}
                </p>
            </div>

            <div className="mt-10">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">Características</h2>
                <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {property?.vchpropertyrules.map((feature, index) => (
                        <li key={index} className="flex items-center text-neutral-700 dark:text-neutral-200">
                            <svg width="2" height="2" aria-hidden="true" fill="currentColor" className="mr-3 text-slate-300">
                                <circle cx="1" cy="1" r="1" />
                            </svg>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}