'use client';

import { useSession } from 'next-auth/react';
import { LeaseRequest, Property, RequestStatus, UserProfile, vwLeaseRequest } from '@/utils/interfaces';
import { createContext, useContext, useState, useEffect } from 'react';
import { ADMIN, ARRENDADOR, ESTUDIANTE } from '@/utils/constants';
import axios from 'axios';

interface RequestContextProps {
    request: vwLeaseRequest[];
    requestStatus: RequestStatus[];
    properties: Property[];
    isLoading: boolean;
    error: string | null;
    refetchRequest: () => void;
    refetchRequestStatus: () => void;
    reload: () => void;
}

const RequestContext = createContext<RequestContextProps | undefined>(undefined);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const session = useSession();
    const [properties, setProperties] = useState<Property[]>([])
    const [request, setRequest] = useState<vwLeaseRequest[]>([]);
    const [requestStatus, setRequestStatus] = useState<RequestStatus[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPropertyData = async (propertyId: number) => {
        try {
            const { data: { data } } = await axios.get(`/api/properties/${propertyId}`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            })

            return data;
        } catch (err: any) {
            setError(err.response?.data.message || 'An error occurred');
            return null;
        }
    };

    const fetchRequest = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data: { data } } = await axios.get(`/api/requests`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });
            const dataAsArray = [...data];
            // const properties = await Promise.all(dataAsArray.map(leaseRequest => fetchPropertyData(leaseRequest.propertyid)))

            setRequest(data);
            // setProperties(properties);

        } catch (err: any) {
            setError(err.response?.data.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserLeasingRequests = async (role: number, userId: number) => {
        let url: string;
        switch (role) {
            case ESTUDIANTE: url = `/api/requests/user/${userId}`; break;
            case ARRENDADOR: url = `/api/requests/leasor/${userId}`; break;
            default: url = ''; break;
        }

        setIsLoading(true)
        setError(null)
        try {
            const { data: { data } } = await axios.get(url, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            })
            const dataAsArray = [...data]; // por si la respuesta no es un arreglo
            // const propertiesData = await Promise.all(dataAsArray.map(leaseRequest => fetchPropertyData(leaseRequest.propertyid)))

            setRequest(data)
            // setProperties(propertiesData)

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchRequestStatus = async () => {
        try {
            const response = await axios.get(`/api/request-status`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });
            setRequestStatus(response.data.data);
        } catch (err: any) {
            setError(err.response?.data.message || 'An error occurred');
        }
    };

    const reload = () => {
        const sessionData = session.data?.user as UserProfile;
        if (sessionData.roleid === ADMIN) {
            fetchRequest();
        } else {
            fetchUserLeasingRequests(sessionData.roleid, sessionData.usuarioid)
        }
    }

    useEffect(() => {
        if (session.status === 'authenticated') {
            const sessionData = session.data.user as UserProfile;
            if (sessionData.roleid === ADMIN) {
                fetchRequest();
            } else {
                fetchUserLeasingRequests(sessionData.roleid, sessionData.usuarioid)
            }

            fetchRequestStatus();
        }
    }, [session]);

    return (
        <RequestContext.Provider
            value={{
                request,
                requestStatus,
                properties,
                isLoading,
                error,
                refetchRequest: fetchRequest,
                refetchRequestStatus: fetchRequestStatus,
                reload,
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