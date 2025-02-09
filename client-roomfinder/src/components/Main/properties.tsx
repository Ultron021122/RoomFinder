'use client';

import axios from "axios";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Properties } from '@/utils/interfaces';
import CardOwner from "./Card";
import { Spinner } from "@nextui-org/react";

export const SectionProperty = () => {
    const [properties, setProperties] = useState<Properties[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);

    const fetchProperties = useCallback(async () => {
        setIsLoading(true);
        setErrorSystem(null);
        try {
            const response = await axios.get(`/api/properties/feature`);
            if (response.status === 200) {
                setProperties(response.data.data);
            } else {
                setErrorSystem('Error al cargar las propiedades');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorSystem(error.response?.data?.message || 'Error al cargar las propiedades');
            } else {
                setErrorSystem('Error desconocido al cargar las propiedades');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const content = useMemo(() => {
        if (isLoading) {
            return <Spinner />;
        }

        if (errorSystem) {
            return <p className="text-red-500">{errorSystem}</p>;
        }

        if (properties.length === 0) {
            return <p>No hay propiedades destacadas.</p>;
        }

        return properties.map((property, index) => (
            <CardOwner key={index} {...property} />
        ));
    }, [isLoading, errorSystem, properties]);

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {content}
        </div>
    );
};

export default SectionProperty;