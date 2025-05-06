'use client';

import { useSession } from 'next-auth/react';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN, ARRENDADOR, ESTUDIANTE } from '@/utils/constants';
import { LeaseStatus, UserProfile, vwLeasesGET } from '@/utils/interfaces';

interface LeasesContextProps {
    leases: vwLeasesGET[];
    leasesStatus: LeaseStatus[];
    isLoading: boolean;
    error: string | null;
    refetchLeases: () => void;
    refetchLeaseStatus: () => void;
    reload: () => void;
}

const LeasesContext = createContext<LeasesContextProps | undefined>(undefined);

export const LeasesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const session = useSession();
    const [leases, setLeases] = useState<vwLeasesGET[]>([]);
    const [leaseStatus, setLeaseStatus] = useState<LeaseStatus[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLeases = async () => {
        if (!process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY) {
            setError('Internal secret key is missing.');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const { data: { data } } = await axios.get(`/api/leases`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`,
                },
            });
            setLeases(data);
        } catch (err: any) {
            console.error('Error fetching leases:', err);
            setError(err.response?.data?.message || 'An error occurred while fetching leases.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserLeases = async (role: number, userId: number) => {
        if (!process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY) {
            setError('Internal secret key is missing.');
            return;
        }

        let url = '';
        switch (role) {
            case ESTUDIANTE:
                url = `/api/leases/user/${userId}`;
                break;
            case ARRENDADOR:
                url = `/api/leases/leasor/${userId}`;
                break;
            default:
                setError('Invalid role for fetching leases.');
                return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const { data: { data } } = await axios.get(url, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`,
                },
            });
            setLeases(data);
        } catch (err: any) {
            console.error('Error fetching user-specific leases:', err);
            setError(err.response?.data?.message || 'An error occurred while fetching user-specific leases.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLeaseStatus = async () => {
        try {
            const response = await axios.get(`/api/leases-status`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });
            setLeaseStatus(response.data.data);
        } catch (err: any) {
            setError(err.response?.data.message || 'An error occurred');
        }
    }

    const reload = () => {
        const sessionData = session.data?.user as UserProfile;
        if (sessionData?.roleid === ADMIN) {
            fetchLeases();
        } else if (sessionData) {
            fetchUserLeases(sessionData.roleid, sessionData.usuarioid);
        }

        fetchLeaseStatus();
    };

    const refetchLeases = () => {
        reload();
    };

    useEffect(() => {
        if (session.status === 'authenticated') {
            reload();
        }
    }, [session]);

    return (
        <LeasesContext.Provider
            value={{
                leases,
                leasesStatus: leaseStatus,
                isLoading,
                error,
                refetchLeases,
                refetchLeaseStatus: fetchLeaseStatus,
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