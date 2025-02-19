'use client';

import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Properties } from '@/utils/interfaces';
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import CardOwner from "@/components/Main/Card";

const ITEMS_PER_PAGE = 12;

export const SectionProperty = () => {
    const [allProperties, setAllProperties] = useState<Properties[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Properties[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);

    const count = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    useEffect(() => {
        const fetchProperties = async () => {
            setIsLoading(true);
            setErrorSystem(null);
            try {
                const response = await axios.get(`/api/properties`);
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

    useEffect(() => {
        const filtered = allProperties.filter(property => {
            return (
                (filterType === '' || property.propertytypeid === parseInt(filterType) || parseInt(filterType) === 0) &&
                (searchQuery === '' || property.vchtitle.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        });
        setFilteredProperties(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    }, [allProperties, searchQuery, filterType]);

    const paginatedProperties = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredProperties, currentPage]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
    }, [filteredProperties]);

    const content = useMemo(() => {
        if (isLoading) {
            // return <Spinner />;
            return count.map((item, index) => (
                <SkeletonCard index={index} />
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

    return (
        <div className="max-w-6xl mx-auto min-h-screen mt-5 p-2 sm:p-0">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
                <Input
                    placeholder="Buscar propiedades..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="mb-4 sm:mb-0 border-gray-700 sm:mr-2"
                />
                <Select
                    value={filterType}
                    onValueChange={(value) => setFilterType(value)}
                >
                    <SelectTrigger className="border-gray-700">
                        <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-950">
                        <SelectItem value="0" className="">Todos</SelectItem>
                        <SelectItem value="3">Apartamento</SelectItem>
                        <SelectItem value="1">Casa</SelectItem>
                        <SelectItem value="2">Habitación</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 p-2">
                {content}
            </div>

            <Pagination className="my-3">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink onClick={() => handlePageChange(index + 1)} isActive={currentPage === index + 1 ? true : false} >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem className="">
                        <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default SectionProperty;

export function SkeletonCard({ index }: { index: number }) {
    return (
        <div className="flex flex-col space-y-3" key={index}>
            <Skeleton className="min-w-screen h-60 rounded-xl bg-gray-300 dark:bg-gray-800" key={index+1} />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-gray-300 dark:bg-gray-800" key={index+2} />
                <Skeleton className="h-4 w-[200px] bg-gray-300 dark:bg-gray-800" key={index+3} />
            </div>
        </div>
    )
}
