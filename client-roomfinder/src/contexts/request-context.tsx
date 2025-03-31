'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { LeaseRequest, RequestStatus } from '@/utils/interfaces';

interface RequestContextProps {
    request: LeaseRequest[];
    requestStatus: RequestStatus[];
    isLoading: boolean;
    error: string | null;
    refetchRequest: () => void;
    refetchRequestStatus: () => void;
}

const RequestContext = createContext<RequestContextProps | undefined>(undefined);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [request, setRequest] = useState<LeaseRequest[]>([]);
    const [requestStatus, setRequestStatus] = useState<RequestStatus[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRequest = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/requests`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });
            setRequest(response.data.data);
        } catch(err: any) {
            setError(err.response?.data.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRequestStatus = async () => {
        try {
            const response = await axios.get(`/api/request-status`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });
            setRequestStatus(response.data.data);
        } catch(err: any) {
            setError(err.response?.data.message || 'An error occurred');
        }
    };

    useEffect(() => {
        fetchRequest();
        fetchRequestStatus();
    }, []);

    return (
        <RequestContext.Provider
            value={{
                request,
                requestStatus,
                isLoading,
                error,
                refetchRequest: fetchRequest,
                refetchRequestStatus: fetchRequestStatus,
            }}
        >
            {children}
        </RequestContext.Provider>
    );
};

export const useRequestContext = () => {
    const context = useContext(RequestContext);
    if (!context) {
        throw new Error('useRequestContext must be used within a RequestProvider');
    }
    return context;
};