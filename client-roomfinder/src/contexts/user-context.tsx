'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User, Roles } from '@/utils/interfaces';
import { roles } from '@/utils/constants';

interface UserContextProps {
    users: User[];
    roles: Roles[];
    isLoading: boolean;
    error: string | null;
    refetchUsers: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/users`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });
            setUsers(response.data.data);
        } catch (err) {
            const error = err as any;
            setError(error.response?.data.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <UserContext.Provider
            value={{
                users,
                roles,
                isLoading,
                error,
                refetchUsers: fetchUsers,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};