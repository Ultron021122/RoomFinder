'use client';

import { useSession } from 'next-auth/react';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { LeaseRequest, RequestStatus, UserProfile, Property } from '@/utils/interfaces';
import { ADMIN, ARRENDADOR, ESTUDIANTE } from '@/utils/constants';

interface RequestContextProps {
    leasingRequests: LeaseRequest[];
    properties: Property[]
    requestStatus: RequestStatus[];
    isLoading: boolean;
    error: string | null;
    reload: () => void
}

const RequestContext = createContext<RequestContextProps | undefined>(undefined);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const session = useSession()
    const [leasingRequests, setLeasingRequests] = useState<LeaseRequest[]>([])
    const [properties, setProperties] = useState<Property[]>([])
    const [requestStatus, setRequestStatus] = useState<RequestStatus[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const fetchPropertyData = async(propertyId : number) => {
        try {
            const {data:{data}} = await axios.get(`/api/properties/${propertyId}`,{
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            })
            
            return data
        } catch (error) {
            console.log(error)
            return null
        }
    };

    // trae todas las solicitudes de arrendamiento (capacidad del administrador)
    const fetchLeasingRequests = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const {data: {data}} = await axios.get(`/api/requests`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });
            const dataAsArray = [...data];
            const properties = await Promise.all(dataAsArray.map(leaseRequest => fetchPropertyData(leaseRequest.propertyid)))
            
            setLeasingRequests(dataAsArray);
            setProperties(properties);
        } catch(err: any) {
            setError(err.response?.data.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // solicitudes de arrendamiento del usuario (estudiante | arrendador)
    const fetchUserLeasingRequests =  async(role: number ,userId: number) => {
        let url : string;
        switch(role) {
            case ESTUDIANTE: url = `/api/requests/user/${userId}`; break;
            case ARRENDADOR: url = `/api/requests/leasor/${userId}`; break;
            default: url=''; break;
        }

        setIsLoading(true)
        setError(null)
        try {
            console.log('api a consultar: ', url);
            const {data: {data}} = await axios.get(url, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            })
            const dataAsArray = [...data]; // por si la respuesta no es un arreglo
            const propertiesData = await Promise.all(dataAsArray.map(leaseRequest => fetchPropertyData(leaseRequest.propertyid)))

            setLeasingRequests(data)
            setProperties(propertiesData)

        } catch (error) {
            console.log(error)
        }finally{
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
        } catch(err: any) {
            setError(err.response?.data.message || 'An error occurred');
        }
    };

    const reload = () => {
        const sessionData = session.data?.user as UserProfile;
        if(sessionData.roleid === ADMIN){
            fetchLeasingRequests();
        } else {
            fetchUserLeasingRequests(sessionData.roleid, sessionData.usuarioid)
        }
    }

    useEffect(() => {
        if(session.status === 'authenticated'){
            const sessionData = session.data.user as UserProfile;
            if(sessionData.roleid === ADMIN){
                fetchLeasingRequests();
            } else {
                fetchUserLeasingRequests(sessionData.roleid, sessionData.usuarioid)
            }
            
            fetchRequestStatus();
        }       
    }, [session]);

    return (
        <RequestContext.Provider
            value={{
                leasingRequests,
                properties,
                requestStatus,
                isLoading,
                error,
                reload
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