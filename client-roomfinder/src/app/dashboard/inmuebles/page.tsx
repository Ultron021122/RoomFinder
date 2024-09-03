'use client';
import Inmuebles from "@/components/Dashboard/Inmuebles";
import AppInmuebles from '@/components/App/Inmuebles';
import { useSession } from 'next-auth/react';
import { rolesMapping, role } from "@/utils/constants";
import { UserProfile } from "@/utils/interfaces";

export default function InmueblesPage() {
    const { data: session } = useSession();
    const user = session?.user as UserProfile;
    const roleName = rolesMapping[user?.roleid] || 'Desconocido';

    const renderComponent = () => {
        switch (roleName) {
            case role[0].vchname:
                return <AppInmuebles />;
            case role[1].vchname:
                return <Inmuebles />;
            default:
                return <Inmuebles />; // Default component if no role matches
        }
    };

    return (
        <div>
            {renderComponent()}
        </div>
    );
}