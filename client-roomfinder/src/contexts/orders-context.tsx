'use client';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useState, useEffect } from 'react';
import { ADMIN, ARRENDADOR, ESTUDIANTE, role } from '@/utils/constants';
import axios from 'axios';
import { Orders, UserProfile, vwOrders } from '@/utils/interfaces';

interface OrderContextProps {
    orders: vwOrders[];
    isLoading: boolean;
    error: string | null;
    refetchOrders: () => void;
    reload: () => void;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const session = useSession();
    const [orders, setOrders] = useState<vwOrders[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data: { data } } = await axios.get(`/api/orders-payments`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });
            setOrders(data);
        } catch (err: any) {
            setError(err.response?.data.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserOrders = async (role: number, userId: number) => {
        let url: string;
        switch (role) {
            case ESTUDIANTE: url = `/api/orders-payments/user/${userId}`; break;
            case ARRENDADOR: url = `/api/orders-payments/leasor/${userId}`; break;
            default: url = ''; break;
        }

        setIsLoading(true)
        setError(null)
        try {
            const { data: { data } } = await axios.get(url, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });
            setOrders(data);
        } catch (err: any) {
            setError(err.response?.data.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    const reload = () => {
        const sessionData = session.data?.user as UserProfile;
        if (sessionData.roleid === ADMIN) {
            fetchOrders();
        } else {
            fetchUserOrders(sessionData.roleid, sessionData.usuarioid);
        }
    }

    const refetchOrders = () => {
        reload();
    }

    useEffect(() => {
        if (session.status === 'authenticated') {
            const sessionData = session.data?.user as UserProfile;
            if (sessionData.roleid === ADMIN) {
                fetchOrders();
            } else {
                fetchUserOrders(sessionData.roleid, sessionData.usuarioid);
            }
        }
    }, [session.status]);

    return (
        <OrderContext.Provider
            value={{
                orders, 
                isLoading, 
                error, 
                refetchOrders, 
                reload
            }}
        >
            {children}
        </OrderContext.Provider>
    );

};

export const useOrderContext = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrderContext must be used within a OrderContextProvider');
    }
    return context;
};