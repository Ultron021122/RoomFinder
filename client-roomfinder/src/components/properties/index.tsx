'use client';

import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Properties, UserProfile } from '@/utils/interfaces';
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import CardOwner from "@/components/Main/Card";
import { useSession } from "next-auth/react";
import { Separator } from "../ui/separator";
import { universities } from "@/utils/constants";
import { Spinner } from "@nextui-org/react";

const ITEMS_PER_PAGE = 12;

export interface Predict {
    recommended_property_id: number;
    distance: number;
}

export const SectionProperty = () => {
    const [allProperties, setAllProperties] = useState<Properties[]>([]);
    const [allPropertiesPredict, setAllPropertiesPredict] = useState<Properties[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Properties[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingPredict, setIsLoadingPredict] = useState<boolean>(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { data, status } = useSession();
    const userProfileData = data?.user as UserProfile;
    const [filterUniversity, setFilterUniversity] = useState<string>('0');

    const count = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Fetch properties when the component mounts
    useEffect(() => {
        const fetchProperties = async () => {
            setIsLoading(true);
            setErrorSystem(null);
            try {
                const response = await axios.get(`/api/properties`, {
                    headers: {
                        'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                    }
                });
                if (response.status === 200) {
                    setAllProperties(response.data.data);
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
        };

        fetchProperties();
    }, []);

    // Fetch predict data based on user ID
    const fetchPredict = async (userId: number) => {
        setIsLoadingPredict(true);
        try {
            const response = await axios.get(`/api/predict/${userId}`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });

            if (response.status === 200) {
                setAllPropertiesPredict(response.data.data);
            }
        } catch (error) {
            console.log("Error al llamar la API de predicción:", error);
        } finally {
            setIsLoadingPredict(false);
        }
    };

    // Fetch properties based on filters and search query
    useEffect(() => {
        const filtered = allProperties.filter(property => {
            return (
                (filterType === '' || property.propertytypeid === parseInt(filterType) || parseInt(filterType) === 0) &&
                (searchQuery === '' || property.vchtitle.toLowerCase().includes(searchQuery.toLowerCase())) &&
                (filterUniversity === '' || property.vchuniversity === filterUniversity || filterUniversity === '0')
            );
        });
        setFilteredProperties(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    }, [allProperties, searchQuery, filterType, filterUniversity]);

    const paginatedProperties = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredProperties, currentPage]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
    }, [filteredProperties]);

    const content = useMemo(() => {
        if (isLoading) {
            return count.map((item, index) => (
                <SkeletonCard key={index} index={index} />
            ));
        }

        if (errorSystem) {
            return <p className="text-red-500">{errorSystem}</p>;
        }

        if (paginatedProperties.length === 0) {
            return <p>No hay propiedades.</p>;
        }

        return paginatedProperties.map((property, index) => (
            <CardOwner key={index} {...property} />
        ));
    }, [isLoading, errorSystem, paginatedProperties]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        if (status === 'authenticated' && userProfileData?.roleid === 1) {
            const userData = data.user as UserProfile;
            fetchPredict(userData.usuarioid);
        }
    }, [status]);

    return (
        <div className="max-w-6xl mx-auto min-h-screen p-2 sm:p-0">
            <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 justify-between items-center gap-2 mb-5">
                <Input
                    type="text"
                    placeholder="Busca propiedad por título. Ej. Casa atlas"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="mb-4 sm:mb-0 sm:mr-2 border-gray-300 shadow focus-visible:ring-0 focus:border-blue-400"
                />
                <Select
                    value={filterType}
                    onValueChange={(value) => setFilterType(value)}
                >
                    <SelectTrigger className="border-gray-300 shadow focus:ring-0 focus:border-blue-400">
                        <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-900">
                        <SelectItem value="0">Todos</SelectItem>
                        <SelectItem value="3">Apartamento</SelectItem>
                        <SelectItem value="1">Casa</SelectItem>
                        <SelectItem value="2">Habitación</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={filterUniversity}
                    onValueChange={(value) => setFilterUniversity(value)}
                >
                    <SelectTrigger className="border-gray-300 shadow focus:ring-0 focus:border-blue-400">
                        <SelectValue placeholder="Filtrar por universidad" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-900">
                        <SelectItem value="0">Todas</SelectItem>
                        {
                            universities.map((university, index) => (
                                <SelectItem key={index} value={university.name}>
                                    {university.name}
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>
            
            {/* Mostrar los resultados de la predicción aquí */}
            {status === 'authenticated' && userProfileData?.roleid === 1 && (
                <div className="mt-5">
                    <h3 className="text-xl font-semibold mb-4">Propiedades Recomendadas para Ti</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-2">
                        {isLoadingPredict ? (
                            <Spinner color="success" className="col-span-full" />
                        ) : allPropertiesPredict.length > 0 ? (
                            allPropertiesPredict.map((property, index) => (
                                <CardOwner key={index} {...property} />
                            ))
                        ) : (
                            <p>No se encontraron propiedades recomendadas.</p>
                        )}
                    </div>
                </div>
            )}

            <Separator className="bg-gray-300 dark:bg-gray-500" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-2">
                {content}
            </div>

            <Pagination className="my-3">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink onClick={() => handlePageChange(index + 1)} isActive={currentPage === index + 1}>
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};


export function SkeletonCard({ index }: { index: number }) {
    return (
        <div className="flex flex-col space-y-3" key={index}>
            <Skeleton className="min-w-screen h-60 rounded-xl bg-gray-300 dark:bg-gray-800" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-gray-300 dark:bg-gray-800" />
                <Skeleton className="h-4 w-[200px] bg-gray-300 dark:bg-gray-800" />
            </div>
        </div>
    );
}

export default SectionProperty;