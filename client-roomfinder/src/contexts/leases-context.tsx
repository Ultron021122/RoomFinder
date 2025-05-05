'use client';

import { useSession } from 'next-auth/react';
import { RequestStatus, UserProfile, vwLeasesGET } from '@/utils/interfaces';
import { createContext, useContext, useState, useEffect } from 'react';
import { ADMIN, ARRENDADOR, ESTUDIANTE } from '@/utils/constants';
import axios from 'axios';

interface LeasesContextProps {
    request: vwLeasesGET[];
    isLoading: boolean;
    error: string | null;
    refetchRequest: () => void;
    refetchRequestStatus: () => void;
    reload: () => void;
}

const LeasesContext = createContext<LeasesContextProps | undefined>(undefined);

export const LeasesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const session = useSession();
    const [request, setRequest] = useState<vwLeasesGET[]>([]);
    const [requestStatus, setRequestStatus] = useState<RequestStatus[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLeases = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data: { data } } = await axios.get(`/api/leases`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });

            setRequest(data);

        } catch (err: any) {
            setError(err.response?.data.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserLeasingLeases = async (role: number, userId: number) => {
        let url: string;
        switch (role) {
            case ESTUDIANTE: url = `/api/leases/user/${userId}`; break;
            case ARRENDADOR: url = `/api/leases/leasor/${userId}`; break;
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
            setRequest(data)

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
            fetchLeases();
        } else {
            fetchUserLeasingLeases(sessionData.roleid, sessionData.usuarioid)
        }
    }

    const refetchRequest = () => {
        reload();
    }

    useEffect(() => {
        if (session.status === 'authenticated') {
            const sessionData = session.data.user as UserProfile;
            if (sessionData.roleid === ADMIN) {
                fetchLeases();
            } else {
                fetchUserLeasingLeases(sessionData.roleid, sessionData.usuarioid)
            }

            fetchRequestStatus();
        }
    }, [session]);

    return (
        <LeasesContext.Provider
            value={{
                request,
                isLoading,
                error,
                refetchRequest,
                refetchRequestStatus: fetchRequestStatus,
                reload,
            }}
        >
            {children}
        </LeasesContext.Provider>
    );
};

export const useLeasesContext = () => {
    const context = useContext(LeasesContext);
    if (!context) {
        throw new Error('useLeasesContext must be used within a LeasesProvider');
    }
    return context;
};