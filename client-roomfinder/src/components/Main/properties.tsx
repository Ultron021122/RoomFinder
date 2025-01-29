'use client';

import axios from "axios";
import { useEffect, useState } from "react";
import { Properties, PropertyType } from '@/utils/interfaces'
import CardOwner from "./Card";

export const SectionProperty = () => {
    const [properties, setProperties] = useState<Properties[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {

            setIsLoading(true);
            setErrorSystem(null);
            try {
                const response = await axios.get(`/api/properties/feature`);
                setProperties(response.data.data);
                setIsLoading(false);
            } catch (Error: any) {
                setErrorSystem(Error.response?.data.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperties();
    }, []);


    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {
                properties.map((property, index) => (
                    <CardOwner
                        {...property}
                    />
                ))
            }
        </div>
    );
};


export default SectionProperty;